# 📁 Co-Op Tracker Project Structure

## 🎯 Essential Files (Always commit these)

### Backend Core
```
backend/
├── app.py              # Flask app entry point
├── routes.py           # API endpoints
├── models.py           # SQLAlchemy models
├── database.py         # Database configuration
├── init_database.py    # Database initialization
└── test_routes.py      # API tests
```

### Frontend Core
```
frontend/
├── package.json        # Dependencies
├── tailwind.config.js  # Tailwind configuration
├── postcss.config.js   # PostCSS configuration
├── public/             # Static assets
└── src/
    ├── index.js        # React entry point
    ├── index.css       # Global styles
    ├── App.js          # Main app component
    ├── components/     # Reusable UI components
    ├── pages/          # Page components
    └── services/       # API calls (future)
```

### Project Root
```
├── requirements.txt    # Python dependencies
├── .gitignore         # Git ignore rules
├── .cursorignore      # Cursor IDE ignore rules
├── .vscode/settings.json # VS Code/Cursor settings
├── README.md          # Project documentation
└── PROJECT_STRUCTURE.md # This file
```

## 🚫 Generated Files (Never commit these)

### Python Generated
- `__pycache__/` - Python bytecode cache
- `*.pyc` - Compiled Python files
- `instance/` - Flask instance folder
- `*.db` - Database files

### Node.js Generated
- `node_modules/` - NPM dependencies
- `package-lock.json` - Lock file (can be regenerated)
- `build/` - Production build
- `.env*` - Environment files

### IDE/OS Generated
- `.vscode/` (except settings.json) - VS Code settings
- `.idea/` - IntelliJ settings
- `.DS_Store` - macOS system files
- `*.log` - Log files

## 🔧 Development Workflow

1. **Start Backend**: `cd backend && python app.py`
2. **Start Frontend**: `cd frontend && npm start`
3. **Install Dependencies**: 
   - Backend: `pip install -r requirements.txt`
   - Frontend: `npm install`

## 📝 Commit Guidelines

### ✅ Good Commits
- Feature additions
- Bug fixes
- Documentation updates
- Configuration changes

### ❌ Bad Commits
- Generated files
- Cache files
- Database files
- Dependencies (unless version changes)

## 🎨 Architecture Benefits

**React + Flask** is perfect for this project because:
- React handles complex UI interactions (XP bars, achievements)
- Flask provides simple, fast API endpoints
- Easy to test and deploy separately
- Clear separation of concerns

## 🖥️ IDE Configuration

The project includes IDE-specific configuration files:
- **`.vscode/settings.json`** - Hides generated files in VS Code/Cursor
- **`.cursorignore`** - Tells Cursor IDE what to ignore
- **`.gitignore`** - Prevents committing generated files

This keeps your file explorer and source control clean! 🧹 