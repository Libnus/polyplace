import os
import json

from celery import shared_task
from datetime import datetime
from .utils import stringify

# task that takes in an instance and moves it to history after it has expired
@shared_task()
def expired(pk):
    from reservations.models import Reservation

    instance = Reservation.objects.get(pk=pk)

    print("Moving reservation <" + str(instance.id) + "> to history")

    current_date = datetime.today()

    path = '../history/' + current_date.strftime('%Y/%m')

    if not os.path.exists(path):
        os.makedirs(path)

    path += current_date.strftime("/%d") + ".json"
    f = open(path)

    # load the json
    history_json = {}
    try:
        history_json = json.load(f)
    except json.JSONDecodeError: pass

    # add reservation to dict
    history_json[instance.id] = stringify(instance)

    with open(path, 'w') as out:
        json.dump(history_json, out, indent=3)
