export const Checkbox = ({
  label,
  name,
  register,
  error,
  ...props
}: {
  label: string;
  name: string;
  register: any;
  error: string | undefined;
}) => {
  return (
    <div className='flex gap-2 flex-col w-full'>
      <div className='flex gap-2 w-full'>
        <input
          type='checkbox'
          className='rounded-md p-2 accent-green-500'
          {...register(name)}
          {...props}
        />
        <label>{label}</label>
      </div>
      {error && <span className='text-red-500 text-xs'>{error}</span>}
    </div>
  );
};
