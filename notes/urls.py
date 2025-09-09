from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import NoteViewSet, register_user, homepage, signup, login

# router = DefaultRouter()
# router.register(r'notes', NoteViewSet, basename='note')

urlpatterns = [

    path('', homepage, name='homepage'),
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),


    path('api/register/', register_user, name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # path('api/', include(router.urls)),


]
