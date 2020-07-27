import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const CommunitiesIndex = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/').catch(() => null);
  }, []);

  return <div />;
};

export default CommunitiesIndex;
