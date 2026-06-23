# Register your models here.
from django.contrib import admin
from django.contrib.auth.models import Permission
from .models import Author,Genre,Book,BookInstance,Language
from .models import Perfil,PermisoE
admin.site.register(Permission)
admin.site.register(Perfil)
admin.site.register(PermisoE)
admin.site.register(Genre)
admin.site.register(Language)

class BooksInstanceInline(admin.TabularInline):
    model = BookInstance

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name','birth_date','death_date')

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    # En el display_genre lo que me va a mostrar es el SHORT_DESCRIPTION
    # eso lo hace en todos los campos el admin
    list_display = ('title','author','display_genre')

    # Me conviene ver las instancias de un libro, pero de ese libro en concreto
    inlines = [BooksInstanceInline]

@admin.register(BookInstance)
class BookInstanceAdmin(admin.ModelAdmin):
    list_display = ('book', 'status', 'borrower', 'due_back', 'id')
    list_filter = ('status', 'due_back')

    fieldsets = (
        (None, {
            'fields': ('book','imprint', 'id')
        }),
        ('Availability', {
            'fields': ('status', 'due_back','borrower')
        }),
    )
