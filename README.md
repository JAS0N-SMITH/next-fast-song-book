# Songwriter App

A modern web application for creating and managing songs, featuring music composition tools, lyrics management, and collaborative features.

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS + Headless UI
- **State Management**: Redux Toolkit
- **Backend**: Python with FastAPI
- **Database**: PostgreSQL
- **Authentication**: Auth0
- **Music Processing**: Tone.js
- **Drag-and-Drop**: dnd-kit
- **File Storage**: Firebase

# Initial Project Scaffolding

This PR sets up the basic project structure for the Songwriter application, including both frontend and backend components.

## Frontend (Next.js)

### Core Setup
- Next.js 15.2.4 with TypeScript and Tailwind CSS
- App Router architecture
- Basic project structure with organized directories
- Environment configuration

### Features
- Responsive layout with sidebar navigation
- Redux store setup with song slice
- Basic routing structure
- API integration setup with axios
- Type definitions for song data

### Components
- Layout component with responsive sidebar
- Basic home page with call-to-action
- Songs list page with table view
- Redux provider setup

## Backend (FastAPI)

### Core Setup
- FastAPI with Python 3.9+
- PostgreSQL database integration
- SQLAlchemy ORM setup
- Environment configuration

### Features
- Basic API structure with versioning
- Database models for Songs and Users
- Pydantic schemas for data validation
- Basic CRUD endpoints for songs
- CORS middleware configuration

### Models
- Base model with common fields
- Song model with music-specific fields
- User model for future authentication

## Project Structure

```
songwriter-app/
├── frontend/ # Next.js application
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── features/ # Feature-specific components
│ │ ├── hooks/ # Custom React hooks
│ │ ├── store/ # Redux store
│ │ ├── types/ # TypeScript types
│ │ └── utils/ # Utility functions
│ └── public/ # Static assets
├── backend/ # FastAPI application
│ ├── app/
│ │ ├── api/ # API routes
│ │ ├── core/ # Core functionality
│ │ ├── models/ # Database models
│ │ ├── schemas/ # Pydantic schemas
│ │ └── services/ # Business logic
│ └── tests/ # Backend tests
└── shared/ # Shared types and utilities
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- PostgreSQL
- Git

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd songwriter-app
```

2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

3. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Development

- Frontend runs on: http://localhost:3000
- Backend runs on: http://localhost:8000
- API documentation available at: http://localhost:8000/docs

## Development Setup

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Next Steps
1. Implement song editor with music composition tools
2. Add drag-and-drop functionality for song structure
3. Implement user authentication
4. Add music playback features
5. Set up testing infrastructure

## Notes
- Authentication is temporarily disabled to focus on core features
- Basic UI components are in place but need styling refinement
- Database migrations will be added in the next PR

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 