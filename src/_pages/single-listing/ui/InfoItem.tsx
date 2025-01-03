export const InfoItem = ({
  value,
  label,
}: {
  value: React.ReactNode;
  label: string;
}) => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <p
        className='
                    text-lg
                    font-bold
                    text-primary
                  '
      >
        {value}
      </p>
      <p
        className='
                    text-sm
                   text-gray-800
                    uppercase
                    mt-2
                  '
      >
        {label}
      </p>
    </div>
  );
};
