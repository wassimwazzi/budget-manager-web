cd backend; . venv/bin/activate; python manage.py runserver &
cd ../frontend; npm install; npm start &
cd ../backend;
redis-server &
celery -A backend worker -l info &
