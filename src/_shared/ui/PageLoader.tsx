import { Spinner as SpinnerComponent } from '@nextui-org/react';

export const PageLoader = () => (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#c8dce8] via-[#b9cdda] to-[#c5d9e4]'>
    <SpinnerComponent size='lg' color='primary' />
  </div>
);
