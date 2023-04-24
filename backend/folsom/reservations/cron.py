from django_cron import CronJobBase, Schedule
from reservations.models import Reservation
from floors.models import Building, Floor, Room

import os
import json
from datetime import datetime

class CleanWeekCron(CronJobBase):
    RUN_AT_TIMES = ['00:01'] # 1 minute after ReservationCron to make sure everything is saved

    schedule = Schedule(run_at_times=RUN_AT_TIMES)
    code = 'reservations.CLEAN_WEEK_CRON'

    def do(self):
        print("cleaning reservations using weekly cron")

        current_date = datetime.today()
        print(current_date.weekday())
        if(current_date.weekday()+1 == 7):
            print("It's Sunday! You know what that means:)")
            print("\nCleaning reservations...")

            # possible issue: reservations might not be added to history
            # if ReservationsCron hasn't been run
            # i.e. reservations running late at night could be thrown away!!
            reservations = Reservation.objects.all()

            for reservation in reservations:
                if reservation.end_time < current_date:
                    print("Reservation from " + reservation.first_name + " " + reservation.last_name + " removed from reservations.")
                    reservation.delete()
            print("\nreservations weekly clean complete!")
        else:
            print("Today isn't Sunday...CRON sad :(")

class ReservationsCron(CronJobBase):
    RUN_AT_TIMES = ['00:00']
    RUN_EVERY_MINS = 30

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS, run_at_times=RUN_AT_TIMES)
    code = 'reservations.RESERVATIONS_CRON'


    def do(self):

        print("running Reservations CRON")

        current_date = datetime.today()

        print("hey")
        path = '../history/' + current_date.strftime('%Y/%m')
        print(path)

        if not os.path.exists(path):
            os.makedirs(path)

        path += current_date.strftime("/%d") + ".json"
        f = open(path,"w+")

        history_json = {'reservations': []}
        try:
            history_json = json.load(f)
        except json.JSONDecodeError:
            pass

        reservations = Reservation.objects.all()

        for reservation in reservations:
            if reservation.end_time < current_date:
                room = reservation.room
                time_format = "%m-%d-%d @ %H:%M"

                new_entry = {
                    "id": reservation.id,
                    "first_name": reservation.first_name,
                    "last_name": reservation.last_name,
                    "rin": reservation.rin,
                    "email": reservation.email,
                    "start_time": reservation.start_time.strftime(time_format),
                    "end_time": reservation.end_time.strftime(time_format),
                    "room": room.room_num,
                    "building": room.floor.building.building_name
                }
                history_json['reservations'].append(new_entry)
                print(str(reservation) + " added to history.")

        with open(path,"w") as out:
            json.dump(history_json,out)
        print("Reservation CRON Done!")
