/**
 * Service worker registration helper for PWA support.
 * Only registers in production builds to avoid development conflicts.
 * Provides callback-based API for handling registration failures.
 */

interface ServiceWorkerCallbacks {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

export function registerServiceWorker(callbacks?: ServiceWorkerCallbacks): void {
  // Only register in production and if service workers are supported
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Use the Vite base URL for service worker registration
      const swPath = `${import.meta.env.BASE_URL || '/'}sw.js`.replace(/\/+/g, '/');
      
      navigator.serviceWorker
        .register(swPath)
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
          
          // Call success callback if provided
          if (callbacks?.onSuccess) {
            callbacks.onSuccess(registration);
          }
        })
        .catch((error) => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          const swError = new Error(`Service Worker registration failed: ${errorMessage}`);
          console.error('Service Worker registration failed:', swError);
          
          // Call error callback if provided
          if (callbacks?.onError) {
            callbacks.onError(swError);
          }
        });
    });
  }
}
