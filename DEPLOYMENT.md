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
1.  **Push to GitHub**: Ensure your latest code (including the `docker-compose.yml` if you want, but Railway provides a managed DB) is on GitHub.
2.  **Create Project in Railway**:
    -   Click "New Project" -> "Deploy from GitHub repo".
    -   Select your repository (`Job_FLOW_PROJECT`).
    -   Railway will scan the repo. Since it's a monorepo (frontend and backend in one repo), you need to configure the **Root Directory**.
3.  **Configure Service**:
    -   Go to "Settings" of the created service.
    -   **Root Directory**: Set this to `/backend`. This tells Railway to look for `pom.xml` inside the backend folder.
    -   **Variables**: Add the following Environment Variables (same as `application.properties` but for prod):
        -   `DB_HOST`: *{See Database Step below}*
        -   `DB_PORT`: `5432`
        -   `DB_NAME`: `railway` (or whatever the DB service provides)
        -   `DB_USER`: `postgres`
        -   `DB_PASSWORD`: *{See Database Step below}*
        -   `APP_JWT_SECRET`: *Generate a random long string*
        -   `APP_CORS_ALLOWED_ORIGINS`: `https://your-frontend-url.vercel.app` (You will update this after deploying frontend)
4.  **Add Database**:
    -   In the Railway Project view, click "New" -> "Database" -> "PostgreSQL".
    -   Once created, click on the Postgres card -> "Connect".
    -   Copy the variables (`PGHOST`, `PGUSER`, `PGPASSWORD`, etc.) to your Backend Service variables.
5.  **Build & Deploy**: Railway effectively runs `mvn clean package -DskipTests` and starts the jar.

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
