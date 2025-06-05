# Firebase Authentication Setup for Admin Panel

This guide covers setting up Firebase Authentication for securing the admin panel with email/password authentication.

## 1. Enable Firebase Authentication

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`foshizzle-proj`)
3. Navigate to **Authentication** → **Get Started**
4. Go to the **Sign-in method** tab
5. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle "Enable" to on
   - Click "Save"

## 2. Create Admin Users

Since we're securing admin pages, you'll need to manually create admin users:

### Option A: Firebase Console (Recommended)

1. Go to **Authentication** → **Users** tab
2. Click **Add user**
3. Enter email and password for your admin user
4. Click **Add user**

### Option B: Code-based creation (for initial setup)

You can temporarily use the signup functionality to create admin accounts, then disable public registration.

## 3. Security Recommendations

### Disable Public Registration (After creating admin users)

- Remove signup forms from public access
- Only allow admin user creation through Firebase Console
- Consider implementing invite-only registration

### Email Verification (Optional but Recommended)

```javascript
import { sendEmailVerification } from 'firebase/auth'

// After login, check if email is verified
if (user && !user.emailVerified) {
  await sendEmailVerification(user)
  // Show message to verify email
}
```

### Password Policy

Consider enabling password complexity requirements:

1. Go to **Authentication** → **Settings** → **Password policy**
2. Configure minimum requirements:
   - Minimum length (recommend 8+ characters)
   - Require uppercase/lowercase letters
   - Require numbers
   - Require special characters

## 4. Environment Variables

The following environment variables are already configured in your project:

```bash
# These are exposed to client-side via next.config.mjs
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 5. Current Implementation

The admin panel now includes:

- **Authentication Context** (`/src/context/AuthContext.tsx`)
- **Auth Guard** (`/src/components/AuthGuard.tsx`) - Protects admin routes
- **Login Component** (`/src/components/AdminLogin.tsx`) - Email/password login form
- **Admin Layout** - Includes user info and logout functionality

## 6. Usage

### Accessing Admin Panel

1. Navigate to `/admin`
2. If not authenticated, you'll see the login form
3. Enter admin credentials
4. Access granted to admin panel

### Admin Routes Protected

- `/admin` - Dashboard
- `/admin/tts-cache` - TTS Cache management
- All future admin routes will be automatically protected

## 7. Security Rules (if using Firestore/Storage)

Update your security rules to use authentication:

```javascript
// Firestore example
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

// Storage example (already in place for TTS)
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /tts/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 8. Testing

1. Start your development server: `yarn dev`
2. Navigate to `http://localhost:3000/admin`
3. Test login with your admin credentials
4. Verify logout functionality
5. Test route protection by accessing admin URLs while logged out

## 9. Deployment Notes

- Environment variables are already configured in `apphosting.yaml`
- Authentication will work in production without additional setup
- Consider setting up email enumeration protection for production use

## 10. Advanced Features (Optional)

### Multi-factor Authentication

- Enable SMS or TOTP-based MFA in Firebase Console
- Add MFA checks in your admin login flow

### Custom Claims

For role-based access control:

```javascript
// Set custom claims via Firebase Admin SDK
await admin.auth().setCustomUserClaims(uid, { admin: true })
```

### Session Management

- Current implementation uses Firebase Auth state persistence
- Sessions persist across browser restarts
- Logout clears the session completely

## Troubleshooting

### Common Issues

1. **"Firebase Auth domain not whitelisted"**

   - Check `FIREBASE_AUTH_DOMAIN` in environment variables
   - Ensure domain is correctly configured in Firebase Console

2. **"Invalid email/password"**

   - Verify credentials in Firebase Console → Authentication → Users
   - Check if user exists and is enabled

3. **Environment variable issues**

   - Ensure all Firebase config variables are set
   - Restart dev server after changing environment variables

4. **CORS issues in development**
   - Add `localhost:3000` to authorized domains in Firebase Console
   - Go to Authentication → Settings → Authorized domains
