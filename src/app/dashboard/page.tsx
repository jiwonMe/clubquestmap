import React, { Suspense } from 'react';
import DashboardContent from './DashboardContent';

function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

export default DashboardPage;
