from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import NoteViewSet, register_user, homepage, signup, login

urlpatterns = [

    # HTML page views
    path('', homepage, name='homepage'),
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),

    # API endpoints
    path('api/register/', register_user, name='register'),
    path('api/notes/', NoteViewSet.as_view({'get': 'list', 'post': 'create'}), name='note-list'),
    path('api/notes/<str:pk>/', NoteViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='note-detail'),
    
    # Simple JWT token endpoints for login
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
