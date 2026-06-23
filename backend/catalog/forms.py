from django import forms
import datetime
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from .models import *
from django.contrib.auth.models import Permission

class FormularioAsignarPermiso(forms.Form):
    permiso = forms.ModelChoiceField(
        label="Selecciona un permiso para otorgar:",
        queryset=PermisoE.objects.all(),
        required=True
    )

# We take advantage for the base implementation
# that ModelForm uses in this case it is something
# not so precise..
class FormularioPermissions(forms.ModelForm):
    class Meta:
        model = Permission
        fields = ['name','codename']

class FormularioRegistroPerfil(forms.ModelForm):
    class Meta:
        model = Perfil
        fields = ['direccion','localidad','provincia','foto']

class FormularioRegistroUsuarioDjango(forms.ModelForm):
    class Meta:
        model = User
        fields = ['password','first_name','last_name','username','email']

# For Base implementation in this case
# we opted to forms.Form for more control
# over more plug-and-play form
class RenewBookForm(forms.Form):
    renewal_date = forms.DateField(help_text="Enter a date between now and 4 weeks (default 3).")
    def clean_renewal_date(self):
        data = self.cleaned_data['renewal_date']

        if data < datetime.date.today():
            raise ValidationError(_('Invalid date - renewal in past'))

        if data > datetime.date.today() + datetime.timedelta(weeks=4):
            raise ValidationError(_('Invalid date - renewal more than 4 weeks ahead'))

        return data
