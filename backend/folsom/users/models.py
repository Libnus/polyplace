from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class Role(models.Model):
    role = models.CharField(max_length = 10)

    def __str__(self):
        return self.role

def get_role_admin():
    return Role.objects.get_or_create(role="admin")[0]
    #return Role.objects.get(role="admin")

def get_role_user():
    return Role.objects.get_or_create(role="user")[0]
    #return Role.objects.get(role="user")

class PolyUserManager(BaseUserManager):
    def create_user(self, rcs, email, first_name, last_name, rin, password=None):
        user = self.model(
            email = self.normalize_email(email),
            first_name = first_name,
            last_name = last_name,
            rcs = rcs,
            rin=rin,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, rcs, email, first_name, last_name, rin, password):
        user = self.create_user(
            rcs,
            email,
            first_name,
            last_name,
            rin,
            password=password,
        )

        user.is_admin=True
        user.save(using=self._db)
        return user

class PolyUser(AbstractBaseUser):
    email = models.EmailField(
        verbose_name="email address",
        max_length=15,
    )
    rcs = models.CharField(max_length=10, unique=True)
    rin = models.CharField(max_length=9)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    is_admin = models.BooleanField(default=False)
    roles = models.ManyToManyField(Role)

    objects = PolyUserManager()

    USERNAME_FIELD = "rcs"
    REQUIRED_FIELDS = ["email", "rin", "first_name", "last_name"]

    def __str__(self):
        return self.rcs + "," + self.rin

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        return self.is_admin

    def save(self, *args, **kwargs):
        if(self.is_admin):
            self.roles.add(get_role_admin())
        super(PolyUser, self).save(*args, **kwargs)
        self.roles.add(Role.objects.get(role="admin"))
