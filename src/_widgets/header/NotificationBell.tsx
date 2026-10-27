import { Bell, CheckCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppNotification,
  notificationView,
  useGetNotifications,
  useMarkNotificationsRead,
  useUnreadNotificationsCount,
} from '_entities/notification';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
  fromNow,
  Spinner,
} from '_shared';
import * as React from 'react';

export const CountBadge = ({
  count,
  className,
}: {
  count: number;
  className?: string;
}) =>
  count > 0 ? (
    <span
      className={cn(
        'absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-terracotta-500 px-1 text-[10px] font-bold text-white ring-2 ring-background',
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  ) : null;

export const NotificationRow = ({
  n,
  onClick,
}: {
  n: AppNotification;
  onClick?: () => void;
}) => {
  const { t, i18n } = useTranslation();
  const view = notificationView(n, t);
  return (
    <Link
      to={view.href}
      onClick={onClick}
      className={cn(
        'flex gap-3 rounded-lg p-2.5 transition-colors hover:bg-secondary',
        !n.is_read && 'bg-secondary/60'
      )}
    >
      <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary [&_svg]:h-4 [&_svg]:w-4'>
        {view.icon}
      </span>
      <span className='min-w-0 flex-1'>
        <span className='block text-sm leading-snug'>{view.text}</span>
        {view.detail && (
          <span className='mt-0.5 block truncate text-xs text-muted-foreground'>
            {view.detail}
          </span>
        )}
        <span className='mt-1 block text-xs text-muted-foreground'>
          {fromNow(n.created_at, i18n.language)}
        </span>
      </span>
      {!n.is_read && (
        <span
          className='mt-1.5 h-2 w-2 shrink-0 rounded-full bg-terracotta-500'
          aria-hidden
        />
      )}
    </Link>
  );
};

export const NotificationBell = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const { unreadNotifications } = useUnreadNotificationsCount(true);
  const { getNotifications } = useGetNotifications(1, 8, open);
  const { markRead } = useMarkNotificationsRead();
  const items = getNotifications.data?.notifications ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative'
          aria-label={t('nav.notifications')}
        >
          <Bell />
          <CountBadge count={unreadNotifications} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='end'
        className='w-[min(24rem,calc(100vw-1.5rem))] p-0'
      >
        <div className='flex items-center justify-between border-b px-4 py-3'>
          <span className='font-display font-bold'>
            {t('nav.notifications')}
          </span>
          {unreadNotifications > 0 && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => markRead(undefined)}
            >
              <CheckCheck /> {t('notifications.markAllRead')}
            </Button>
          )}
        </div>
        <div className='max-h-[60vh] overflow-y-auto p-1.5'>
          {getNotifications.isLoading ? (
            <div className='flex justify-center py-8'>
              <Spinner />
            </div>
          ) : items.length === 0 ? (
            <p className='px-4 py-10 text-center text-sm text-muted-foreground'>
              {t('notifications.empty')}
            </p>
          ) : (
            items.map((n) => (
              <NotificationRow
                key={n.id}
                n={n}
                onClick={() => {
                  if (!n.is_read) markRead(n.id);
                  setOpen(false);
                }}
              />
            ))
          )}
        </div>
        <div className='border-t p-1.5'>
          <Button
            variant='ghost'
            className='w-full'
            onClick={() => {
              setOpen(false);
              navigate('/notifications');
            }}
          >
            {t('notifications.viewAll')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
