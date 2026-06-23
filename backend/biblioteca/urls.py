from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = []

# Endpoints JWT
urlpatterns += [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Preguntas de API REST
urlpatterns += [
    path('preg6/<int:pk>/',views.RenovacionFechaPenalizacionAPIView.as_view()),
    path('preg7/',views.PerfilAPIView.as_view()),
    path('preg8/<uuid:uuidpk>/user/<int:pk>/',views.PrestarLibroAPIView.as_view()),
]
