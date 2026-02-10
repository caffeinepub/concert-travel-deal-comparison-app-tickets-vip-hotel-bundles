import { Heart } from 'lucide-react';
import { branding } from '@/config/branding';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'concertbundle-app';

  return (
    <footer className="border-t bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            © {currentYear} {branding.appName}. Built with{' '}
            <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground transition-colors underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
