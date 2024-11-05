import { User } from '_entities/user';
import { Avatar as AvatarComponent } from '@nextui-org/avatar';

export const Avatar = ({
  size = 'md',
  user,
  src,
}: {
  user: User;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}) => {
  if (src) {
    return <AvatarComponent src={src} size={size} />;
  } else {
    return (
      <div className='rounded-full cursor-pointer bg-cream p-2 text-white flex items-center justify-center'>
        {user.first_name[0]}
        {user.last_name[0]}
      </div>
    );
  }
};
