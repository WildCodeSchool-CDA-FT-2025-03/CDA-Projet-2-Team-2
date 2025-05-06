import { useState, useEffect } from 'react';

const useResponsiveAgendaPageSize = () => {
  const [pageSize, setPageSize] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 530) setPageSize(1);
      else if (width < 650) setPageSize(2);
      else if (width < 1200) setPageSize(3);
      else setPageSize(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return pageSize;
};

export default useResponsiveAgendaPageSize;
