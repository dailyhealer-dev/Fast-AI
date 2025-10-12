from django.db import models
from datetime import datetime
from users.models import UserAccount

# ---- Create a prompt model 
class Prompt(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='prompts', null=True, blank=True)
    title = models.CharField(max_length=100, blank=True)
    input_text = models.TextField(max_length=3000)
    output_text = models.TextField(max_length=3000, blank=True, null=True)
    image = models.ImageField(upload_to='prompts/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    confidence = models.FloatField(null=True, blank=True)       # AI confidence score
    model_used = models.CharField(max_length=50, default="fastai")  # which model handled it
    metadata = models.JSONField(null=True, blank=True)          # extra info like temperature, tokens, etc.

    def __str__(self):
        return self.title or f"Prompt {self.id}"

    def time_ago(self):
        now = datetime.now(self.created_at.tzinfo)
        delta = now - self.created_at
        if delta.days > 0:
            return f"{delta.days} days ago"
        elif delta.seconds > 3600:
            return f"{delta.seconds // 3600} hours ago"
        elif delta.seconds > 60:
            return f"{delta.seconds // 60} minutes ago"
        return "just now"

# ---- Create a Conversation model
class Conversation(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='conversations')
    title = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or f"Conversation {self.id}"
    
# Create a Message Model
class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=200, choices=[('user', 'User'), ('assistant', 'Assistant')])
    content = models.TextField()
    image = models.ImageField(upload_to='messages/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}: {self.content[:40]}"
