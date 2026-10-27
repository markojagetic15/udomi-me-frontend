import { useTranslation } from 'react-i18next';
import {
  BadgeCheck,
  Ban,
  EyeOff,
  Flag,
  History,
  Home,
  LayoutGrid,
  Megaphone,
  PawPrint,
  Shield,
  Users,
} from 'lucide-react';
import { useGlobalContext } from '_app';
import { AdminStats } from '_entities/admin';
import {
  Badge,
  Card,
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
} from '_shared';
import { useAdminPage } from '../hooks';
import { ActivityTab } from './ActivityTab';
import { ListingSheet } from './ListingSheet';
import { MessagesTab } from './MessagesTab';
import { PetsTab } from './PetsTab';
import { ReportsTab } from './ReportsTab';
import { SheltersTab } from './SheltersTab';
import { UserSheet } from './UserSheet';
import { UsersTab } from './UsersTab';

const Stat = ({
  icon,
  label,
  value,
  highlight,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value?: number;
  highlight?: boolean;
  onClick?: () => void;
}) => (
  <Card
    role={onClick ? 'button' : undefined}
    onClick={onClick}
    className={cn(
      'flex items-center gap-4 p-5',
      highlight && 'border-terracotta-500/50 bg-terracotta-50',
      onClick && 'cursor-pointer transition hover:shadow-lift'
    )}
  >
    <span className='flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary [&_svg]:h-5 [&_svg]:w-5'>
      {icon}
    </span>
    <div>
      <p className='font-display text-2xl font-black tabular-nums'>
        {value ?? '-'}
      </p>
      <p className='text-sm text-muted-foreground'>{label}</p>
    </div>
  </Card>
);

const Overview = ({ s, go }: { s?: AdminStats; go: (tab: string) => void }) => {
  const { t } = useTranslation();
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <Stat
        icon={<Flag />}
        label={t('admin.statReports')}
        value={s?.openReports}
        highlight={!!s?.openReports}
        onClick={() => go('reports')}
      />
      <Stat
        icon={<Shield />}
        label={t('admin.statPending')}
        value={s?.pendingShelters}
        highlight={!!s?.pendingShelters}
        onClick={() => go('shelters')}
      />
      <Stat
        icon={<Users />}
        label={t('admin.statUsers')}
        value={s?.users}
        onClick={() => go('users')}
      />
      <Stat
        icon={<LayoutGrid />}
        label={t('admin.statListings')}
        value={s?.listings}
        onClick={() => go('pets')}
      />
      <Stat icon={<Home />} label={t('admin.statAdopted')} value={s?.adopted} />
      <Stat
        icon={<BadgeCheck />}
        label={t('admin.statShelters')}
        value={s?.verifiedShelters}
      />
      <Stat
        icon={<Ban />}
        label={t('admin.statBanned')}
        value={s?.bannedUsers}
      />
      <Stat
        icon={<EyeOff />}
        label={t('admin.statHidden')}
        value={s?.hiddenListings}
      />
    </div>
  );
};

export const Admin = () => {
  const { t } = useTranslation();
  const { user } = useGlobalContext();
  const a = useAdminPage();
  const count = (n?: number) =>
    n ? (
      <Badge variant='urgent' className='ml-1'>
        {n}
      </Badge>
    ) : null;

  return (
    <div className='container py-8 sm:py-10'>
      <PageHeader title={t('admin.title')} description={t('admin.subtitle')} />
      <Tabs value={a.tab} onValueChange={a.setTab}>
        <TabsList className='w-full justify-start sm:w-auto'>
          <TabsTrigger value='overview'>
            <LayoutGrid /> {t('admin.tabOverview')}
          </TabsTrigger>
          <TabsTrigger value='reports'>
            <Flag /> {t('admin.tabReports')} {count(a.stats?.openReports)}
          </TabsTrigger>
          <TabsTrigger value='pets'>
            <PawPrint /> {t('admin.tabPets')}
          </TabsTrigger>
          <TabsTrigger value='users'>
            <Users /> {t('admin.tabUsers')}
          </TabsTrigger>
          <TabsTrigger value='shelters'>
            <BadgeCheck /> {t('admin.tabShelters')}{' '}
            {count(a.stats?.pendingShelters)}
          </TabsTrigger>
          <TabsTrigger value='messages'>
            <Megaphone /> {t('admin.tabMessages')}
          </TabsTrigger>
          <TabsTrigger value='activity'>
            <History /> {t('admin.tabActivity')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value='overview'>
          <Overview s={a.stats} go={a.setTab} />
        </TabsContent>
        <TabsContent value='reports'>
          <ReportsTab onOpenUser={a.openUser} onOpenListing={a.openListing} />
        </TabsContent>
        <TabsContent value='pets'>
          <PetsTab onOpenListing={a.openListing} />
        </TabsContent>
        <TabsContent value='users'>
          <UsersTab onOpenUser={a.openUser} />
        </TabsContent>
        <TabsContent value='shelters'>
          <SheltersTab onOpenUser={a.openUser} />
        </TabsContent>
        <TabsContent value='messages'>
          <MessagesTab />
        </TabsContent>
        <TabsContent value='activity'>
          <ActivityTab onOpenUser={a.openUser} onOpenListing={a.openListing} />
        </TabsContent>
      </Tabs>

      <UserSheet
        userId={a.openUserId}
        selfId={user?.id}
        onClose={() => a.openUser(null)}
        onOpenListing={(id) => a.switchPanel('pet', id)}
      />
      <ListingSheet
        listingId={a.openListingId}
        onClose={() => a.openListing(null)}
        onOpenUser={(id) => a.switchPanel('user', id)}
      />
    </div>
  );
};
