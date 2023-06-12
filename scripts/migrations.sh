BASE_DIR="$( cd "$( dirname "$0" )" && pwd )"

cd $BASE_DIR

cd ../backend/folsom

python3 manage.py makemigrations floors
python3 manage.py makemigrations reservations

python3 manage.py migrate
