import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import AegisDashboard from '@/pages/AegisDashboard';

function App() {
  return (
    <>
      <AegisDashboard />
      <Toaster />
    </>
  );
}

export default App;