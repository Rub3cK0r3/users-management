"""
URL configuration for locallibrary project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from . import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

# Logout seguro con POST y redirección a index de catalog
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('catalog/', include("catalog.urls")),
   
    # Logout seguro con POST y redirección a index de catalog
    path('accounts/logout/', LogoutView.as_view(next_page='/catalog/'), name='logout'),
    
] + static(settings.STATIC_URL, document_root=settings.STATIC_URL)

#Add Django site authentication urls (for login, logout, password management)
urlpatterns += [
    path('accounts/', include('django.contrib.auth.urls')),
]

urlpatterns += [
    path('',RedirectView.as_view(url="/catalog/",permanent=True)),
]

# Add url for API aplication..
urlpatterns += [
    path('biblioteca/',include('biblioteca.urls')),
]

# REMEMBER:
# Por si te dice que ese puerto (8000) esta en uso:
#  sudo lsof -i -P -n | grep LISTEN
