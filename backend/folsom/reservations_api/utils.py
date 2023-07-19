from reservations.models import Reservation
from datetime import datetime
from dateutil import parser
import time

'''
	input: a list of reservations and a new_reservation_time (tuple where the first element is the start time and the second is the end) to check for time collisions
	output: returns true if new_reservation_time is during another reservation time and false otherwise
'''
def check_reservation_time(reservations, new_reservation_time):
	# javascript datetime strings come in the form 2023-07-14T15:00:00.721Z...we simply do not care about the 00.721 so we just throw it away
	# this all feels extra cursed...why does javascript add a Z to the end instead of just using the UTC timezone "code"???
	parsed_start_string = new_reservation_time[0][0:16] + new_reservation_time[0][-1]
	parsed_end_string = new_reservation_time[1][0:16] + new_reservation_time[1][-1]


	new_reservation_time_start = parser.parse(parsed_start_string).timetuple()
	new_reservation_time_end = parser.parse(parsed_end_string).timetuple()

	for reservation in reservations.all():
		reservation_object = Reservation.objects.get(id=reservation.id)
		reservation_start = reservation_object.start_time.timetuple()
		reservation_end = reservation_object.end_time.timetuple()

		## check that reservation times don't overlap ##
		if(reservation_start > new_reservation_time_end and reservation_end < new_reservation_time_start):
			return True
	return False
