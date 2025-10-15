export const Footer = () => {
  return (
    <footer className='bg-gray-800 text-white py-4 text-center bottom-0'>
      <div className='container mx-auto'>
        <p className='text-sm'>
          &copy; {new Date().getFullYear()} Udomi Me. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
