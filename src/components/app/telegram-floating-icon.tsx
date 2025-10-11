import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

type TelegramFloatingIconProps = {
  href: string;
  className?: string;
};

export function TelegramFloatingIcon({ href, className }: TelegramFloatingIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 animate-pulse',
        className
      )}
      aria-label="Canal do Telegram"
    >
      <Send className="h-7 w-7" />
    </a>
  );
}
