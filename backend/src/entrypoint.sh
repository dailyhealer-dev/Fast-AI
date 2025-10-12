#!/bin/sh

# ---- Echo a message 
echo "Running migrations..."
# ---- Creating migration file and create a database model
python3 manage.py makemigrations
# ---- Running migrate and migrate the created database model to the postgres database
python3 manage.py migrate

# ---- Echo message
echo "Starting server..."
# running the Django server
python3 manage.py runserver 0.0.0.0:8000