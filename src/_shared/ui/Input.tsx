export const Input = ({
  name,
  label,
  type = 'text',
  width,
  error,
  register,
  endIcon,
  hide,
  ...props
}: {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  width?: string;
  error?: string;
  register?: any;
  hide?: boolean;
  endIcon?: React.ReactNode;
}) => {
  return (
    <div className='flex flex-col gap-1.5'>
      <label htmlFor={name}>{label}</label>
      <div className={`relative w-full w-[${width}]`}>
        <input
          id={name}
          name={name}
          type={type}
          hidden={hide}
          {...props}
          className={`border border-gray-300 rounded-md p-1.5 outline-none focus:border-green-500 w-full`}
          {...(register && register(name))}
        />
        {endIcon && (
          <div className='absolute right-2.5 top-1/2 flex justify-end -translate-x-1/2 -translate-y-1/2 cursor-pointer'>
            {endIcon}
          </div>
        )}
      </div>

      {error && <span className='text-red-500 text-xs'>{error}</span>}
    </div>
  );
};
