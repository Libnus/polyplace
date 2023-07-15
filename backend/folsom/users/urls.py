from .views import PolyUserViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'',PolyUserViewSet,basename='user')
urlpatterns = router.urls
