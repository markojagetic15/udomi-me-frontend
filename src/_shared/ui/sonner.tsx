import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = (props: ToasterProps) => (
  <Sonner
    position='bottom-right'
    closeButton
    toastOptions={{
      classNames: {
        toast:
          'group rounded-xl border bg-card text-foreground shadow-lift font-sans text-sm gap-3 p-4',
        description: 'text-muted-foreground',
        actionButton: 'bg-primary text-primary-foreground',
        cancelButton: 'bg-muted text-muted-foreground',
        success: '[&_[data-icon]]:text-primary',
        error: '[&_[data-icon]]:text-destructive',
      },
    }}
    {...props}
  />
);

export { Toaster };
export { toast } from 'sonner';
