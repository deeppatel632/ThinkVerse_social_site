# Thinkverse - Algorithm Visualization Platform

A full-stack web application for sharing and discussing algorithms, built with Django backend and React frontend.

## 🚀 Features

- **Blog Platform**: Share algorithm insights with markdown support
- **Threaded Comments**: Nested comment system for discussions
- **User Authentication**: Django session-based authentication
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first responsive layout
- **Real-time Features**: Like, bookmark, and share posts
- **Conference Ready**: Built-in conference call button for future WebRTC integration

## 🏗️ Architecture

### Backend (Django)
- **Framework**: Django 4.2.23
- **Database**: SQLite (development)
- **Authentication**: Session-based auth
- **API**: RESTful API with Django REST Framework
- **CORS**: Configured for frontend communication

### Frontend (React)
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios with CSRF support
- **Icons**: Lucide React
- **Markdown**: React Markdown

## 📁 Project Structure

```
SEM_4/
├── algovision-backend/          # Django backend
│   ├── config/                  # Django settings
│   ├── blogs/                   # Blog app
│   ├── comments/                # Comments app
│   ├── users/                   # Users app
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile              # Backend container
│   └── .dockerignore           # Docker ignore file
├── algovision-frontend/         # React frontend
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── api/                # API functions
│   │   └── ...
│   ├── package.json            # Node dependencies
│   ├── Dockerfile              # Frontend container
│   └── .dockerignore           # Docker ignore file
└── docker-compose.yml          # Multi-container setup
```

## 🛠️ Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SEM_4
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Local Development

#### Backend Setup
```bash
cd algovision-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### Frontend Setup
```bash
cd algovision-frontend
npm install
npm start
```

## 🐳 Docker Configuration

### Backend Dockerfile
- Base image: `python:3.9-slim`
- Installs system dependencies and Python packages
- Exposes port 8000
- Runs Django development server

### Frontend Dockerfile
- Base image: `node:18-alpine`
- Installs npm dependencies
- Exposes port 3000
- Runs React development server

### Docker Compose
- Orchestrates both services
- Sets up networking between containers
- Mounts volumes for development
- Configures environment variables

## 🔧 Environment Variables

### Backend (.env)
```env
DEBUG=1
SECRET_KEY=your-secret-key
DJANGO_SETTINGS_MODULE=config.settings
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
DATABASE_URL=sqlite:///db.sqlite3
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
CHOKIDAR_USEPOLLING=true
```

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Connect your repository
2. Set environment variables
3. Build command: `pip install -r requirements.txt`
4. Start command: `python manage.py runserver 0.0.0.0:$PORT`

### Frontend Deployment (Vercel/Netlify)
1. Connect your repository
2. Build command: `npm run build`
3. Output directory: `build`
4. Set environment variables

## 📱 Features in Detail

### Authentication
- Session-based authentication with Django
- CSRF protection
- Secure cookie handling
- Login/Register forms with validation

### Blog System
- Markdown support for rich content
- Tag system for categorization
- Like and bookmark functionality
- Image upload support (ready for implementation)

### Comments
- Threaded comment system
- Nested replies
- Like comments
- Real-time updates (ready for WebSocket integration)

### UI/UX
- Twitter/X-inspired design
- Dark/Light mode toggle
- Mobile responsive
- Smooth transitions and animations
- Accessible design patterns

## 🔮 Future Enhancements

### Planned Features
- [ ] WebRTC video conferencing
- [ ] Real-time notifications
- [ ] Advanced search and filtering
- [ ] User profiles with statistics
- [ ] Algorithm visualization tools
- [ ] Collaborative editing
- [ ] Export to PDF/Markdown

### Technical Improvements
- [ ] PostgreSQL for production
- [ ] Redis for caching
- [ ] Celery for background tasks
- [ ] WebSocket for real-time features
- [ ] CDN for static files
- [ ] CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Thinkverse** - Where algorithms meet community! 🚀 