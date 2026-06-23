from django.db import models
from django.urls import reverse
import uuid
from django.contrib.auth.models import User
from datetime import date

from django.contrib.auth.models import User,Permission

class PermisoE (models.Model):
    nombre = models.CharField(max_length=100)
    codename = models.CharField()
    # que en su momento tendré que definir tambien el contentype cuando lo de de alta
    permiso_django = models.ForeignKey(Permission,on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre

class Perfil (models.Model):
    direccion = models.CharField(max_length=120)
    localidad = models.CharField(max_length=120)
    provincia = models.CharField(max_length=100)
    foto = models.ImageField(
        upload_to='fotos/',
        null=True,
        blank=True
    )
    # tendé que darlo de alta primero en el formulario
    usuario_django = models.ForeignKey(User,on_delete=models.CASCADE)
    permisos = models.ManyToManyField(PermisoE)

    # Puede no tenerla aun asignada por el sistema, en ningun caso la va a poder ver
    fecha_penalizacion = models.DateField(blank=True,null=True)

    # los permisos ya los tengo en el usuario normal de django por el backend
    # permisos = models.ForeignKey(Permission,)

    @property
    def is_valid(self):
        if self.fecha_penalizacion != date.today():
            return True
        return False

    def get_absolute_url(self):
        return reverse("perfil_detail", args=[str(self.id)])
    
    # para poder verlo mejor desde el admin
    def __str__(self):
        return self.usuario_django.username



    class Meta:
        permissions = (
            ('permitir','A este usuario le permito'),
            ('penalizaciones','A este usuario se le permite modificar penalizaciones'),
        )

# ---

class Genre(models.Model):
    """Género literario"""
    name = models.CharField(
        max_length=200,
        help_text="Introduce el nombre del género",
        verbose_name="nombre"
    )

    def __str__(self):
        return self.name

class Language(models.Model):
    """Idioma de publicación"""
    name = models.CharField(max_length=200, help_text="Introduce el nombre del idioma")

    def __str__(self):
        return self.name

class Author(models.Model):
    """Autor de libros"""
    name = models.CharField(max_length=100, help_text="Introduce el nombre del autor")
    birth_date = models.DateField(
        blank=True, null=True,
        help_text="Introduce cuándo nació el autor si lo conoces"
    )
    death_date = models.DateField(
        blank=True, null=True,
        help_text="Introduce la fecha de fallecimiento si la conoces"
    )

    books = models.ManyToManyField('Book',related_name='books')

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('catalog:author_detail', args=[str(self.id)])

class Book(models.Model):
    """Libro (no un ejemplar específico)"""
    title = models.CharField(max_length=200, help_text="Introduce el título del libro")
    
    author = models.ForeignKey(
        'Author',
        on_delete=models.SET_NULL,
        help_text="Introduce el autor del libro",
        null=True, blank=True,
        related_name='librosaut'
    )
    
    isbn = models.CharField(max_length=13, help_text="Introduce el ISBN del libro")
    
    genre = models.ManyToManyField(
        Genre,
        help_text="Introduce el género del libro",
        related_name='librosgen'
    )
    
    summary = models.TextField(
        max_length=100,
        help_text="Introduce el resumen del libro",
        verbose_name="descripción"
    )
    
    original_language = models.ForeignKey(
        'Language',
        help_text="Introduce el idioma original del libro",
        on_delete=models.RESTRICT,
        related_name='librosidiom'
    )

    class Meta:
        ordering = ["author"]

    def __str__(self):
        return self.title

    def display_genre(self):
        """Muestra los primeros 3 géneros del libro"""
        return ', '.join([genre.name for genre in self.genre.all()[:3]])
    
    display_genre.short_description = 'Genre'

    def get_absolute_url(self):
        return reverse('catalog:book_detail', args=[str(self.id)])

class BookInstance(models.Model):
    """Ejemplar específico de un libro"""
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    
    book = models.ForeignKey(
        'Book',
        help_text="Introduce el libro al que pertenece el ejemplar",
        on_delete=models.RESTRICT,
    )

    borrower = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    LOAN_STATUS = (
        ('a', 'Available'),
        ('o', 'On loan'),
        ('r', 'Reserved'),
        ('m', 'Maintenance')
    )
    
    status = models.CharField(
        max_length=1,
        choices=LOAN_STATUS,
        default='m',
        help_text="Introduce el estado del ejemplar"
    )
    
    imprint = models.CharField(
        max_length=100,
        help_text="Introduce los detalles de esta edición"
    )
    
    due_back = models.DateField(
        null=True, blank=True,
        help_text="Introduce la fecha de devolución del préstamo"
    )

    class Meta:
        ordering = ["due_back"]
        # Un permiso es como un parásito, necesita estar asociado a una clase
        permissions = (('can_mark_returned',"Librarian can mark bookinstance as returned"),('prestalibro',"Puede prestar un libro"))

    @property
    def is_overdue(self):
        if self.due_back and date.today() > self.due_back:
            return True
        return False

    def __str__(self):
        return f"{self.book} {self.id}"

    def get_absolute_url(self):
        return reverse('catalog:bookinstance_detail', args=[str(self.id)])
