from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse, reverse_lazy
from django.views import generic
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.db.models.functions import Lower
import datetime

from .models import Author, Book, Language, Genre, BookInstance
from .forms import RenewBookForm

from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.contrib.auth.mixins import PermissionRequiredMixin


from .models import PermisoE,Perfil
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission,User

# implementacion del examen de la segunda evaluacion

# Registro de usuarios y perfiles
from .forms import FormularioRegistroUsuarioDjango, FormularioRegistroPerfil
from .forms import FormularioPermissions
from .forms import FormularioAsignarPermiso


from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required, permission_required

@login_required
def register(request):

    perfil = Perfil.objects.get(usuario_django = request.user)
    if not perfil.is_valid:
        return render(request,'blocked.html',context={ 'perfil' : perfil})

    if request.method == 'POST':
        form_user = FormularioRegistroUsuarioDjango(request.POST)
        form_perfil = FormularioRegistroPerfil(request.POST)
        context = {
            'form_user': form_user,
            'form_perfil': form_perfil,
        }
        if form_user.is_valid() and form_perfil.is_valid():
            user = form_user.save()
            print(user)
            direccion_perfil = request.POST.get('direccion','').strip()
            localidad_perfil = request.POST.get('localidad','').strip()
            provincia_perfil = request.POST.get('provincia','').strip()

            perfil = Perfil.objects.create(
                usuario_django = user,
                direccion = direccion_perfil,
                localidad = localidad_perfil,
                provincia = provincia_perfil
            )
            print('perfil creado!',perfil)

            return redirect('catalog:index')
        return render(request, 'registro.html', context)
    else:
        # Mostrar formulario de registro
        form_user = FormularioRegistroUsuarioDjango()
        form_perfil = FormularioRegistroPerfil()
        context = {
            'form_user': form_user,
            'form_perfil': form_perfil,
        }
        return render(request, 'registro.html', context)

# Registro de permisos propios y de django con los contentypes
@permission_required('catalog.permitir')
def registro_permisos(request):

    # lo logico es que fuese en algo de nivel superior pero esta es la forma que hemos implementados
    perfil = Perfil.objects.get(usuario_django = request.user)
    if not perfil.is_valid:
        #print(perfil.fecha_penalizacion)
        return render(request,'blocked.html',context={ 'perfil' : perfil})

    form = FormularioPermissions(request.POST or None)
    contenttype = ContentType.objects.get(app_label='catalog',model='perfil').id
    if request.method == 'POST':
        if form.is_valid():
            nombre = request.POST.get('name','').strip()
            codename = request.POST.get('codename','').strip()
            permiso_django = Permission.objects.create(
                name = nombre,
                codename = codename,
                content_type_id = contenttype # necesario para que django sepa de que aplicacion cuelga
            )

            print('permiso de django creado!',permiso_django)

            permisoE = PermisoE.objects.create(
                nombre = nombre,
                codename = codename,
                permiso_django = permiso_django
            )
            print('permiso propio creado!',permisoE)
            return redirect('catalog:index')
    return render(request,'formulario_permisos.html',{'form':form})

# una vista de lista de perfiles
class PerfilListView(PermissionRequiredMixin,generic.ListView):
    permission_required = 'catalog.permitir'
    model = Perfil
    def get_queryset(self):
        return Perfil.objects.all()
    template_name = 'catalog/perfil_list.html'
    context_object_name = 'perfiles'

@permission_required('catalog.permitir')
def asignar_permiso_usuario(request,pk):

    perfil = Perfil.objects.get(usuario_django = request.user)
    if not perfil.is_valid:
        #print(perfil.fecha_penalizacion)
        return render(request,'blocked.html',context={ 'perfil' : perfil})

    perfil = get_object_or_404(Perfil, pk = pk)
    form = FormularioAsignarPermiso(request.POST or None)
    if form.is_valid():
        # primero sacamos el permiso nuestro que coincida con la busqueda
        pk_permiso = request.POST.get('permiso','').strip()

        permisoE = PermisoE.objects.get(pk = pk_permiso)

        # se lo añadimos a nuestro perfil
        perfil.permisos.add(permisoE) # lo sobreescribe si es que ya lo tiene

        # PERO OJO!! eso tiene que quedar reflejado en la implementacion de django

        # luego sacamos el permiso de django que coincida con la FK del PermisoE
        permiso_django = permisoE.permiso_django
        usuario_django = perfil.usuario_django

        print('permiso django',permiso_django)
        print('usuario django',usuario_django)

        # se lo asignamos al user de django usando el `user_permissions` siendo este un campo m2m
        usuario_django.user_permissions.add(permiso_django)

        print(usuario_django.get_all_permissions())

        usuario_django.save()

        return redirect('catalog:lista_perfiles')
    return render(request,'asginacion_permiso_usuario.html',{ 'form' : form , 'perfil':perfil } )

class PerfilDetailView(PermissionRequiredMixin,generic.DetailView):
    permission_required = 'catalog.permitir'
    model = Perfil
    template_name = 'catalog/perfil_detail.html'
    context_object_name = 'perfil'

def index(request):
    """
    Vista de la página de inicio del sitio.
    Muestra contadores de objetos principales.
    """
    num_books = Book.objects.all().count()
    num_instances = BookInstance.objects.all().count()
    
    num_instances_available = BookInstance.objects.filter(
        status__exact='a'  # __exact es lo mismo que '='
    ).count()
    
    num_authors = Author.objects.count()  # El 'all()' está implícito
    num_visits = request.session.get('num_visits', 0)
    num_visits += 1
    request.session['num_visits'] = num_visits

    return render(
        request,
        'index.html',
        context={
            'num_books': num_books,
            'num_instances': num_instances,
            'num_instances_available': num_instances_available,
            'num_authors': num_authors,
            'num_visits':num_visits,
        },
    )

# BOOK
# 
def book_detail_view(request, pk):
    book = Book.objects.get(pk=pk)
    return render(
        request,
        'catalog/book_detail.html',
        context={'book': book}
    )
class BookListView(generic.ListView):
    model = Book
    context_object_name = 'book_list'  # 'object_list' es el nombre genérico
    queryset = Book.objects.all()
    template_name = 'catalog/book_list.html'
class BookDetailView(generic.DetailView):
    model = Book

# AUTHOR
# 
class AuthorListView(generic.ListView):
    model = Author
    queryset = Author.objects.all()
    template_name = 'author_list.html'
    context_object_name = 'author_list'
class AuthorDetailView(generic.DetailView):
    model = Author
    context_object_name = 'author'

@permission_required('catalog.can_mark_returned', raise_exception=True)
def renew_book_librarian(request, pk):
    book_inst = get_object_or_404(BookInstance, pk=pk)

    if request.method == 'POST':
        form = RenewBookForm(request.POST)

        if form.is_valid():
            book_inst.due_back = form.cleaned_data['renewal_date']
            book_inst.save()
            return redirect('catalog:all_borrowed')

    else:
        proposed_renewal_date = datetime.date.today() + datetime.timedelta(weeks=3)
        form = RenewBookForm(initial={'renewal_date': proposed_renewal_date})

    return render(
        request,
        'catalog/book_renew_librarian.html',
        {
            'form': form, 
            'bookinst': book_inst
        }
    )
class LoanedBooksByUserListView(LoginRequiredMixin,generic.ListView):
    """
    Vista genérica basada en clases que enumera los libros prestados al usuario actual.
    """
    model = BookInstance
    template_name ='catalog/bookinstance_list_borrowed_user.html'
    paginate_by = 10

    def get_queryset(self):
        return BookInstance.objects.filter(borrower=self.request.user).filter(status__exact='o').order_by('due_back')
class LoanedBooksAllListView(PermissionRequiredMixin, generic.ListView):
    """Generic class-based view listing all books on loan. Only visible to users with can_mark_returned permission."""
    model = BookInstance
    permission_required = 'catalog.can_mark_returned'
    template_name = 'catalog/bookinstance_list_borrowed_all.html'
    paginate_by = 10
    def get_queryset(self):
        return BookInstance.objects.filter(status__exact='o').order_by('due_back')

# CRUD OPERATIONS FOR AUTHOR
# 
class AuthorCreate(PermissionRequiredMixin,CreateView):
    model = Author
    fields = '__all__'
    initial = {'death_date': '05/01/2018'}
    permission_required = 'catalog.add_author'
class AuthorUpdate(PermissionRequiredMixin,UpdateView):
    model = Author
    fields = ['name', 'birth_date', 'death_date']
    permission_required = (
        'catalog.change_author',
        'catalog.view_author',
    )
class AuthorDelete(PermissionRequiredMixin,DeleteView):
    model = Author
    success_url = reverse_lazy('catalog:authors')
    permission_required = 'catalog.delete_author'

# REST API ENDPOINTS USING DJANGO REST FRAMEWORK
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import (
    AuthorSerializer, BookSerializer, GenreSerializer, 
    LanguageSerializer, BookInstanceSerializer, PermisoESerializer, 
    PerfilSerializer, UserSerializer
)

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [AllowAny]

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]

class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [AllowAny]

class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [AllowAny]

class BookInstanceViewSet(viewsets.ModelViewSet):
    queryset = BookInstance.objects.all()
    serializer_class = BookInstanceSerializer
    permission_classes = [AllowAny]

class PermisoEViewSet(viewsets.ModelViewSet):
    queryset = PermisoE.objects.all()
    serializer_class = PermisoESerializer
    permission_classes = [AllowAny]

class PerfilViewSet(viewsets.ModelViewSet):
    queryset = Perfil.objects.all()
    serializer_class = PerfilSerializer
    permission_classes = [AllowAny]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
