# 🗺️ Co-Op Tracker Development Roadmap

## **Phase 1: SQLite Setup (Days 1-2)**

### ✅ **Step 1: Initialize Database**
```bash
cd backend
python init_database.py
```
This creates:
- `coop_tracker.db` SQLite database
- Tables: `users`, `applications`, `achievements`
- Mock user: Harrison (ID: 1)

### 🔄 **Step 2: Update Routes for Database**
**File to modify:** `backend/routes.py`

**Current state:** Uses in-memory `current_user`
**Goal:** Load user from database

**Key changes needed:**
1. Import database functions:
   ```python
   from database import SessionLocal, UserDB, ApplicationDB, AchievementDB
   ```

2. Replace `current_user` with database query:
   ```python
   def get_current_user():
       db = SessionLocal()
       return db.query(UserDB).filter(UserDB.email == "harrison@example.com").first()
   ```

3. Update all routes to use database instead of in-memory objects

### 🧪 **Step 3: Test Database Integration**
```bash
cd backend
python -m pytest test_routes.py
```

---

## **Phase 2: React Frontend (Days 3-5)**

### ✅ **Step 1: Setup React Project**
```bash
cd frontend
npm install
npm start
```

### 🎯 **Step 2: Create Core Components**

#### **2.1 XP Bar Component**
**File:** `frontend/src/components/XPBar.js`
**Features:**
- Progress bar showing XP to next level
- Current level display
- XP earned animation

**Props:**
```javascript
{
  currentXP: 150,
  level: 2,
  xpToNextLevel: 50
}
```

#### **2.2 Application Form**
**File:** `frontend/src/components/ApplicationForm.js`
**Fields:**
- Company, Role, Status
- Date Applied, Location
- Salary, Notes
- Submit button

#### **2.3 Application Table**
**File:** `frontend/src/components/ApplicationTable.js`
**Features:**
- Display all applications
- Status badges (Applied, Interviewing, Offer)
- Edit/Update functionality

#### **2.4 Achievement Cards**
**File:** `frontend/src/components/AchievementCard.js`
**Features:**
- Achievement icon and name
- Earned/unearned states
- Progress indicators

### 📱 **Step 3: Create Pages**

#### **3.1 Dashboard Page**
**File:** `frontend/src/pages/Dashboard.js`
**Layout:**
```
┌─────────────────────────────────┐
│ XP Bar (Level 2 - 150/200 XP)   │
├─────────────────────────────────┤
│ Stats Cards                     │
│ [Applications] [Interviews]     │
│ [Offers] [Success Rate]         │
├─────────────────────────────────┤
│ Recent Applications             │
│ [Table with last 5 apps]        │
└─────────────────────────────────┘
```

#### **3.2 Applications Page**
**File:** `frontend/src/pages/Applications.js`
**Layout:**
```
┌─────────────────────────────────┐
│ Add New Application             │
│ [Form]                          │
├─────────────────────────────────┤
│ All Applications                │
│ [Table with all apps]           │
└─────────────────────────────────┘
```

### 🔌 **Step 4: API Integration**

#### **4.1 API Service**
**File:** `frontend/src/services/api.js`
```javascript
const API_BASE = 'http://localhost:5000';

export const api = {
  getApplications: () => fetch(`${API_BASE}/applications`),
  addApplication: (data) => fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  getUserProfile: () => fetch(`${API_BASE}/user/profile`),
  getAchievements: () => fetch(`${API_BASE}/achievements`)
};
```

#### **4.2 State Management**
**File:** `frontend/src/context/AppContext.js`
- User data (XP, level, achievements)
- Applications list
- Loading states

---

## **🎯 Offline Development Checklist**

### **Backend Tasks:**
- [ ] Run `python init_database.py`
- [ ] Update `routes.py` to use database
- [ ] Test with `pytest`
- [ ] Verify API endpoints work

### **Frontend Tasks:**
- [ ] Run `npm install` and `npm start`
- [ ] Create XP Bar component
- [ ] Build Application Form
- [ ] Create Application Table
- [ ] Add Achievement Cards
- [ ] Create Dashboard page
- [ ] Create Applications page
- [ ] Integrate with Flask API

### **Integration Tasks:**
- [ ] Test full flow: Add app → See XP increase → Check achievements
- [ ] Verify data persistence across app restarts
- [ ] Test error handling

---

## **🚀 Success Criteria**

**Phase 1 Complete When:**
- Database stores user data persistently
- All API endpoints work with database
- Tests pass

**Phase 2 Complete When:**
- XP bar shows current progress
- Can add applications via form
- Can view applications in table
- Achievements display correctly
- Dashboard shows user stats

---

## **💡 Pro Tips for Offline Development**

1. **Start Simple:** Build components without API first, then integrate
2. **Use Browser DevTools:** Check network tab for API calls
3. **Test Incrementally:** Each component should work independently
4. **Keep Database File:** `coop_tracker.db` contains your data
5. **Use Console Logs:** Debug React state and API responses

---

## **🔧 Troubleshooting**

**Database Issues:**
- Delete `coop_tracker.db` and run `init_database.py` again
- Check SQLAlchemy logs in terminal

**React Issues:**
- Clear `node_modules` and run `npm install` again
- Check browser console for errors

**API Issues:**
- Ensure Flask backend is running on port 5000
- Check CORS settings in `app.py`

---

**Ready to start? Begin with Phase 1, Step 1! 🚀** 