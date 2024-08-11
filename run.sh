#!/bin/bash
cd "$(dirname "$0")"

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

# Start huey
cd ../backend-budget-manager
python manage.py run_huey &
huey_pid=$!

cleanup() {
    echo "Cleaning up and stopping processes..."
    kill $backend_pid $frontend_pid $huey_pid
    wait $backend_pid $frontend_pid $huey_pid
    echo "Processes terminated."
}

trap "cleanup" EXIT

# Keep the script running
echo "Press Ctrl+C to terminate."
wait
