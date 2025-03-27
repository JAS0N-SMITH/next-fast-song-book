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

## Project Structure

```
songwriter-app/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── features/        # Feature-specific components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # Redux store
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core functionality
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic
│   └── tests/              # Backend tests
└── shared/                 # Shared types and utilities
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

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 