# Android Installation Guide for EOATravelDeals

This guide covers two ways to run EOATravelDeals on Android devices:

1. **Progressive Web App (PWA)** - Install directly from your browser (recommended for most users)
2. **Debug APK** - Build and sideload a native Android wrapper (for developers and testing)

---

## Option 1: Install as PWA (Recommended)

### Prerequisites
- Android device with Chrome browser (version 90+)
- Internet connection

### Installation Steps

1. **Open the app in Chrome**
   - Navigate to your deployed EOATravelDeals URL (e.g., `https://your-canister-id.ic0.app`)
   - Make sure you're using Chrome (not Firefox or other browsers)

2. **Install the app**
   - Tap the menu icon (three dots) in the top-right corner
   - Select "Add to Home screen" or "Install app"
   - Confirm the installation when prompted

3. **Launch the app**
   - Find the EOATravelDeals icon on your home screen
   - Tap to launch - the app will open in standalone mode (no browser UI)

### PWA Features
- **Offline support**: The app caches essential assets and shows an offline page when disconnected
- **Home screen icon**: Launch like a native app
- **Standalone mode**: No browser chrome or address bar
- **Background updates**: The app checks for updates automatically

### Troubleshooting PWA Installation

**"Add to Home screen" option not showing:**
- Ensure you're using Chrome (not Firefox, Samsung Internet, etc.)
- The site must be served over HTTPS (not HTTP)
- Try visiting the site a few times to trigger the install prompt

**App won't load offline:**
- The first visit requires internet to cache assets
- Only the app shell is cached; live data requires connection
- Clear the app cache and revisit if issues persist

---

## Option 2: Build Debug APK (Developers)

### Prerequisites

**Required Software:**
- Node.js 18+ and npm/pnpm
- Android Studio (latest stable version)
- Java Development Kit (JDK) 17
- Android SDK (API level 34)

**Environment Setup:**
1. Install Android Studio from https://developer.android.com/studio
2. Open Android Studio → SDK Manager → Install:
   - Android SDK Platform 34
   - Android SDK Build-Tools 34.0.0
   - Android SDK Command-line Tools
3. Set environment variables:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
   ```

### Build Steps

1. **Install Capacitor dependencies**
   ```bash
   cd frontend
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. **Configure the production URL**
   - Copy `.env.capacitor.example` to `.env.capacitor`
   - Edit `.env.capacitor` and set your production HTTPS URL:
     ```
     CAPACITOR_SERVER_URL=https://your-canister-id.ic0.app
     ```
   - **Important**: Must be HTTPS for Internet Identity authentication to work

3. **Build the web app**
   ```bash
   npm run build
   ```

4. **Sync Capacitor**
   ```bash
   npx cap sync android
   ```

5. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

6. **Build the APK**
   - In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Or via command line:
     ```bash
     cd android
     ./gradlew assembleDebug
     ```
   - The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Installing the APK

**Via USB (ADB):**
1. Enable Developer Options on your Android device:
   - Settings → About phone → Tap "Build number" 7 times
2. Enable USB Debugging:
   - Settings → Developer options → USB debugging
3. Connect device via USB and install:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

**Via File Transfer:**
1. Copy `app-debug.apk` to your device (email, cloud storage, etc.)
2. On device: Settings → Security → Enable "Install unknown apps" for your file manager
3. Open the APK file and tap "Install"

### Troubleshooting APK Build

**Gradle build fails:**
- Ensure JDK 17 is installed and set as JAVA_HOME
- Run `./gradlew clean` in the android directory
- Check that Android SDK Platform 34 is installed

**App crashes on launch:**
- Verify `CAPACITOR_SERVER_URL` is set to a valid HTTPS URL
- Check Android Logcat in Android Studio for error messages
- Ensure the production URL is accessible from your device

**Internet Identity login doesn't work:**
- The server URL **must** be HTTPS (not HTTP or localhost)
- Internet Identity requires a secure context for authentication
- Test the URL in Chrome on the device first to verify it's accessible

---

## Internet Identity on Android

### How It Works
- Internet Identity authentication opens in a WebView or browser tab
- After authentication, you're redirected back to the app
- The app receives the authentication token and logs you in

### Common Issues

**Login popup doesn't open:**
- Ensure the app has permission to open external links
- Check that pop-ups aren't blocked in the WebView settings
- Try clearing the app cache and data

**Stuck after authentication:**
- The redirect URL must match your configured server URL exactly
- Check that the app is set to handle the redirect scheme
- Try force-closing and reopening the app

**"Unauthorized" or "Invalid principal" errors:**
- Clear the app cache and try logging in again
- Ensure you're using the same Internet Identity anchor
- Check that the backend canister is deployed and accessible

### Security Notes
- Internet Identity uses WebAuthn and passkeys for secure authentication
- Your private keys never leave your device
- The app only receives a delegated identity token
- Always use HTTPS URLs in production to ensure secure communication

---

## Additional Resources

- **Capacitor Documentation**: https://capacitorjs.com/docs
- **Android Developer Guide**: https://developer.android.com/guide
- **Internet Identity Docs**: https://internetcomputer.org/docs/current/developer-docs/identity/internet-identity/overview

For issues or questions, check the project repository or contact support.
