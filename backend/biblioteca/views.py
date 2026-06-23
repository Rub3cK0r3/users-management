from django.shortcuts import render,get_object_or_404
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny


from catalog.models import *
from .permissions import *

# Create your views here.
class RenovacionFechaPenalizacionAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [PuedoEditarPenalizaciones]

    def patch(self, request, pk):
        perfil = get_object_or_404(Perfil, pk=pk)
        # lo actualizo con la que me meten por el body
        serializer = PerfilSerializer(perfil, data=request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# esta en principio es pública
class PerfilAPIView(APIView):
    queryset = Perfil.objects.all() # este parametro es obligatorio, es lo que se va a usar para listar los objetos, se puede personalizar con get_queryset() si quieres aplicar filtros dinámicos o algo así.
    serializer_class = PerfilSerializer
    permission_classes = [AllowAny]
    def get(self, request):
        perfiles = Perfil.objects.all()
        codename = request.query_params.get('codename', '').strip()

        if codename:
            perfiles = perfiles.filter(permisos__codename=codename)  # búsqueda parcial

        serializer = PerfilSerializer(perfiles, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PrestarLibroAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    queryset = BookInstance.objects.all()
    serializer_class = BookInstanceSerializer
    permission_classes = [PuedePrestarLibro]

    def patch(self, request, uuidpk, pk):
        bookinstance = get_object_or_404(BookInstance, id=uuidpk)
        user = get_object_or_404(User, pk = pk)
        bookinstance.borrower = user
        # print('obtengo el bookinstance',bookinstance)
        serializer = BookInstanceSerializer(bookinstance,data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
