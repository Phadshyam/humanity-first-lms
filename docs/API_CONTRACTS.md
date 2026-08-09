# Complete REST API Specifications & Contracts

Complete specifications for all RESTful API endpoints exposed by the **Humanity First Learning Hub** backend server (`http://localhost:5000/api`).

---

## 1. Health Endpoint

### `GET /api/health`
- **Access**: Public
- **Headers**: None
- **Response** (`200 OK`):
  ```json
  {
    "status": "OK",
    "message": "Humanity First LMS API Server is operational",
    "timestamp": "2026-08-08T23:45:00.000Z"
  }
  ```

---

## 2. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Jane Volunteer",
    "email": "jane@humanityfirst.org",
    "password": "password123",
    "role": "volunteer",
    "preferredLanguage": "EN"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "data": {
      "_id": "66b4e1a2f9a1b2c3d4e5f601",
      "name": "Jane Volunteer",
      "email": "jane@humanityfirst.org",
      "role": "volunteer",
      "preferredLanguage": "EN",
      "token": "eyJhbGciOiJIUzI1Ni..."
    }
  }
  ```

### `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "volunteer@humanityfirst.org",
    "password": "password123"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "_id": "66b4e1a2f9a1b2c3d4e5f603",
      "name": "Priya Sharma",
      "email": "volunteer@humanityfirst.org",
      "role": "volunteer",
      "preferredLanguage": "HI",
      "token": "eyJhbGciOiJIUzI1Ni..."
    }
  }
  ```

### `GET /api/auth/me`
- **Access**: Protected (`Bearer <token>`)
- **Headers**: `Authorization: Bearer <token>`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "_id": "66b4e1a2f9a1b2c3d4e5f603",
      "name": "Priya Sharma",
      "email": "volunteer@humanityfirst.org",
      "role": "volunteer",
      "preferredLanguage": "HI"
    }
  }
  ```

---

## 3. Course & Module Endpoints (`/api/courses`)

### `GET /api/courses`
- **Access**: Public
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "66b4e1a2f9a1b2c3d4e5f701",
        "title": "NGO Volunteer Orientation & Field Readiness Program",
        "description": "Comprehensive orientation program...",
        "category": "Orientation",
        "isPublished": true,
        "modules": [
          {
            "_id": "66b4e1a2f9a1b2c3d4e5f711",
            "number": "01",
            "type": "Orientation",
            "title": "Introduction to Non-Profit Work & Volunteer Ethics",
            "description": "Explore the foundational role...",
            "durationMinutes": 12,
            "youtubeUrl": "https://www.youtube.com/embed/YpSUp_4d_j4",
            "keyTakeaways": ["Understand boundaries"],
            "fullContent": "### SECTION 1..."
          }
        ]
      }
    ]
  }
  ```

### `GET /api/courses/modules/:id`
- **Access**: Public
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "_id": "66b4e1a2f9a1b2c3d4e5f711",
      "number": "01",
      "type": "Orientation",
      "title": "Introduction to Non-Profit Work & Volunteer Ethics",
      "description": "Explore the foundational role...",
      "durationMinutes": 12,
      "youtubeUrl": "https://www.youtube.com/embed/YpSUp_4d_j4",
      "keyTakeaways": ["Understand boundaries"],
      "fullContent": "### SECTION 1..."
    }
  }
  ```

### `POST /api/courses/:courseId/modules`
- **Access**: Protected (`trainer`, `admin`)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "number": "09",
    "type": "Advanced",
    "title": "Crisis Logistics Management",
    "description": "Managing inventory during disasters...",
    "durationMinutes": 20,
    "youtubeUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "keyTakeaways": ["Logistics tracking"],
    "fullContent": "### SECTION 1: LOGISTICS..."
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "data": {
      "_id": "66b4e1a2f9a1b2c3d4e5f719",
      "number": "09",
      "title": "Crisis Logistics Management"
    }
  }
  ```

### `DELETE /api/courses/modules/:id`
- **Access**: Protected (`trainer`, `admin`)
- **Headers**: `Authorization: Bearer <token>`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Module deleted and user progress records sanitized successfully"
  }
  ```

---

## 4. Quiz Engine Endpoints (`/api/quizzes`)

### `GET /api/quizzes/module/:moduleId`
- **Access**: Public
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "_id": "66b4e1a2f9a1b2c3d4e5f801",
      "moduleId": "66b4e1a2f9a1b2c3d4e5f711",
      "title": "Introduction to Non-Profit Work Knowledge Check",
      "passingScorePercent": 80,
      "questions": [
        {
          "questionText": "What is a core ethical boundary?",
          "options": ["Monetary tips", "Neutrality", "Sharing contact info"],
          "correctOptionIndex": 1,
          "explanation": "Neutrality preserves integrity."
        }
      ]
    }
  }
  ```

### `POST /api/quizzes/module/:moduleId/submit`
- **Access**: Protected (`Bearer <token>`)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "answers": [1, 1, 1, 1, 0]
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "scorePercent": 100,
      "passed": true,
      "passingScorePercent": 80,
      "completedModules": ["66b4e1a2f9a1b2c3d4e5f711"],
      "certificateIssued": false,
      "certificateId": null,
      "issuedAt": null
    }
  }
  ```

---

## 5. Progress Endpoints (`/api/progress`)

### `GET /api/progress`
- **Access**: Protected (`Bearer <token>`)
- **Headers**: `Authorization: Bearer <token>`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "66b4e1a2f9a1b2c3d4e5f901",
        "userId": "66b4e1a2f9a1b2c3d4e5f603",
        "completedModules": ["66b4e1a2f9a1b2c3d4e5f711"],
        "quizAttempts": [
          {
            "moduleId": "66b4e1a2f9a1b2c3d4e5f711",
            "scorePercent": 100,
            "passed": true,
            "attemptedAt": "2026-08-08T23:45:00.000Z"
          }
        ],
        "certificateIssued": false
      }
    ]
  }
  ```

### `POST /api/progress/reset`
- **Access**: Protected (`Bearer <token>`)
- **Headers**: `Authorization: Bearer <token>`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Progress reset to 0% baseline successfully",
    "data": {
      "completedModules": [],
      "quizAttempts": [],
      "certificateIssued": false
    }
  }
  ```

---

## 6. Admin Analytics & Reporting (`/api/admin`)

### `GET /api/admin/stats`
- **Access**: Protected (`trainer`, `admin`)
- **Headers**: `Authorization: Bearer <token>`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "totalUsers": 3,
      "activeLearners": 1,
      "completedLearners": 1,
      "completionRate": 100,
      "averageScore": 100,
      "totalCertificates": 1,
      "moduleStats": [
        {
          "moduleId": "66b4e1a2f9a1b2c3d4e5f711",
          "title": "Introduction to Non-Profit Work & Volunteer Ethics",
          "number": "01",
          "type": "Orientation",
          "attempts": 1,
          "averageScore": 100
        }
      ]
    }
  }
  ```

### `GET /api/admin/users`
- **Access**: Protected (`trainer`, `admin`)
- **Headers**: `Authorization: Bearer <token>`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "count": 3,
    "data": [
      {
        "_id": "66b4e1a2f9a1b2c3d4e5f602",
        "name": "Shyam Phad",
        "email": "shyamphad03@gmail.com",
        "role": "trainer",
        "preferredLanguage": "EN"
      }
    ]
  }
  ```

### `GET /api/admin/export-csv`
- **Access**: Protected (`trainer`, `admin`)
- **Headers**: `Authorization: Bearer <token>`
- **Response** (`200 OK` - `Content-Type: text/csv`):
  ```csv
  Name,Email,Role,Preferred Language,Completed Modules Count,Total Attempts,Avg Quiz Score %,Certificate Issued,Certificate ID,Joined Date
  "Shyam Phad","shyamphad03@gmail.com",trainer,EN,8,8,100%,Yes,CERT-HF-2026-SP01,2026-08-08
  ```

---

## 7. Community Forum Endpoints (`/api/forum`)

### `GET /api/forum`
- **Access**: Public
- **Query Params**: `category` (Optional)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "count": 4,
    "data": [
      {
        "_id": "66b4e1a2f9a1b2c3d4e5f951",
        "title": "Updated Child Safeguarding Protocols",
        "category": "Announcements",
        "body": "Please review the updated consent guidelines...",
        "author": { "_id": "66...", "name": "Humanity First Admin", "role": "admin" },
        "replies": []
      }
    ]
  }
  ```
