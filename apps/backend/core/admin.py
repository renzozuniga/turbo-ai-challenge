from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import Category, Note, User


class UserAdmin(DjangoUserAdmin):
    model = User
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "password1", "password2")}),
    )
    list_display = ("email", "is_staff", "is_active")
    ordering = ("email",)
    search_fields = ("email",)


admin.site.register(User, UserAdmin)
admin.site.register(Category)
admin.site.register(Note)
