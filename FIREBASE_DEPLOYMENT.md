# Firebase Deployment Setup

This project uses GitHub Actions to deploy to Firebase Hosting. Follow these steps to set up the deployment:

## 1. Prerequisites

- Firebase project created (see `FIREBASE_SETUP.md`)
- GitHub repository with your code

## 2. Generate Firebase Service Account Key

1. Go to your Firebase project console
2. Navigate to Project Settings > Service Accounts
3. Click "Generate new private key"
4. Save the JSON file securely

## 3. Set up GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets:

| Secret Name                    | Description                                                           |
| ------------------------------ | --------------------------------------------------------------------- |
| `FIREBASE_API_KEY`             | Your Firebase API key                                                 |
| `FIREBASE_AUTH_DOMAIN`         | Your Firebase Auth domain (usually `your-project-id.firebaseapp.com`) |
| `FIREBASE_PROJECT_ID`          | Your Firebase project ID                                              |
| `FIREBASE_STORAGE_BUCKET`      | Your Firebase storage bucket (usually `your-project-id.appspot.com`)  |
| `FIREBASE_MESSAGING_SENDER_ID` | Your Firebase messaging sender ID                                     |
| `FIREBASE_APP_ID`              | Your Firebase app ID                                                  |
| `FIREBASE_SERVICE_ACCOUNT`     | The entire content of the service account JSON file you downloaded    |

## 4. Deploy

The deployment will automatically run on push to the `main` branch, or you can manually trigger it from the Actions tab in your GitHub repository.

## Local Testing

To test the Firebase deployment locally:

1. Install Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Log in to Firebase:

```bash
firebase login
```

3. Initialize your project (if not already done):

```bash
firebase init
```

4. Build your project:

```bash
yarn build
```

5. Test locally:

```bash
firebase serve --only hosting
```

6. Deploy manually:

```bash
firebase deploy
```
