import { useTranslation } from 'react-i18next';
import { Link2, Share2 } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  toast,
} from '_shared';

const WhatsApp = () => (
  <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden>
    <path d='M17.47 14.38c-.3-.15-1.75-.86-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.24-.7.24-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.97 1-3.62-.24-.37a9.8 9.8 0 1 1 8.33 4.6zm8.35-18.14A11.75 11.75 0 0 0 12.05 0C5.5 0 .17 5.33.17 11.88c0 2.1.55 4.14 1.59 5.94L.07 24l6.3-1.65a11.85 11.85 0 0 0 5.67 1.44h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.16-3.48-8.4z' />
  </svg>
);
const Facebook = () => (
  <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden>
    <path d='M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07' />
  </svg>
);
const Viber = () => (
  <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden>
    <path d='M11.4 0C9.47.03 5.33.35 3.02 2.47 1.3 4.18.7 6.7.63 9.83c-.06 3.12-.13 8.98 5.5 10.57v2.42s-.04.98.6 1.18c.79.24 1.24-.5 1.99-1.3l1.4-1.58c3.85.32 6.8-.42 7.14-.53.78-.25 5.18-.81 5.9-6.66.73-6.03-.36-9.83-2.33-11.54C20.23 1.79 17.29.04 11.4 0zm.17 1.73c5.04.03 7.45 1.56 8 2.06 1.62 1.39 2.45 4.73 1.85 9.6-.58 4.73-4.05 5.03-4.69 5.23-.27.09-2.79.71-5.95.5 0 0-2.36 2.84-3.1 3.58-.11.12-.25.16-.34.14-.13-.03-.16-.18-.16-.4l.02-3.89c-4.76-1.32-4.48-6.27-4.43-8.86.06-2.6.55-4.72 2-6.15 1.95-1.77 5.45-1.82 6.8-1.81z' />
  </svg>
);

// Native share sheet on phones; explicit targets everywhere.
export const ShareButtons = ({ title }: { title: string }) => {
  const { t } = useTranslation();
  const url = window.location.href;
  const text = `${title} - Udomi me`;
  const enc = encodeURIComponent;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t('share.copied'));
    } catch {
      toast.error(t('share.copyFailed'));
    }
  };

  const native = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          aria-label={t('share.title')}
          onClick={(e) => {
            if (native) {
              e.preventDefault();
              navigator.share({ title: text, url }).catch(() => undefined);
            }
          }}
        >
          <Share2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild>
          <a
            href={`https://wa.me/?text=${enc(`${text} ${url}`)}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <WhatsApp /> WhatsApp
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={`viber://forward?text=${enc(`${text} ${url}`)}`}>
            <Viber /> Viber
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Facebook /> Facebook
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={copy}>
          <Link2 /> {t('share.copyLink')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
