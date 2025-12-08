---
description: How to deploy the Phantomhive application to Firebase Hosting with CI/CD
---

# Deploy to Firebase Hosting

Follow these steps to set up Firebase Hosting and automated deployments via GitHub Actions.

## 1. Install Firebase CLI

If you haven't already, install the tools globally:

```bash
npm install -g firebase-tools
```

## 2. Login to Firebase

Authenticate with your Google account:

```bash
firebase login
```

## 3. Initialize Hosting & CI/CD

Run the initialization command:

```bash
firebase init hosting
```

**Select the following options when prompted:**

1.  **Project**: Use an existing project -> `fenrisulfr42` (Phantomhive).
2.  **Public directory**: Type `dist/phantomhive/browser` (Important! This must match our build output).
3.  **Configure as a single-page app (write all urls to /index.html)?**: `Yes`
4.  **Set up automatic builds and deploys with GitHub?**: `Yes`
    - It will ask you to log in to GitHub.
    - It will ask for your repo format (e.g., `victortan/phantomhive`).
5.  **File to overwrite**: If asked to overwrite `index.html`, say `No`. If asked to overwrite `firebase.json`, you can say `No` (since I already created it) or `Yes` (it will generate a similar one).

## 4. Manual Deploy (Optional)

To deploy immediately without waiting for a git push:

```bash
npm run build
firebase deploy
```

> [!TIP]
> Once step 3 is done, every time you push to your GitHub branch, it will automatically build and deploy your live site!
