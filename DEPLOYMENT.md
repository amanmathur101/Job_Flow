# Job Portal Deployment Guide

## Overview
This guide explains how to deploy the **Java Spring Boot Backend** to **Railway** and the **React Frontend** to **Vercel**.

---

## 1. Backend Deployment (Railway)

Railway is excellent for Spring Boot apps as it automatically detects the `pom.xml` and builds using Maven, similar to Heroku.

### Prerequisites
-   A GitHub repository with your project code.
-   A Railway account (login with GitHub).

### Steps
### Steps
1.  **Push to GitHub**: Ensure your latest code is on GitHub.
2.  **Create Project in Railway**:
    -   Click "New Project" -> "Deploy from GitHub repo".
    -   Select your repository (`Job_FLOW_PROJECT`).
3.  **Configure Service (The App)**:
    -   Click on the `Job_Flow` service card -> **Settings**.
    -   **Root Directory**: Set this to `/backend` (Crucial!).
    -   **Variables**: Add the following (See step 5 for values):
        -   `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
        -   `APP_JWT_SECRET`: (A long random string)
        -   `APP_CORS_ALLOWED_ORIGINS`: `https://your-frontend-url.vercel.app`
4.  **Add Database**:
    -   Project view -> "New" -> "Database" -> "PostgreSQL".
    -   Wait for it to initialize.
5.  **Connect App to Database**:
    -   Click **PostgreSQL** card -> **Variables**. Copy them.
    -   Click **Job_Flow** card -> **Variables**. Paste them as new variables.
    -   **Generate JWT Secret**: You can use any long random string.
6.  **Generate Domain**:
    -   **Job_Flow** card -> **Settings** -> **Networking** -> **Generate Domain**.
7.  **Build & Deploy**: It should deploy successfully now.

---

## 2. Frontend Deployment (Vercel)

Vercel is the best place to host React/Vite apps.

### Steps
1.  **Dashboard**: Go to Vercel Dashboard -> "Add New..." -> "Project".
2.  **Import Git Repository**: Select your repo.
3.  **Project Settings**:
    -   **Framework Preset**: Vite (should auto-detect).
    -   **Root Directory**: Click "Edit" and select `frontend`.
4.  **Environment Variables**:
    -   Nothing strict needed for build, but sometimes you might need `VITE_API_URL` if you configured your code to use it.
    -   *Important*: Update your `api.js` to point to the **Railway Backend URL** (e.g., `https://backend-production.up.railway.app/api`).
    -   Ideally, use `import.meta.env.VITE_API_URL` in your code so you can change it without changing code.
5.  **Deploy**: Click "Deploy".

---

## 3. Final Integration
1.  Copy the **Frontend Domain** (e.g., `https://job-portal.vercel.app`) from Vercel.
2.  Go to Railway -> Backend Service -> Variables.
3.  Update `APP_CORS_ALLOWED_ORIGINS` to `https://job-portal.vercel.app`.
4.  Redeploy Backend.

## Docker Note
Since we are using Railway's native Java builder, the `Dockerfile` in the backend folder is technically **optional** for Railway (which uses Nixpacks/Buildpacks), but useful if you want to deploy to a generic container host (like Render with Docker). You can keep it or delete it.
