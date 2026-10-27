import { Avatar, AvatarFallback, AvatarImage, cn } from '_shared';
import { initials } from '../model';

export const UserAvatar = ({
  name,
  url,
  className,
}: {
  name: string;
  url?: string | null;
  className?: string;
}) => (
  <Avatar className={className}>
    {url && <AvatarImage src={url} alt={name} />}
    <AvatarFallback className={cn('text-sm')}>
      {initials(name) || '🐾'}
    </AvatarFallback>
  </Avatar>
);
