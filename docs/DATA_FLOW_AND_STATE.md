# Data Flow & State Management Architecture

This document details how data moves through the **Humanity First Learning Hub** stack, from MongoDB queries to React component state and UI rendering.

---

## Data Pipeline Flow Architecture

```
[ MongoDB Collections ] 
        │
        ▼ (Mongoose Schema Models: User, Course, Module, Quiz, Progress, ForumPost)
[ Express API Controllers ] 
        │
        ▼ (REST Endpoints & JWT Protection Middleware)
[ Express HTTP Router ] 
        │
        ▼ (JSON Payloads over HTTP / Axios Interceptor in api.js)
[ React Context / Custom Hooks ] (AuthContext, LanguageContext, BandwidthContext)
        │
        ▼ (Page Component useState & useEffect Hooks)
[ React UI Component Render ] (Overview, CourseCatalog, ModuleWorkspace, AdminDashboard, etc.)
```

---

## 1. Authentication Data Flow & State

- **Storage**: `localStorage.getItem('token')` and `localStorage.getItem('user')`.
- **React Context**: `AuthContext.jsx`
  - `user`: Object `{ _id, name, email, role, preferredLanguage }`
  - `token`: String (30-day JWT Bearer Token)
  - `login(email, password)`: POST `/api/auth/login` $\rightarrow$ saves token/user to `localStorage` and state.
  - `register(name, email, password, role)`: POST `/api/auth/register` $\rightarrow$ saves token/user to `localStorage` and state.
  - `logout()`: Clears `localStorage` and resets `user` & `token` state.

---

## 2. Page-Level Component States & Data Synchronization

### A. Overview Page (`Overview.jsx`)
- **API Calls**: `api.get('/courses')` and `api.get('/progress')`
- **State**:
  - `course`: Main course object populated with `modules` array.
  - `progressData`: Logged-in user's `Progress` document.
  - `loading`: Boolean loading spinner flag.
- **Computed Metrics**:
  - `completedModuleIds`: Array of String-normalized module IDs `[String(m._id || m)]`.
  - `completedCount`: `Math.min(completedModuleIds.length, totalModulesCount)`.
  - `progressPercent`: `Math.min(100, Math.round((completedCount / totalModulesCount) * 100))`.
  - `isCertificateUnlocked`: `progressData ? progressData.certificateIssued : false`.
  - `nextUncompletedModule`: `courseModules.find(m => !completedModuleIds.includes(String(m._id || m)))`.

### B. Course Catalog / My Learning (`CourseCatalog.jsx`)
- **API Calls**: `api.get('/courses')` and `api.get('/progress')`
- **State**:
  - `courses`: Array of published courses.
  - `userProgress`: User's progress document (`completedModules`, `quizAttempts`).
  - `isModalOpen`: Boolean toggle for Add/Edit Module modal.
  - `moduleToEdit`: Active module object selected for editing.
- **Completion Check**:
  - `isModuleCompleted(moduleId)`: Returns `true` if `userProgress.completedModules` contains `String(moduleId)`.

### C. Module Workspace (`ModuleWorkspace.jsx`)
- **API Calls**: `api.get('/courses/modules/:id')`, `api.get('/courses')`, `api.get('/progress')`
- **State**:
  - `module`: Selected module document (`fullContent`, `youtubeUrl`, `keyTakeaways`).
  - `course`: Parent course object.
  - `isCompleted`: Boolean flag whether user has passed quiz for this module.
  - `isQuizOpen`: Boolean toggle for `QuizModal`.
  - `isQuizEditorOpen`: Boolean toggle for `QuizEditorModal` (Trainer/Admin).

### D. Quiz Engine (`QuizModal.jsx`)
- **API Calls**: `api.get('/quizzes/module/:moduleId')`, `api.post('/quizzes/module/:moduleId/submit')`
- **State**:
  - `quiz`: Quiz document (`questions`, `passingScorePercent`).
  - `selectedAnswers`: Object map `{ [questionIndex]: optionIndex }`.
  - `result`: Submission result object `{ scorePercent, passed, completedModules, certificateIssued, certificateId }`.
- **Submission Pipeline**:
  - Sends `{ answers: [0, 1, 3, 2] }` payload.
  - Server evaluates correct options, appends attempt to `progress.quizAttempts`, adds module to `completedModules` if passed ($\ge 80\%$), checks total active modules for auto-issuing certificate, and returns updated progress.

### E. Admin Dashboard (`AdminDashboard.jsx`)
- **API Calls**: `api.get('/admin/stats')`, `api.get('/admin/users')`, `api.get('/courses')`, `api.get('/admin/export-csv')`
- **State**:
  - `stats`: Object `{ totalUsers, activeLearners, completedLearners, completionRate, averageScore, totalCertificates, moduleStats }`.
  - `users`: Array of user documents for User Directory table.
  - `course`: Main course object.
- **Authenticated CSV Export**:
  - Uses `api.get('/admin/export-csv', { responseType: 'blob' })` to send outbound HTTP request with Bearer Authorization token, converting binary blob into browser file download.

### F. Community Noticeboard (`CommunityNoticeboard.jsx`)
- **API Calls**: `api.get('/forum?category=...')`, `api.post('/forum')`, `api.post('/forum/:id/reply')`, `api.delete('/forum/:id')`
- **State**:
  - `posts`: Array of forum threads.
  - `activeCategory`: Selected category filter ('All Posts', 'Field Notes', 'Policy Questions', 'Announcements').
  - `selectedThread`: Active thread object for `ThreadDetailModal`.
