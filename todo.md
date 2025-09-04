# Backend Plan

## Overview
The backend powers the codeiiest website with secure lightweight design, validation-first approach.  
It manages **users, events, and projects**, while ensuring authenticity through validators.

## Models
- **User Model** – Stores basic user info (validated via email & Codeforces ID).  
- **Core team Model** - Stores basic info about core members.
- **Events Model** – Manages event details (title, description, coordinators, schedule).  
- **Projects Model** – Stores and manages project details for display.  

## Authentication & Authorization
- No traditional login system.  
- Users validated using:
  - **Email Validator** – Confirms identity via OTP.  
  - **Codeforces Validator** – Verifies Codeforces handle via cf auth.  
- **Admin Panel** – Provides protected routes and CRUD operations for events & projects. Need a passkey to enter and submit changes. (Possibility of considering proper google login with roles too for a stricter, safer service) 

## other important Features
- Secure admin-only routes.  
- Appropriate error handling