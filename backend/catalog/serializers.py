from rest_framework import serializers
from .models import Author, Book, Genre, Language, BookInstance, PermisoE, Perfil
from django.contrib.auth.models import User

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'birth_date', 'death_date']

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name']

class BookSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    genre_names = serializers.SerializerMethodField()
    language_name = serializers.CharField(source='original_language.name', read_only=True)

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'author_name', 'isbn', 
            'genre', 'genre_names', 'summary', 'original_language',
            'language_name'
        ]

    def get_genre_names(self, obj):
        return [genre.name for genre in obj.genre.all()]

class BookInstanceSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    borrower_name = serializers.CharField(source='borrower.username', read_only=True)

    class Meta:
        model = BookInstance
        fields = [
            'id', 'book', 'book_title', 'borrower', 'borrower_name',
            'status', 'imprint', 'due_back', 'is_overdue'
        ]

class PermisoESerializer(serializers.ModelSerializer):
    class Meta:
        model = PermisoE
        fields = ['id', 'nombre', 'codename', 'permiso_django']

class PerfilSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario_django.username', read_only=True)
    permiso_details = PermisoESerializer(source='permisos', many=True, read_only=True)

    class Meta:
        model = Perfil
        fields = [
            'id', 'usuario_django', 'usuario_username', 'direccion',
            'localidad', 'provincia', 'foto', 'permisos', 'permiso_details',
            'fecha_penalizacion', 'is_valid'
        ]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
