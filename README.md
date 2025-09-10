# Notes App

A simple web-based notes application built with Django. This app allows users to sign up, log in, and manage their personal notes through a clean web interface.

## Features
- User authentication (sign up, log in, log out)
- Create, read, update, and delete notes
- Responsive UI with custom styles
- RESTful API endpoints for notes management

## Project Structure
```
notes_app/
├── db.sqlite3
├── manage.py
├── notes/
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   ├── views.py
│   ├── static/
│   │   ├── login.js
│   │   ├── notes.js
│   │   ├── signup.js
│   │   └── styles.css
│   └── templates/
│       └── notes/
│           ├── login.html
│           ├── notes.html
│           └── signup.html
├── notes_project/
│   ├── settings.py
│   ├── urls.py
│   └── ...
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notes_app
   ```

2. **Create a virtual environment and activate it**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # source venv/bin/activate  # On macOS/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install django djangorestframework
   ```

4. **Apply migrations**
   ```bash
   python manage.py migrate
   ```

5. **Run the development server**
   ```bash
   python manage.py runserver
   ```

6. **Access the app**
   Open your browser and go to `http://127.0.0.1:8000/`

## API Endpoints
- `/api/notes/` - List and create notes
- `/api/notes/<id>/` - Retrieve, update, or delete a note


