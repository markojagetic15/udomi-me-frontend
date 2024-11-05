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
    >
      {children}
    </ButtonComponent>
  );
};
