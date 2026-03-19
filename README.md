# Driver Delivery App 🚚

A premium React Native mobile application for drivers to manage deliveries, optimize routes, and receive real-time notifications. Built for the candidate evaluation test.

## 🚀 Key Features

- **Verification Flow**: Secure Email Verification with a **Demo Bypass** mode for quick reviewing.
- **Smart Deliveries**: Real-time list of assigned deliveries with a **"Generate Demo Data"** button for instant testing.
- **Route Optimization**: Map integration with a "Nearest Neighbor" algorithm that factors in simulated traffic and priority.
- **Background Notifications**: Automated drive alerts via Firebase Cloud Functions and FCM.
- **Secure Configuration**: Uses `react-native-config` to keep API keys out of the source code.

## 🛠️ Tech Stack

- **Frontend**: React Native (v0.82), TypeScript, React Navigation
- **Backend**: Firebase (Auth, Firestore, Messaging, Cloud Functions)
- **Maps**: `react-native-maps`
- **Environment**: `react-native-config`

## 📦 Setup Instructions

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Firebase Setup**:
   - Create a project in [Firebase Console](https://console.firebase.google.com/).
   - Enable **Email/Password** Authentication.
   - Create a **Firestore** database. Use the rules provided in `firebase_setup_guide.md`.
   - Register an Android app and add your `google-services.json` to `android/app/`.
4. **Environment Variables**:
   - Rename `.env.example` to `.env`.
   - Fill in your Firebase keys and **Google Maps API Key**.
5. **Native Build**:
   ```bash
   npx react-native run-android
   ```

## 🎥 Recording the Demo

To ensure a smooth recording:
1.  **Login/Signup**: Create a new account.
2.  **Verification**: If the verification email lands in SPAM (common for new Firebase projects), use the **"Bypass for Demo"** link at the bottom of the screen.
3.  **Data**: On the empty Deliveries screen, click **"Generate Demo Data"** to instantly populate your list with test orders.
4.  **Map**: Click "Optimise Route" to see the smart pathing in action.

## 🔔 Testing Push Notifications

The backend logic is located in the `functions/` directory.
1. `cd functions && npm install`
2. `firebase deploy --only functions`
3. Add a document to `deliveries` in Firestore; the assigned driver will receive an FCM notification.

## 📝 Submission Note
This app was built and tested to meet all assessment criteria for the React Native Developer position. Recorded walkthrough and APK are available via the provided links.
