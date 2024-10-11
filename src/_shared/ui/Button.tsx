export const Button = ({
  type = 'button',
  width,
  children,
  onClick,
  margin,
  className,
  ...props
}: {
  type?: 'button' | 'submit' | 'reset';
  width?: string;
  children: React.ReactNode;
  onClick?: () => void;
  margin?: string;
  className?: string;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-green-500 text-white rounded-md p-3 w-[${width}]`}
      className={`bg-green-500 text-white rounded-md p-3 w-[${width}] ${className}`}
      {...props}
      style={{ margin: margin }}
    >
      {children}
    </button>
  );
};
