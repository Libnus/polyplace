from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError

from users.models import PolyUser
from users.models import Role

class UserCreationForm(forms.ModelForm):


    password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
    password2 = forms.CharField(label="Password confirmation", widget=forms.PasswordInput)

    class Meta:
        model = PolyUser
        fields = ["email", "rin", "rcs", "first_name", "last_name"]

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")

        if password1 and password2 and passowrd1 != password2:
                raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

class UserAdmin(BaseUserAdmin):
        add_form = UserCreationForm

        list_display = ["email", "rin", "rcs", "first_name", "last_name", "is_admin"]
        list_filter = ["is_admin"]
        fieldsets = [
                (None, {"fields": ["email", "password"]}),
        ]
        add_fieldsets = [
                (
                None,
                {
                        "classes": ["wide"],
                        "fields": ["email", "rcs", "password1", "password2"],
                },
                ),
        ]
        search_feilds = ["email"]
        ordering = ["email"]
        filter_horizontal = []

admin.site.register(Role)
admin.site.register(PolyUser, UserAdmin)
admin.site.unregister(Group)
