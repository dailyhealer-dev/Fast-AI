from django.urls import path
from . import views

# ---- URL Path for Views
urlpatterns = [
    path('conversations/', views.ConversationListCreateView.as_view(), name='conversation-list'),
    path('conversations/<int:pk>/', views.ConversationDetailView.as_view(), name='conversation-detail'),
    path("messages/all/", views.MessageListView.as_view(), name="message-list"),
    path('messages/', views.MessageCreateView.as_view(), name='message-create'),
    path('prompts/', views.PromptListCreateView.as_view(), name='prompt-list'),
    path("conversations/<int:conversation_id>/latest-message/", views.LatestMessageView.as_view(), name="latest-message"),
]