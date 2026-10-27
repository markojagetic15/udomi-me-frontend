import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { useGlobalContext } from '_app';
import { useUpdateMe } from '_entities/user';
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '_shared';

const LANGS = [
  { code: 'hr', label: 'Hrvatski' },
  { code: 'en', label: 'English' },
] as const;

// Persisted in localStorage by i18next; also saved on the account so emails
// arrive in the same language.
export const LanguageSwitcher = ({ compact }: { compact?: boolean }) => {
  const { i18n } = useTranslation();
  const { isLoggedIn } = useGlobalContext();
  const { updateMe } = useUpdateMe({ silent: true });
  const current = i18n.language === 'en' ? 'en' : 'hr';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size={compact ? 'icon' : 'sm'}
          aria-label='Language / Jezik'
        >
          <Languages />
          {!compact && <span className='uppercase'>{current}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-[9rem]'>
        {LANGS.map((l) => (
          <DropdownMenuCheckboxItem
            key={l.code}
            checked={current === l.code}
            onCheckedChange={() => {
              i18n.changeLanguage(l.code);
              document.documentElement.lang = l.code;
              if (isLoggedIn) updateMe({ language: l.code });
            }}
          >
            {l.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
