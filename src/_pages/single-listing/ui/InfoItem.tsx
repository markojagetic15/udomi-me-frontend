export const InfoItem = ({
  value,
  label,
}: {
  value: React.ReactNode;
  label: string;
}) => {
  return (
    <div className='flex flex-col items-center justify-center bg-white rounded-2xl px-6 py-4 shadow-sm min-w-[100px] gap-1'>
      <div className='text-lg font-bold text-primary font-mono'>{value}</div>
      <div className='text-[11px] text-gray-500 uppercase tracking-wider'>{label}</div>
    </div>
  );
};
