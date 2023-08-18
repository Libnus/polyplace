def stringify(reservation):
    time_format = "%m-%d-%Y @ %H:%M"
    dic = {
        "first_name": reservation.first_name,
        "last_name": reservation.last_name,
        "rin": reservation.rin,
        "email": reservation.email,
        "start_time": reservation.start_time.strftime(time_format),
        "end_time": reservation.end_time.strftime(time_format),
        "room": reservation.room.room_num,
        "building": reservation.room.floor.building.building_name
    }
    return dic
