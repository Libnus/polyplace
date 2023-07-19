from .views import ShibbolethAuthViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', ShibbolethAuthViewSet, basename="auth")
urlpatterns = router.urls
