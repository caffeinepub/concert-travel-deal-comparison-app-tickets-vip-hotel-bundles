import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface StartupError {
  message: string;
  timestamp: number;
}

export default function StartupErrorBanner() {
  const [errors, setErrors] = useState<StartupError[]>([]);

  useEffect(() => {
    // Listen for global error events
    const handleError = (event: ErrorEvent) => {
      const errorMessage = `Error: ${event.message}`;
      console.error('Global error caught:', event.error || event.message);
      
      setErrors(prev => [...prev, {
        message: errorMessage,
        timestamp: Date.now(),
      }]);
    };

    // Listen for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = `Unhandled error: ${event.reason?.message || event.reason || 'Unknown error'}`;
      console.error('Unhandled rejection caught:', event.reason);
      
      setErrors(prev => [...prev, {
        message: errorMessage,
        timestamp: Date.now(),
      }]);
    };

    // Listen for custom startup errors
    const handleStartupError = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const errorMessage = customEvent.detail;
      console.error('Startup error:', errorMessage);
      
      setErrors(prev => [...prev, {
        message: errorMessage,
        timestamp: Date.now(),
      }]);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('startup-error', handleStartupError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('startup-error', handleStartupError);
    };
  }, []);

  const dismissError = (timestamp: number) => {
    setErrors(prev => prev.filter(err => err.timestamp !== timestamp));
  };

  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-50 px-4 space-y-2">
      {errors.map((error) => (
        <Alert
          key={error.timestamp}
          variant="destructive"
          className="max-w-2xl mx-auto shadow-lg"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="flex items-center justify-between">
            <span>Startup Error</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mr-2"
              onClick={() => dismissError(error.timestamp)}
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertTitle>
          <AlertDescription className="text-sm">
            {error.message}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
