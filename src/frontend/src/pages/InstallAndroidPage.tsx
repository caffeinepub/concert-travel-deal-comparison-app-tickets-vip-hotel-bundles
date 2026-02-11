import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone, Download, Chrome, Shield, ExternalLink } from 'lucide-react';
import { branding } from '@/config/branding';

export default function InstallAndroidPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <img
          src={branding.logo.primary}
          alt={branding.logo.alt}
          className="h-24 w-24 mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold mb-2">Install on Android</h1>
        <p className="text-muted-foreground">
          Get {branding.appName} on your Android device
        </p>
      </div>

      {/* PWA Installation - Recommended */}
      <Card className="mb-8 border-primary">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Chrome className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Install as an App (Recommended)</CardTitle>
              <CardDescription>
                Install directly from Chrome browser - no download needed
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Smartphone className="h-4 w-4" />
            <AlertDescription>
              This is the easiest way to install {branding.appName}. Works like a native app with offline support.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Installation Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Open this website in <strong>Chrome browser</strong> on your Android device</li>
              <li>Tap the <strong>menu icon</strong> (three dots) in the top-right corner</li>
              <li>Select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></li>
              <li>Confirm the installation when prompted</li>
              <li>Find the {branding.appName} icon on your home screen and tap to launch</li>
            </ol>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> You must use Chrome browser. The site must be accessed via HTTPS for Internet Identity authentication to work.
            </AlertDescription>
          </Alert>

          <div className="pt-2">
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Launch like a native app from your home screen</li>
              <li>Works offline with cached content</li>
              <li>No browser UI - full screen experience</li>
              <li>Automatic updates when you're online</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* APK Installation - Developer/Testing */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Download className="h-6 w-6" />
            <div>
              <CardTitle>Downloadable APK (Developer/Testing)</CardTitle>
              <CardDescription>
                Build and sideload a native Android wrapper
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              <strong>Advanced users only.</strong> This method requires technical knowledge and is intended for developers and testing purposes.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Overview:</h3>
            <p className="text-sm text-muted-foreground">
              {branding.appName} includes a Capacitor Android wrapper that can be built into a debug APK. 
              This allows you to install the app as a native Android application for testing.
            </p>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Prerequisites:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Node.js 18+ and npm/pnpm</li>
                <li>Android Studio (latest stable version)</li>
                <li>Java Development Kit (JDK) 17</li>
                <li>Android SDK (API level 34)</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Configuration:</h4>
              <p className="text-sm text-muted-foreground">
                Before building, you must configure the production HTTPS URL:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-2">
                <li>Copy <code className="bg-background px-1 py-0.5 rounded">frontend/.env.capacitor.example</code> to <code className="bg-background px-1 py-0.5 rounded">frontend/.env.capacitor</code></li>
                <li>Set <code className="bg-background px-1 py-0.5 rounded">CAPACITOR_SERVER_URL</code> to your production HTTPS URL</li>
              </ol>
              <Alert className="mt-2">
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Important:</strong> The server URL must be HTTPS for Internet Identity authentication to work. HTTP or localhost will not work.
                </AlertDescription>
              </Alert>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Build Commands:</h4>
              <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
                <code>{`cd frontend
npm run build
npx cap sync android
cd android
./gradlew assembleDebug`}</code>
              </pre>
              <p className="text-xs text-muted-foreground mt-2">
                The debug APK will be located at: <code className="bg-background px-1 py-0.5 rounded">android/app/build/outputs/apk/debug/app-debug.apk</code>
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Installation:</h4>
              <p className="text-sm text-muted-foreground">
                To install the APK on your device:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
                <li><strong>Via USB:</strong> Enable USB debugging and run <code className="bg-background px-1 py-0.5 rounded">adb install app-debug.apk</code></li>
                <li><strong>Via file transfer:</strong> Copy the APK to your device, enable "Install unknown apps" in Settings, and open the APK file</li>
              </ul>
            </div>
          </div>

          <Button variant="outline" className="w-full" asChild>
            <a
              href="https://github.com/your-repo/docs/android.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View Full Documentation
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Troubleshooting Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Troubleshooting</CardTitle>
          <CardDescription>Common issues and solutions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">PWA: "Add to Home screen" not showing</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Ensure you're using Chrome browser (not Firefox or Samsung Internet)</li>
              <li>The site must be served over HTTPS</li>
              <li>Try visiting the site a few times to trigger the install prompt</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">APK: Internet Identity login doesn't work</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Verify <code className="bg-background px-1 py-0.5 rounded">CAPACITOR_SERVER_URL</code> is set to a valid HTTPS URL</li>
              <li>Internet Identity requires a secure context (HTTPS) for authentication</li>
              <li>Test the URL in Chrome on your device first to verify it's accessible</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">App won't load offline</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>The first visit requires internet to cache assets</li>
              <li>Only the app shell is cached; live data requires connection</li>
              <li>Clear the app cache and revisit if issues persist</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
