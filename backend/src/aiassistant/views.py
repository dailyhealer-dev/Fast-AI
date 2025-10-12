from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.conf import settings
from langchain_ibm import WatsonxLLM
from langchain_core.messages import AIMessage
from .models import Conversation, Message
from .models import Prompt
from .serializers import ConversationSerializer, MessageSerializer, PromptSerializer


MAX_WORDS = 1500
# Maximum allowed words for user message
MAX_USER_WORDS = 1000

# --- Helper function: Save AI message ---
def save_ai_message(conversation_id: int, ai_message: AIMessage):
    """Save the AI-generated message into the database."""
    conversation = Conversation.objects.get(id=conversation_id)
    msg = Message.objects.create(
        conversation=conversation,
        sender="assistant",
        content=ai_message.content
    )
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

        return (
            Message.objects
            .filter(conversation_id=conversation_id)
            .order_by("created_at")
        )


# --- Message Create View + AI Response ---
class MessageCreateView(generics.CreateAPIView):
    """
    Handles user messages:
    - Validates message length.
    - Saves the user's message.
    - Sends it to Watsonx AI using LangChain.
    - Formats and truncates AI response to MAX_WORDS.
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Validate user message
        user_content = serializer.validated_data.get("content", "").strip()
        if not user_content:
            raise ValueError("Message cannot be empty.")
        if len(user_content.split()) > MAX_USER_WORDS:
            raise ValueError(f"Message too long (max {MAX_USER_WORDS} words).")

        # Save user message
        message = serializer.save()

        # AI response
        try:
            llm = WatsonxLLM(
                model_id="ibm/granite-3-8b-instruct",
                url=settings.WATSONX_URL,
                project_id=settings.WATSONX_PROJECT_ID,
                apikey=settings.WATSONX_APIKEY,
                params={
                    "decoding_method": "greedy",          # GenParams.DECODING_METHOD
                    "temperature": 0,                     # GenParams.TEMPERATURE
                    "min_new_tokens": 5,                  # GenParams.MIN_NEW_TOKENS
                    "max_new_tokens": 2000,               # GenParams.MAX_NEW_TOKENS
                    "repetition_penalty": 1.2,            # GenParams.REPETITION_PENALTY
                    "stop_sequences": ["\n\n"]            # GenParams.STOP_SEQUENCES
                }
            )
            # Generate AI response safely
            raw_response = llm.invoke(user_content)
            print("Raw WatsonxAI response type:", type(raw_response))
            print("Raw WatsonxAI response content:", raw_response)

            # Normalize response into one clean string
            if hasattr(raw_response, "content"):
                ai_response = raw_response.content
            elif isinstance(raw_response, dict):
                if "generations" in raw_response:
                    ai_response = "\n".join([g.get("text", "") for g in raw_response["generations"]])
                elif "output" in raw_response:
                    ai_response = str(raw_response["output"])
                else:
                    ai_response = str(raw_response)
            elif isinstance(raw_response, list):
                ai_response = "\n".join(str(part) for part in raw_response)
            else:
                ai_response = str(raw_response)

            # Strip extra whitespace/newlines
            ai_response = " ".join(ai_response.split())
            ai_response = ai_response.lstrip("?").strip()
            

            # Truncate to MAX_WORDS
            words = ai_response.split()
            if len(words) > MAX_WORDS:
                ai_response = " ".join(words[:MAX_WORDS])

            # Save AI response
            ai_message = AIMessage(content=ai_response)
            save_ai_message(message.conversation.id, ai_message)

        except Exception as e:
            # Log actual exception for debugging
            print("WatsonxAI error:", str(e))
            
            # Save fallback message including part of the exception
            error_text = (
                "Sorry, I encountered an error generating a response."
                f" (Error: {str(e)})"
            )
            ai_message = AIMessage(content=error_text)
            save_ai_message(message.conversation.id, ai_message)

        return message


    def create(self, request, *args, **kwargs):
        # Create message and save AI response
        response = super().create(request, *args, **kwargs)

        # Return all messages of the conversation
        conversation_id = request.data.get("conversation")
        messages = Message.objects.filter(conversation_id=conversation_id).order_by("created_at")
        serialized = MessageSerializer(messages, many=True)

        return Response(serialized.data, status=status.HTTP_201_CREATED)

class LatestMessageView(generics.RetrieveAPIView):
    """
    Returns the latest message (user or assistant) for a given conversation.
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        conversation_id = self.kwargs.get("conversation_id")
        return (
            Message.objects.filter(conversation_id=conversation_id)
            .order_by("-created_at")
            .first()
        )

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

# --- Prompt Create and Retrieve Detail View ---
class PromptListCreateView(generics.ListCreateAPIView):
    """
    Retrieve and Create a prompt by the user.
    """
    queryset = Prompt.objects.all().order_by('-created_at')
    serializer_class = PromptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)