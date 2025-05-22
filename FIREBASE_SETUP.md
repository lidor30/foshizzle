# Firebase Setup for TTS Caching

This project uses Firebase Storage to cache Text-to-Speech (TTS) audio files. Follow these steps to set up your Firebase environment.

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the prompts to create a new project
4. Enable Firebase Storage in your project

## 2. Configure Environment Variables

Add the following variables to your `.env` file:

```
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

You can find these values in your Firebase project settings:

1. In the Firebase Console, click on the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. If you don't have a web app yet, click the web icon "</>" to create one
5. Copy the configuration values

## 3. Firebase Storage Rules

Make sure to set appropriate security rules for your Firebase Storage. The minimum required rules to allow public access to TTS files:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /tts/{fileName} {
      allow read: if true; // Anyone can read TTS files
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

For development purposes, you might want to allow unauthenticated writes:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /tts/{fileName} {
      allow read, write: if true; // Anyone can read and write TTS files (DEVELOPMENT ONLY)
    }
  }
}
```

**Note:** For production, always implement proper authentication and security rules.
