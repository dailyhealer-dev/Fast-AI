from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.conf import settings
from langchain_ibm import WatsonxLLM
from langchain_core.messages import AIMessage
from .models import Conversation, Message, Prompt
from .serializers import ConversationSerializer, MessageSerializer, PromptSerializer

# --- Constants ---
MAX_WORDS = 1500          # Max words in AI response
MAX_USER_WORDS = 1000     # Max words in user input
MAX_MESSAGES_PER_CONVERSATION = 8  # Limit user messages per conversation

# --- Helper function: Save AI message ---
def save_ai_message(conversation_id: int, ai_message: AIMessage):
    """Save the AI-generated message and auto-generate a clean title if missing."""
    conversation = Conversation.objects.get(id=conversation_id)

    # Clean AI message content (remove "Assistant:" or "assistant:")
    content = ai_message.content.strip()
    if content.lower().startswith("assistant:"):
        content = content.split(":", 1)[1].strip()

    # Save the AI-generated message
    msg = Message.objects.create(
        conversation=conversation,
        sender="assistant",
        content=content
    )

    # Auto-generate title if it doesn't exist
    if not conversation.title:
        # Use first few words of the cleaned content
        first_words = " ".join(content.split()[:6])
        title = first_words[:50].rstrip(".!?")
        conversation.title = title or "New Chat"
        conversation.save(update_fields=["title"])

    return msg



# --- Message List View ---
class MessageListView(generics.ListAPIView):
    """
    Returns all messages for a given conversation.
    GET /aiassistant/messages/?conversation=<conversation_id>
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.request.query_params.get("conversation")
        if not conversation_id:
            return Message.objects.none()
        return Message.objects.filter(conversation_id=conversation_id).order_by("created_at")



# --- Helper function to save AI messages ---
def save_ai_message(conversation_id: int, ai_message: AIMessage):
    """Save AI message and generate conversation title if missing."""
    conversation = Conversation.objects.get(id=conversation_id)

    # Clean AI message content (remove "Assistant:" prefix)
    content = ai_message.content.strip()
    if content.lower().startswith("assistant:"):
        content = content.split(":", 1)[1].strip()

    # Save AI-generated message
    msg = Message.objects.create(
        conversation=conversation,
        sender="assistant",
        content=content
    )

    # Auto-generate title if missing
    if not conversation.title:
        first_words = " ".join(content.split()[:6])
        title = first_words[:50].rstrip(".!?")
        conversation.title = title or "New Chat"
        conversation.save(update_fields=["title"])

    return msg

# --- Message Create View ---
class MessageCreateView(generics.CreateAPIView):
    """
    Handles user messages:
    - Validates message length.
    - Saves the user's message.
    - Sends it to Watsonx AI using LangChain.
    - Uses a system prompt to guide AI responses for health-focused Q&A.
    - Limits a conversation to 8 user messages; creates a new conversation automatically if exceeded.
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    SYSTEM_PROMPT = (
        "You are a professional health assistant. Always answer health-related questions accurately and politely.\n"
        "Do NOT create any new questions or topics. Only answer the user question.\n\n"
        "- Always provide sources for only health related question.\n"
        "- Use Markdown formatting for emphasis:\n"
        "  - **Bold important terms**\n"
        "  - Use bullet points for lists\n"
        "  - Use tables when appropriate\n"
        "  - Use headings for sections"
    )

    def perform_create(self, serializer):
        request = serializer.context.get("request")

        # --- Determine conversation ---
        conversation = serializer.validated_data.get("conversation")

        if conversation:
            # Count existing user messages
            existing_user_messages = Message.objects.filter(
                conversation=conversation,
                sender="user"
            ).count()

            # If user reached max messages, create a new conversation
            if existing_user_messages >= MAX_MESSAGES_PER_CONVERSATION:
                conversation = Conversation.objects.create(user=request.user)
                serializer.validated_data['conversation'] = conversation
        else:
            # If no conversation is provided, create one
            conversation = Conversation.objects.create(user=request.user)
            serializer.validated_data['conversation'] = conversation

        # --- Validate user message ---
        user_content = serializer.validated_data.get("content", "").strip()
        if not user_content:
            raise ValueError("Message cannot be empty.")
        if len(user_content.split()) > MAX_USER_WORDS:
            raise ValueError(f"Message too long (max {MAX_USER_WORDS} words).")

        # --- Save user message ---
        message = serializer.save()

        # --- Prepare full prompt for AI ---
        full_prompt = f"{self.SYSTEM_PROMPT}\n\nUser question:\n{user_content}"

        try:
            llm = WatsonxLLM(
                model_id="ibm/granite-3-3-8b-instruct",
                url=settings.WATSONX_URL,
                project_id=settings.WATSONX_PROJECT_ID,
                apikey=settings.WATSONX_APIKEY,
                params={
                    "decoding_method": "greedy",
                    "temperature": 0,
                    "min_new_tokens": 10,
                    "max_new_tokens": 800,
                    "repetition_penalty": 1.2,
                }
            )

            # --- Invoke AI model ---
            raw_response = llm.invoke(full_prompt)

            # --- Normalize AI response ---
            if hasattr(raw_response, "content"):
                ai_response = raw_response.content
            elif isinstance(raw_response, dict) and "generations" in raw_response:
                ai_response = "\n".join([g.get("text", "") for g in raw_response["generations"]])
            elif isinstance(raw_response, list):
                ai_response = "\n".join(str(part) for part in raw_response)
            else:
                ai_response = str(raw_response)

            ai_response = ai_response.strip()

            # --- Truncate AI response if too long ---
            words = ai_response.split()
            if len(words) > MAX_WORDS:
                ai_response = " ".join(words[:MAX_WORDS])

            # --- Save AI response ---
            ai_message = AIMessage(content=ai_response)
            save_ai_message(message.conversation.id, ai_message)

        except Exception as e:
            print("WatsonxAI error:", str(e))
            error_text = f"Sorry, I encountered an error generating a response. (Error: {str(e)})"
            ai_message = AIMessage(content=error_text)
            save_ai_message(message.conversation.id, ai_message)

        return message

    def create(self, request, *args, **kwargs):
        # --- Save message and generate AI response ---
        response = super().create(request, *args, **kwargs)

        # --- Return all messages of the conversation ---
        conversation_id = request.data.get("conversation")
        messages = Message.objects.filter(conversation_id=conversation_id).order_by("created_at")
        serialized = MessageSerializer(messages, many=True)
        return Response(serialized.data, status=status.HTTP_201_CREATED)


# --- Latest Message View ---
class LatestMessageView(generics.RetrieveAPIView):
    """
    Returns the latest message (user or assistant) for a given conversation.
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        conversation_id = self.kwargs.get("conversation_id")
        return Message.objects.filter(conversation_id=conversation_id).order_by("-created_at").first()


# --- Conversation List & Create View ---
class ConversationListCreateView(generics.ListCreateAPIView):
    """
    Lists all conversations for the authenticated user and allows creating new ones.
    """
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# --- Conversation Detail View ---
class ConversationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific conversation belonging to the user.
    """
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)


# --- Prompt List & Create View ---
class PromptListCreateView(generics.ListCreateAPIView):
    """
    Retrieve and create prompts by the user.
    """
    queryset = Prompt.objects.all().order_by('-created_at')
    serializer_class = PromptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
