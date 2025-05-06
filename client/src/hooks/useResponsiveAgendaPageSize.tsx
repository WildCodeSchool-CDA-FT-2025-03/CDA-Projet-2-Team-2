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

    // 📞 Called a first time on loading
    handleResize();

    // 🆙 Update if user resizes
    window.addEventListener('resize', handleResize);

    // 🧹 Anonymous function for cleaning during disassembly
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return pageSize;
};

export default useResponsiveAgendaPageSize;
