echo "Welcome to PolyPlace!\n\n"
echo "starting the install..."

BASE_DIR=$(dirname $0)

# NPM =========================
cd ../frontend
npm install
cd ..

# DJANGO =======================
pip3 install Django

# rest framework
pip install djangorestframework
pip install markdown       # Markdown support for the browsable API.
pip install django-filter  # Filtering support

pip3 install django-cors-headers

# Django set up
python3 manage.py makemigrations floor
python3 manage.py makemigrations reservations
python3 manage.py migrate

# CREATE CRONS
crontab -l > poly_crons
echo "*/5 * * * * source python3 $BASE_DIR manage.py runcrons"
crontab poly_crons
rm poly_crons

# CREATE HISTORY
mkdir backend/history

# CREATE LOGS
# TODO : make logs in custom directory set by user
mkdir $BASE_DIR/logs
touch $BASE_DIR/logs/frontend.log
touch $BASE_DIR/logs/backend.log

# GENERATE SECRET KEY
echo "SECRET_KEY=" > backend/folsom/.env
python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())' >> backend/folsom/.env

echo "Install complete! Run run.sh to start server :)"
