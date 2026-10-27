import * as React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Settings,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import { useGlobalContext } from '_app';
import { useLogout, UserAvatar } from '_entities/user';
import { useUnreadMessagesCount } from '_entities/messaging';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Logo,
  Separator,
  Sheet,
  SheetContent,
  SheetTitle,
  cn,
} from '_shared';
import { CountBadge, NotificationBell } from './NotificationBell';
import { LanguageSwitcher } from './LanguageSwitcher';

const NAV = [
  { to: '/browse', key: 'nav.adopt' },
  { to: '/lost-found', key: 'nav.lostFound' },
  { to: '/stories', key: 'nav.stories' },
] as const;

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
    isActive
      ? 'bg-secondary text-primary'
      : 'text-foreground/80 hover:bg-secondary hover:text-foreground'
  );

export const AppHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoggedIn, isAdmin } = useGlobalContext();
  const { logout } = useLogout();
  const { unreadMessages } = useUnreadMessagesCount(isLoggedIn);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const close = () => setMobileOpen(false);
  const name = user ? `${user.first_name} ${user.last_name}` : '';

  return (
    <header className='sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70'>
      <div className='container flex h-16 items-center gap-2'>
        <Logo className='mr-4' />

        <nav
          className='hidden items-center gap-1 md:flex'
          aria-label={t('nav.main')}
        >
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={navClass}>
              {t(n.key)}
            </NavLink>
          ))}
        </nav>

        <div className='ml-auto flex items-center gap-1'>
          <Button
            onClick={() => navigate('/create-listing')}
            className='hidden sm:inline-flex'
          >
            <Plus /> {t('nav.createListing')}
          </Button>

          {isLoggedIn ? (
            <>
              <Button variant='ghost' size='icon' className='relative' asChild>
                <Link to='/messages' aria-label={t('nav.messages')}>
                  <MessageCircle />
                  <CountBadge count={unreadMessages} />
                </Link>
              </Button>
              <NotificationBell />
              <div className='hidden md:block'>
                <LanguageSwitcher compact />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className='ml-1 hidden rounded-full ring-offset-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:block'
                    aria-label={t('nav.account')}
                  >
                    <UserAvatar
                      name={name}
                      url={user?.avatar_url}
                      className='h-9 w-9'
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuLabel className='flex flex-col'>
                    <span className='truncate'>{name}</span>
                    <span className='truncate text-xs font-normal text-muted-foreground'>
                      {user?.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate('/profile')}>
                    <LayoutDashboard /> {t('nav.myListings')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => navigate('/profile?tab=favorites')}
                  >
                    <Heart /> {t('nav.favorites')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => navigate(`/users/${user?.id}`)}
                  >
                    <UserIcon /> {t('nav.publicProfile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => navigate('/profile?tab=settings')}
                  >
                    <Settings /> {t('nav.settings')}
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onSelect={() => navigate('/admin')}>
                      <Shield /> {t('nav.admin')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => logout()}>
                    <LogOut /> {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className='hidden items-center gap-1 md:flex'>
              <LanguageSwitcher compact />
              <Button variant='ghost' onClick={() => navigate('/login')}>
                {t('nav.login')}
              </Button>
              <Button variant='outline' onClick={() => navigate('/register')}>
                {t('nav.register')}
              </Button>
            </div>
          )}

          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={() => setMobileOpen(true)}
            aria-label={t('nav.menu')}
          >
            <Menu />
          </Button>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side='right' className='flex flex-col gap-2 p-5'>
          <SheetTitle className='sr-only'>{t('nav.menu')}</SheetTitle>
          {isLoggedIn && (
            <div className='mb-2 flex items-center gap-3 pr-8'>
              <UserAvatar
                name={name}
                url={user?.avatar_url}
                className='h-11 w-11'
              />
              <div className='min-w-0'>
                <p className='truncate font-semibold'>{name}</p>
                <p className='truncate text-xs text-muted-foreground'>
                  {user?.email}
                </p>
              </div>
            </div>
          )}
          <Button
            onClick={() => {
              close();
              navigate('/create-listing');
            }}
            size='lg'
          >
            <Plus /> {t('nav.createListing')}
          </Button>
          <nav className='mt-2 flex flex-col gap-1' aria-label={t('nav.main')}>
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={navClass}
                onClick={close}
              >
                {t(n.key)}
              </NavLink>
            ))}
          </nav>
          <Separator className='my-2' />
          {isLoggedIn ? (
            <nav className='flex flex-col gap-1'>
              <NavLink to='/messages' className={navClass} onClick={close}>
                {t('nav.messages')}{' '}
                {unreadMessages > 0 && `(${unreadMessages})`}
              </NavLink>
              <NavLink to='/notifications' className={navClass} onClick={close}>
                {t('nav.notifications')}
              </NavLink>
              <NavLink to='/profile' end className={navClass} onClick={close}>
                {t('nav.myListings')}
              </NavLink>
              <NavLink
                to='/profile?tab=favorites'
                className={navClass}
                onClick={close}
              >
                {t('nav.favorites')}
              </NavLink>
              <NavLink
                to='/profile?tab=settings'
                className={navClass}
                onClick={close}
              >
                {t('nav.settings')}
              </NavLink>
              {isAdmin && (
                <NavLink to='/admin' className={navClass} onClick={close}>
                  {t('nav.admin')}
                </NavLink>
              )}
              <button
                className='rounded-lg px-3 py-2 text-left text-sm font-semibold text-destructive hover:bg-destructive/10'
                onClick={() => logout()}
              >
                {t('nav.logout')}
              </button>
            </nav>
          ) : (
            <div className='flex flex-col gap-2'>
              <Button
                variant='outline'
                onClick={() => {
                  close();
                  navigate('/login');
                }}
              >
                {t('nav.login')}
              </Button>
              <Button
                variant='secondary'
                onClick={() => {
                  close();
                  navigate('/register');
                }}
              >
                {t('nav.register')}
              </Button>
            </div>
          )}
          <div className='mt-auto'>
            <LanguageSwitcher />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};
