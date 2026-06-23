from rest_framework import serializers

from catalog.models import *


class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = '__all__'

class PermisoESerializer(serializers.ModelSerializer):
    class Meta:
        model = PermisoE
        fields = '__all__'

class BookInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookInstance
        fields = '__all__'