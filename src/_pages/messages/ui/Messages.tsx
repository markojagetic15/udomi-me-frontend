import * as React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import {
  ArrowLeft,
  BadgeCheck,
  MessageCircle,
  PawPrint,
  SendHorizontal,
} from 'lucide-react';
import { ChatMessage, ConversationSummary } from '_entities/messaging';
import {
  isVerifiedShelter,
  publicName,
  ShelterBadge,
  UserAvatar,
} from '_entities/user';
import {
  Badge,
  Button,
  cn,
  EmptyState,
  formatDate,
  formatTime,
  fromNow,
  Spinner,
  Textarea,
} from '_shared';
import { useMessagesPage } from '../hooks';

const ConversationItem = ({
  c,
  active,
}: {
  c: ConversationSummary;
  active: boolean;
}) => {
  const { t, i18n } = useTranslation();
  const teamView = c.is_support && c.role === 'participant';
  const name = teamView ? t('messages.team') : publicName(c.other);
  return (
    <Link
      to={`/messages/${c.id}`}
      className={cn(
        'flex gap-3 rounded-xl p-3 transition-colors',
        active ? 'bg-secondary' : 'hover:bg-muted'
      )}
    >
      <div className='relative shrink-0'>
        {teamView ? (
          <TeamAvatar className='h-12 w-12' />
        ) : c.listing?.image ? (
          <img
            src={c.listing.image}
            alt=''
            className='h-12 w-12 rounded-xl object-cover'
          />
        ) : (
          <UserAvatar
            name={name}
            url={c.other.avatar_url}
            className='h-12 w-12'
          />
        )}
        {c.unread && (
          <span className='absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-terracotta-500 ring-2 ring-card' />
        )}
      </div>
      <div className='min-w-0 flex-1'>
        <div className='flex items-baseline justify-between gap-2'>
          <p
            className={cn(
              'truncate text-sm',
              c.unread ? 'font-bold' : 'font-semibold'
            )}
          >
            {name}
          </p>
          <span className='shrink-0 text-[11px] text-muted-foreground'>
            {fromNow(c.last_message_at, i18n.language)}
          </span>
        </div>
        <p className='truncate text-xs text-primary'>
          {c.is_support
            ? t('messages.officialThread')
            : (c.listing?.title ?? t('messages.listingRemoved'))}
        </p>
        <p
          className={cn(
            'truncate text-sm',
            c.unread ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {c.last_message_preview}
        </p>
      </div>
    </Link>
  );
};

const groupByDay = (messages: ChatMessage[]) => {
  const groups: { day: string; items: ChatMessage[] }[] = [];
  for (const m of messages) {
    const day = dayjs(m.created_at).format('YYYY-MM-DD');
    if (groups[groups.length - 1]?.day !== day) groups.push({ day, items: [] });
    groups[groups.length - 1].items.push(m);
  }
  return groups;
};

// Admin-started threads read as "Udomi me tim" for the user; the admin sees
// the user's name with a team badge.
const TeamAvatar = ({ className }: { className?: string }) => (
  <span
    className={cn(
      'flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground',
      className
    )}
  >
    <PawPrint className='h-1/2 w-1/2' />
  </span>
);

const TeamBadge = ({ label }: { label: string }) => (
  <Badge variant='secondary' className='gap-1 text-primary'>
    <BadgeCheck className='!size-3.5' /> {label}
  </Badge>
);

export const Messages = () => {
  const { t } = useTranslation();
  const p = useMessagesPage();
  const c = p.conversation;
  const teamView = !!c?.is_support && c.role === 'participant';
  const otherName = c
    ? teamView
      ? t('messages.team')
      : publicName(c.other)
    : '';

  const list = (
    <div
      className={cn(
        'flex min-h-0 flex-col border-r bg-card md:flex',
        p.activeId ? 'hidden' : 'flex'
      )}
    >
      <div className='border-b px-4 py-4'>
        <h1 className='text-xl font-extrabold'>{t('messages.title')}</h1>
      </div>
      <div className='flex-1 overflow-y-auto p-2'>
        {p.conversationsLoading ? (
          <div className='flex justify-center py-10'>
            <Spinner />
          </div>
        ) : p.conversations.length === 0 ? (
          <p className='px-4 py-10 text-center text-sm text-muted-foreground'>
            {t('messages.empty')}
          </p>
        ) : (
          p.conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              c={conv}
              active={conv.id === p.activeId}
            />
          ))
        )}
      </div>
    </div>
  );

  const thread = !p.activeId ? (
    <div className='hidden items-center justify-center p-8 md:flex'>
      <EmptyState
        icon={<MessageCircle />}
        title={t('messages.pickTitle')}
        description={t('messages.pickText')}
        className='border-0 bg-transparent'
      />
    </div>
  ) : p.conversationError ? (
    <div className='flex items-center justify-center p-8'>
      <EmptyState
        title={t('messages.notFound')}
        action={<Button onClick={p.back}>{t('common.back')}</Button>}
      />
    </div>
  ) : (
    <div className='flex min-h-0 flex-col'>
      <div className='flex items-center gap-3 border-b bg-card px-3 py-3 sm:px-4'>
        <Button
          variant='ghost'
          size='icon'
          className='md:hidden'
          onClick={p.back}
          aria-label={t('common.back')}
        >
          <ArrowLeft />
        </Button>
        {c && (
          <>
            {teamView ? (
              <div className='flex min-w-0 items-center gap-3'>
                <TeamAvatar className='h-10 w-10' />
                <div className='min-w-0'>
                  <p className='flex items-center gap-1.5 truncate font-semibold'>
                    {otherName} <TeamBadge label={t('messages.official')} />
                  </p>
                  <p className='truncate text-xs text-muted-foreground'>
                    {t('messages.officialHint')}
                  </p>
                </div>
              </div>
            ) : (
              <Link
                to={`/users/${c.other.id}`}
                className='flex min-w-0 items-center gap-3'
              >
                <UserAvatar
                  name={otherName}
                  url={c.other.avatar_url}
                  className='h-10 w-10'
                />
                <div className='min-w-0'>
                  <p className='flex items-center gap-1.5 truncate font-semibold'>
                    {otherName}{' '}
                    {isVerifiedShelter(c.other) && <ShelterBadge compact />}
                    {c.is_support && (
                      <TeamBadge label={t('messages.teamBadge')} />
                    )}
                  </p>
                  {c.listing && (
                    <p className='truncate text-xs text-muted-foreground'>
                      {c.listing.title}
                    </p>
                  )}
                </div>
              </Link>
            )}
            {c.listing && (
              <Button
                variant='outline'
                size='sm'
                className='ml-auto hidden sm:inline-flex'
                asChild
              >
                <Link to={`/animal/${c.listing.id}`}>
                  {t('messages.viewListing')}
                </Link>
              </Button>
            )}
          </>
        )}
      </div>

      <div className='flex-1 overflow-y-auto bg-background px-3 py-4 sm:px-6'>
        {p.messagesLoading ? (
          <div className='flex justify-center py-10'>
            <Spinner />
          </div>
        ) : (
          groupByDay(p.messages).map((g) => (
            <div key={g.day} className='flex flex-col gap-1.5'>
              <p className='my-3 self-center rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground'>
                {formatDate(g.day)}
              </p>
              {g.items.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'flex',
                    m.mine ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3.5 py-2 text-sm shadow-sm sm:max-w-[70%]',
                      m.mine
                        ? 'rounded-br-md bg-primary text-primary-foreground'
                        : 'rounded-bl-md border bg-card'
                    )}
                  >
                    <p className='whitespace-pre-wrap break-words'>{m.body}</p>
                    <p
                      className={cn(
                        'mt-0.5 text-right text-[10px]',
                        m.mine
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      )}
                    >
                      {formatTime(m.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={p.bottomRef} />
      </div>

      {c?.other_banned ? (
        <p className='border-t bg-muted p-4 text-center text-sm text-muted-foreground'>
          {t('messages.userUnavailable')}
        </p>
      ) : (
        <form
          className='flex items-end gap-2 border-t bg-card p-3'
          onSubmit={(e) => {
            e.preventDefault();
            p.send();
          }}
        >
          <Textarea
            value={p.draft}
            onChange={(e) => p.setDraft(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                p.send();
              }
            }}
            rows={1}
            maxLength={2000}
            placeholder={t('messages.placeholder')}
            aria-label={t('messages.placeholder')}
            className='max-h-36 min-h-[44px] resize-none'
          />
          <Button
            type='submit'
            size='icon'
            className='h-11 w-11 shrink-0'
            loading={p.isSending}
            disabled={!p.draft.trim()}
            aria-label={t('messages.send')}
          >
            {!p.isSending && <SendHorizontal />}
          </Button>
        </form>
      )}
    </div>
  );

  return (
    <div className='container max-w-6xl px-0 sm:px-4 sm:py-6'>
      <div className='grid h-[calc(100dvh-4rem)] overflow-hidden border-x bg-card sm:h-[calc(100dvh-7rem)] sm:rounded-xl sm:border sm:shadow-soft md:grid-cols-[320px_1fr]'>
        {list}
        {thread}
      </div>
    </div>
  );
};
