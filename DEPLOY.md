# Deploying Logic Looper

This guide explains how to deploy the **Logic Looper** application to Vercel.

## Prerequisites

1.  **GitHub Account**: The project should be pushed to a GitHub repository.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
3.  **Firebase Project**: You need your Firebase configuration keys.

## Deployment Steps

### 1. Push Code to GitHub
Ensure your latest code is committed and pushed to a GitHub repository.

### 2. Import Project in Vercel
1.  Go to your Vercel Dashboard.
2.  Click **"Add New..."** -> **"Project"**.
3.  Select your GitHub repository (`daily-puzzle-logic-game`).
4.  **Framework Preset**: Vercel should automatically detect **Vite**.

### 3. Configure Environment Variables
You MUST add your Firebase configuration to Vercel so the app can connect to your database.

1.  In the Vercel Project Settings, go to **Environment Variables**.
2.  Add the existing variables from your `.env` or `src/firebase.ts` file (if you moved them to `.env`).
    *   *Note: If your keys are currently hardcoded in `src/firebase.ts`, you can skip this step, but it is recommended to use environment variables for security.*

### 4. Deploy
1.  Click **Deploy**.
2.  Vercel will build your project using `npm run build`.
3.  Once finished, you will get a live URL (e.g., `https://logic-looper.vercel.app`).

## PWA Features (Mobile Install)
The app is configured as a PWA. To install it on your phone:
1.  Open the deployed URL in Chrome (Android) or Safari (iOS).
2.  **Android**: Tap "Add to Home Screen" in the menu.
3.  **iOS**: Tap the "Share" button -> "Add to Home Screen".
4.  The app will appear as a native app icon and launch in fullscreen mode.

## Troubleshooting
- **Build Fails?** Check the "Build Logs" in Vercel. Ensure `npm run build` works locally.
- **White Screen?** Check the browser console. It might be a missing Firebase key or an import error.
