from .views import BuildingViewSet, FloorViewSet, RoomViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'floors',FloorViewSet,basename='floors')
router.register(r'rooms',RoomViewSet,basename='rooms')
router.register(r'buildings',BuildingViewSet,basename='building')
urlpatterns = router.urls
