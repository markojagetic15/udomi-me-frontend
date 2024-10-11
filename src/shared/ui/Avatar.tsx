import { User } from '@entities';

export const Avatar = ({
  user,
  width = 40,
  height = 40,
}: {
  user: User;
  width?: number;
  height?: number;
}) => {
  return (
    <div
      className={`w-[${width}] h-[${height}] rounded-full cursor-pointer bg-green-500 p-2 text-white flex items-center justify-center`}
    >
      {user.first_name[0]}
      {user.last_name[0]}
    </div>
  );
};
