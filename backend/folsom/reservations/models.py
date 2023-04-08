from django.db import models
from datetime import datetime

class Reservation(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    start_time = models.DateTimeField(auto_now_add=True,blank=True)
    end_time = models.DateTimeField()

    def time_left(self):
        return self.end_time.time() - datetime.now().time()
