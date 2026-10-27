import * as React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { Camera, Download, Trash2 } from 'lucide-react';
import {
  Me,
  useChangePassword,
  useDeleteMe,
  useExportMe,
  useUpdateMe,
  UserAvatar,
} from '_entities/user';
import { uploadFile } from '_entities/resource';
import {
  changePasswordSchema,
  PasswordInput,
  PasswordStrength,
} from '_features/auth';
import { ShelterApplicationForm } from '_features/shelter';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  errorMessage,
  FormField,
  Input,
  Label,
  Switch,
  toast,
} from '_shared';

const ProfileCard = ({ me }: { me: Me }) => {
  const { t } = useTranslation();
  const [first, setFirst] = React.useState(me.first_name);
  const [last, setLast] = React.useState(me.last_name);
  const [uploading, setUploading] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const { updateMe, isPending } = useUpdateMe();

  const onAvatar = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    const res = await uploadFile(file);
    setUploading(false);
    if (!res) return toast.error(t('upload.failed', { name: file.name }));
    updateMe({ avatar_url: res.url });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.profile')}</CardTitle>
        <CardDescription>{t('settings.profileHint')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className='flex flex-col gap-5'
          onSubmit={(e) => {
            e.preventDefault();
            if (first.trim() && last.trim())
              updateMe({ first_name: first.trim(), last_name: last.trim() });
          }}
        >
          <div className='flex items-center gap-4'>
            <UserAvatar
              name={`${me.first_name} ${me.last_name}`}
              url={me.avatar_url}
              className='h-16 w-16 text-lg'
            />
            <div className='flex flex-wrap gap-2'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                loading={uploading}
                onClick={() => fileRef.current?.click()}
              >
                <Camera /> {t('settings.changePhoto')}
              </Button>
              {me.avatar_url && (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => updateMe({ avatar_url: null })}
                >
                  {t('common.remove')}
                </Button>
              )}
            </div>
            <input
              ref={fileRef}
              type='file'
              accept='image/*'
              hidden
              onChange={(e) => onAvatar(e.target.files?.[0])}
            />
          </div>
          <div className='grid gap-4 sm:grid-cols-2'>
            <FormField label={t('auth.firstName')}>
              <Input
                value={first}
                onChange={(e) => setFirst(e.target.value)}
                maxLength={50}
              />
            </FormField>
            <FormField label={t('auth.lastName')}>
              <Input
                value={last}
                onChange={(e) => setLast(e.target.value)}
                maxLength={50}
              />
            </FormField>
          </div>
          <FormField label={t('auth.email')} hint={t('settings.emailHint')}>
            <Input value={me.email} disabled />
          </FormField>
          <Button type='submit' className='self-start' loading={isPending}>
            {t('common.save')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const PreferencesCard = ({ me }: { me: Me }) => {
  const { t } = useTranslation();
  const { updateMe } = useUpdateMe({ silent: true });
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.notifications')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between gap-4'>
          <Label htmlFor='email-notif' className='flex flex-col gap-1'>
            <span>{t('settings.emailNotifications')}</span>
            <span className='text-sm font-normal text-muted-foreground'>
              {t('settings.emailNotificationsHint')}
            </span>
          </Label>
          <Switch
            id='email-notif'
            checked={me.email_notifications}
            onCheckedChange={(v) => updateMe({ email_notifications: v })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const PasswordCard = () => {
  const { t } = useTranslation();
  const [serverError, setServerError] = React.useState('');
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(changePasswordSchema(t)) });
  const { changePassword, isPending } = useChangePassword({
    onSuccess: () => {
      reset();
      setServerError('');
      toast.success(t('settings.passwordChanged'));
    },
    onError: (e) => setServerError(errorMessage(e, t)),
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.password')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(({ currentPassword, newPassword }) =>
            changePassword({ currentPassword, newPassword })
          )}
          className='flex max-w-md flex-col gap-4'
        >
          <FormField
            label={t('settings.currentPassword')}
            error={errors.currentPassword?.message}
          >
            <PasswordInput
              {...register('currentPassword')}
              autoComplete='current-password'
            />
          </FormField>
          <FormField
            label={t('settings.newPassword')}
            error={errors.newPassword?.message}
          >
            <PasswordInput
              {...register('newPassword')}
              autoComplete='new-password'
            />
          </FormField>
          <PasswordStrength value={watch('newPassword') ?? ''} />
          <FormField
            label={t('auth.confirmPassword')}
            error={errors.confirm?.message}
          >
            <PasswordInput
              {...register('confirm')}
              autoComplete='new-password'
            />
          </FormField>
          {serverError && (
            <p className='text-sm font-medium text-destructive'>
              {serverError}
            </p>
          )}
          <Button type='submit' className='self-start' loading={isPending}>
            {t('settings.changePassword')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const PrivacyCard = ({ me }: { me: Me }) => {
  const { t } = useTranslation();
  const { exportMe, isPending: exporting } = useExportMe();
  const { deleteMe, isPending: deleting } = useDeleteMe();
  const [open, setOpen] = React.useState(false);
  const [confirm, setConfirm] = React.useState('');
  const word = t('settings.deleteWord');
  return (
    <Card className='border-destructive/30'>
      <CardHeader>
        <CardTitle>{t('settings.privacy')}</CardTitle>
        <CardDescription>{t('settings.privacyHint')}</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='font-medium'>{t('settings.export')}</p>
            <p className='text-sm text-muted-foreground'>
              {t('settings.exportHint')}
            </p>
          </div>
          <Button
            variant='outline'
            loading={exporting}
            onClick={() => exportMe()}
          >
            <Download /> {t('settings.exportButton')}
          </Button>
        </div>
        <div className='flex flex-col gap-3 rounded-lg bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='font-medium text-destructive'>
              {t('settings.delete')}
            </p>
            <p className='text-sm text-muted-foreground'>
              {t('settings.deleteHint')}
            </p>
          </div>
          <Button variant='destructive' onClick={() => setOpen(true)}>
            <Trash2 /> {t('settings.deleteButton')}
          </Button>
        </div>
      </CardContent>
      <AlertDialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          setConfirm('');
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('settings.deleteConfirmTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('settings.deleteConfirmText', { email: me.email, word })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={word}
            aria-label={word}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              destructive
              disabled={
                confirm.trim().toLowerCase() !== word.toLowerCase() || deleting
              }
              onClick={() => deleteMe()}
            >
              {t('settings.deleteButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export const SettingsTab = ({ me }: { me: Me }) => {
  const { t } = useTranslation();
  return (
    <div className='grid gap-5 lg:grid-cols-2'>
      <div className='flex flex-col gap-5'>
        <ProfileCard me={me} />
        <PreferencesCard me={me} />
        <PasswordCard />
      </div>
      <div className='flex flex-col gap-5'>
        <Card>
          <CardHeader>
            <CardTitle>{t('shelter.title')}</CardTitle>
            <CardDescription>{t('shelter.hint')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ShelterApplicationForm me={me} />
          </CardContent>
        </Card>
        <PrivacyCard me={me} />
      </div>
    </div>
  );
};
