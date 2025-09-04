# Routes [tentative]

## User Routes [needs review]
- `POST /users/register` → Register user with email + Codeforces ID.  
- `POST /users/verify-email` → Submit OTP for email verification.  
- `GET /users/leaderboard` → Get list of validated users sorted by Codeforces stats.  

## Core Team Routes
- `GET /members` → Public list of core members.  
- `POST /members` → Add a core member (admin only).  
- `PUT /members/:id` → Update core member details (admin only).  
- `DELETE /members/:id` → Remove core member (admin only).  

## Event Routes
- `GET /events` → Public list of events.  
- `POST /events` → Create a new event (admin only).  
- `PUT /events/:id` → Update event details (admin only).  
- `DELETE /events/:id` → Delete event (admin only).  

## Project Routes
- `GET /projects` → Public list of projects.  
- `POST /projects` → Add a project (admin only).  
- `PUT /projects/:id` → Update project details (admin only).  
- `DELETE /projects/:id` → Delete project (admin only).  

## Admin Routes
- `POST /admin/login` → Authenticate admin (via passkey or Google login).  
- `GET /admin/health` → Check backend/admin status.  

## Validator Routes
- `POST /validate/email` → Send OTP to email.  
- `POST /validate/codeforces` → Verify Codeforces handle (via CF auth).  