from rest_framework import permissions

class PuedoEditarPenalizaciones(permissions.BasePermission):
    def has_permission(self,request,view):
        return request.user.has_perm('catalog.penalizaciones')

class PuedePrestarLibro(permissions.BasePermission):
    def has_permission(self,request,view):
        return request.user.has_perm('catalog.prestalibro')

