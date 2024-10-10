export const Button = ({
  type = 'button',
  width,
  children,
  onClick,
  margin,
  ...props
}: {
  type?: 'button' | 'submit' | 'reset';
  width?: string;
  children: React.ReactNode;
  onClick?: () => void;
  margin?: string;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-green-500 text-white rounded-md p-3 w-[${width}]`}
      {...props}
      style={{ margin: margin }}
    >
      {children}
    </button>
  );
};
