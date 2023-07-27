import datetime

def get_iso_week(date):
    # get the week of date
    parsed_date = [int(x) for x in date.split('-')]

    date = datetime.date(parsed_date[2],parsed_date[0],parsed_date[1])
    iso_week = date.isocalendar()[1]
    if date.weekday() == 6: iso_week+=1

    return iso_week
