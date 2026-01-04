# Job Portal Deployment Guide

This guide covers the steps to deploy the React Frontend to Vercel and the Spring Boot Backend to Render (or Railway).

## 1. Prerequisites
- **GitHub Account**: Push your code to a GitHub repository.
- **Vercel Account**: For frontend deployment.
- **Render Account**: For backend deployment.

## 2. Backend Deployment (Render)

Render is recommended for hosting Java Spring Boot applications and PostgreSQL databases.

### Step 2.1: Database Credentials (Already Created)
You have created the database `jobflow-db`. Here are the credentials you will need for the generic **Web Service** setup:

**Internal Connection Details (For Render Web Service):**
- **DB_HOST**: `dpg-d5d3r6chg0os73f1083g-a`
- **DB_PORT**: `5432`
- **DB_NAME**: `jobflow_db_s0jp`
- **DB_USER**: `jobflow_db_s0jp_user`
- **DB_PASSWORD**: `cCi9mWhRaW0aXtNsha6usVkL5Xi4ifcQ`

**External Connection Details (For Local Testing):**
- **Host**: `dpg-d5d3r6chg0os73f1083g-a.virginia-postgres.render.com`
- **Port**: `5432`
- **Database**: `jobflow_db_s0jp`
- **User**: `jobflow_db_s0jp_user`
- **Password**: `cCi9mWhRaW0aXtNsha6usVkL5Xi4ifcQ`

### Step 2.2: Dockerfile (Optional)
If valid `Dockerfile` exists in `backend/`, Render will use it. Otherwise, it uses Maven. 
(We are skipping explicit Dockerfile creation to rely on Render's native Java/Maven environment or existing configuration).

### Step 2.3: Render Web Service (The Spring Boot App)
1.  **Log in** to [Render Dashboard](https://dashboard.render.com/).
2.  Click **"New +"** -> **"Web Service"**.
3.  **Connect your GitHub repo**.
4.  **Configure Settings**:
    *   **Name**: `jobflow-backend`
    *   **Region**: `Virginia (US East)` (Matches your DB region).
    *   **Runtime**: **"Java"** (or Docker if you pushed a Dockerfile).
    *   **Build Command**: `mvn clean package -DskipTests`
    *   **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
5.  **Environment Variables**:
    Click **"Add Environment Variable"** for each of these:

    | Key | Value |
    | :--- | :--- |
    | `DB_HOST` | `dpg-d5d3r6chg0os73f1083g-a` |
    | `DB_PORT` | `5432` |
    | `DB_NAME` | `jobflow_db_s0jp` |
    | `DB_USER` | `jobflow_db_s0jp_user` |
    | `DB_PASSWORD` | `cCi9mWhRaW0aXtNsha6usVkL5Xi4ifcQ` |
    | `APP_JWTSECRET` | `MySuperSecretKeyForJobPortal2024!MakeSureThisIsLongEnough` |
    | `APP_CORS_ALLOWEDORIGINS` | `https://your-frontend-url.vercel.app` (Update this after deploying Frontend) |

    *Note: The `application.properties` file has been updated to use these exact variable names.*

### Step 2.4: Deploy
Click **"Create Web Service"**. Render will start building your application.

## 3. Frontend Deployment (Vercel)

### Step 3.1: Config
Ensure your `vite.config.js` is clean.

### Step 3.2: Deploy
1. Go to Vercel Dashboard -> **Add New Project**.
2. Import your GitHub repository.
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.

### Step 3.3: Environment Variables
1. **Vercel Settings -> Environment Variables**:
   - `VITE_API_URL`: `https://jobflow-backend.onrender.com/api` (Replace with your actual Render Backend URL).
2. **Re-deploy** the frontend.

## 4. Final Wiring
1. Copy your Vercel URL (e.g., `https://jobflow-frontend.vercel.app`).
2. Go back to **Render (Backend) -> Environment**.
3. Edit `APP_CORS_ALLOWEDORIGINS` and paste the Vercel URL.
4. **Save Changes** (This will trigger a restart).

## 5. Local Development (Optional)
To run the backend locally connecting to the remote Render DB:
1. Open `application.properties` or set Environment Variables in your IDE (IntelliJ/Eclipse).
2. Set `DB_HOST` to `dpg-d5d3r6chg0os73f1083g-a.virginia-postgres.render.com`.
3. Set other variables (`DB_USER`, `DB_PASSWORD`, etc.) as above.
