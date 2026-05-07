export const InfoItem = ({
  value,
  label,
}: {
  value: React.ReactNode;
  label: string;
}) => {
  return (
    <div className='flex flex-col items-center justify-center bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100/60 min-w-[90px] gap-1.5'>
      <div className='text-base font-bold text-primary font-mono tracking-wide'>{value}</div>
      <div className='text-[10px] text-gray-400 uppercase tracking-widest font-medium'>{label}</div>
    </div>
  );
};
