from rest_framework import serializers
from .models import Conversation, Message, Prompt

# ---- Create a Message Serializers
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'conversation', 'content', 'sender', 'created_at']
        read_only_fields = ['sender', 'id', 'created_at']  # prevent client from sending this

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['sender'] = request.user  # if using FK to User
        else:
            validated_data['sender'] = 'user'  # if sender is a CharField
        return super().create(validated_data)

# ---- Create a Conversation Serializers
class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())  # ✅ Auto-assign user

    class Meta:
        model = Conversation
        fields = ['id', 'user', 'title', 'created_at', 'messages']
        read_only_fields = ['id', 'created_at', 'messages']

# ---- Create a Prompt Serializers
class PromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = ['id', 'user', 'title', 'input_text', 'output_text', 'image', 'created_at']
        read_only_fields = ['id', 'created_at']
