import React, { useState, useEffect } from 'react';

const Dot = ({ delay }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, delay);

    return () => clearInterval(intervalId);
  }, [delay]);

  return (
    <span
      className={`h-3 w-3 bg-blue-500 rounded-full mr-1 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    ></span>
  );
};

export default Dot;
