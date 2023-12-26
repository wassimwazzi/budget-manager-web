# Start backend Django server
cd backend-budget-manager
. venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver &
backend_pid=$!

# Start frontend React development server
cd ../frontend-budget-manager
npm install
npm start &
frontend_pid=$!

# Start Redis server
cd ../backend-manager
redis-server &
redis_pid=$!

# Start Celery worker
celery -A backend worker -l info &
celery_pid=$!

cleanup() {
    echo "Cleaning up and stopping processes..."
    kill $backend_pid $frontend_pid $redis_pid $celery_pid
    wait $backend_pid $frontend_pid $redis_pid $celery_pid
    echo "Processes terminated."
}

trap "cleanup" EXIT

# Keep the script running
echo "Press Ctrl+C to terminate."
wait
