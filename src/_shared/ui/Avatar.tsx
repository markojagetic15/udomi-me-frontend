import { User } from '_entities/user';
import { Avatar as AvatarComponent } from '@nextui-org/avatar';

export const Avatar = ({
  size = 'md',
  user,
  src,
}: {
  user?: User | null;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}) => {
  return (
    <AvatarComponent
      src={src}
      size={size}
      className='text-white bg-primary'
      name={user?.first_name + ' ' + user?.last_name}
      getInitials={(name) => {
        return name
          .split(' ')
          .map((n) => n[0])
          .join('');
      }}
    />
  );
};
