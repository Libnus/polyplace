from .views import ReservationViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'',ReservationViewSet,basename="reservations")
urlpatterns = router.urls
