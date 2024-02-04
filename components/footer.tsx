import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white p-2 fixed bottom-0 left-0 w-full">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between">
          <div className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Bytegram
          </div>
          <div className="space-x-4 text-sm text-gray-600">
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
