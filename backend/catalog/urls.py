from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for API endpoints
router = DefaultRouter()
router.register(r'api/authors', views.AuthorViewSet)
router.register(r'api/books', views.BookViewSet)
router.register(r'api/genres', views.GenreViewSet)
router.register(r'api/languages', views.LanguageViewSet)
router.register(r'api/bookinstances', views.BookInstanceViewSet)
router.register(r'api/permisos', views.PermisoEViewSet)
router.register(r'api/perfiles', views.PerfilViewSet)
router.register(r'api/users', views.UserViewSet)

app_name = 'catalog'

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Legacy template-based views (kept for backward compatibility)
    path('', views.index, name='index'),

    path('books/', views.BookListView.as_view(), name='books'),
    path('authors/', views.AuthorListView.as_view(), name='authors'),
    path('book/<int:pk>/', views.BookDetailView.as_view(), name='book_detail'),
    path('author/<int:pk>/', views.AuthorDetailView.as_view(), name='author_detail'),
]

urlpatterns += [
    path('book/<uuid:pk>/renew/', views.renew_book_librarian, name='renew_book_librarian'),
]

urlpatterns += [
    path('author/create/', views.AuthorCreate.as_view(), name='author_create'),
    path('author/<int:pk>/update/', views.AuthorUpdate.as_view(), name='author_update'),
    path('author/<int:pk>/delete/', views.AuthorDelete.as_view(), name='author_delete'),
]

urlpatterns += [
    path('mybooks/', views.LoanedBooksByUserListView.as_view(), name='my_borrowed'),
    path('borrowed/', views.LoanedBooksAllListView.as_view(), name='all_borrowed'),
]

urlpatterns += [
    path('registro/', views.register, name='registro_usuarios'),
]

urlpatterns += [
    path('permisos/nuevo/', views.registro_permisos, name='registro_permisos'),
]

urlpatterns += [
    path('preg4/<int:pk>', views.asignar_permiso_usuario, name='asignacion_permisos_usuario'),
]

urlpatterns += [
    path('preg5/<int:pk>', views.PerfilDetailView.as_view(), name='perfil_detail'),
]

urlpatterns += [
    path('perfiles/', views.PerfilListView.as_view(), name='lista_perfiles'),
]
