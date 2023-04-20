from reservations.models import Reservation
from datetime import datetime
import time

'''
	input: a list of reservations and a new_reservation_time (tuple where the first element is the start time and the second is the end) to check for time collisions
	output: returns true if new_reservation_time is during another reservation time and false otherwise
'''
def check_reservation_time(reservations, new_reservation_time):

	print(new_reservation_time)

	new_reservation_time_start = datetime.strptime(new_reservation_time[0][0:16], '%Y-%m-%dT%H:%M').timetuple()
	new_reservation_time_end = datetime.strptime(new_reservation_time[1][0:16], '%Y-%m-%dT%H:%M').timetuple()

	print(new_reservation_time_start, new_reservation_time_end)


	for reservation in reservations.all():
		reservation_object = Reservation.objects.get(id=reservation.id)

		#reservation_start = datetime.strptime(reservation_object.start_time[0:16],'%Y-%m-%dT%H:%M').timetuple()
		reservation_start = reservation_object.start_time.timetuple()

		#reservation_end = datetime.strptime(reservation_object.end_time[0:16],'%Y-%m-%dT%H:%M').timetuple()
		reservation_end = reservation_object.end_time.timetuple()

		## check that reservation times don't overlap ##
		if (new_reservation_time_start >= reservation_start and new_reservation_time_start <= reservation_end) \
			or (new_reservation_time_end >= reservation_start and new_reservation_time_end <= reservation_end):
			return True

	return False