import { Button as ButtonComponent } from '@nextui-org/button';

export const Button = ({
  type = 'button',
  children,
  onClick,
  isLoading,
  isDisabled,
  startIcon,
  endIcon,
  color,
  width,
  className,
  ...props
}: {
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  onClick?: () => void;
  variant:
    | 'solid'
    | 'bordered'
    | 'light'
    | 'flat'
    | 'faded'
    | 'shadow'
    | 'ghost';
  isLoading?: boolean;
  isDisabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'default'
    | 'danger';
  width?: string;
  className?: string;
}) => {
  return (
    <ButtonComponent
      type={type}
      onClick={onClick}
      isLoading={isLoading}
      isDisabled={isDisabled}
      startContent={startIcon}
      endContent={endIcon}
      color={color || 'primary'}
      {...props}
      variant={props.variant}
      className={`w-${width} ${className}`}
    >
      {children}
    </ButtonComponent>
  );
};
