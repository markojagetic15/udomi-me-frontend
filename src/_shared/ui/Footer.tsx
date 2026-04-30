import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className='bg-white/60 border-t border-gray-100 py-10'>
      <div className='max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6'>
        <div className='text-center md:text-left'>
          <p className='font-bold text-primary text-lg'>UDOMI ME</p>
          <p className='text-sm text-gray-400 mt-1'>
            &copy; {new Date().getFullYear()} Udomi Me. All rights reserved.
          </p>
        </div>

        <div className='flex gap-6 text-sm text-gray-500'>
          <Link to='/browse' className='hover:text-primary transition-colors'>
            Browse Animals
          </Link>
          <Link to='/create-listing' className='hover:text-primary transition-colors'>
            List an Animal
          </Link>
          <Link to='/login' className='hover:text-primary transition-colors'>
            Login
          </Link>
          <Link to='/register' className='hover:text-primary transition-colors'>
            Register
          </Link>
        </div>
      </div>
    </footer>
  );
};
