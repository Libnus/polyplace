#!/bin/bash

BASE_DIR="$( cd "$( dirname "$0" )" && pwd )"
cd $BASE_DIR

echo "starting server..."
echo
echo "WARNING :: this script will run killall node which will stop all node processes. Stop this script now if needed"

echo 
for i in {1..10}
do
	echo -n "$i..."
	#sleep 1
done

killall node

# start backend
cd backend/folsom
python3 manage.py runserver > ../../logs/backend.log &

# start frontend
cd ../frontend/
npm start > ../logs/frontend.log &

