import React from 'react';
import { Users } from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';

const Members = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Members</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage society residents and pending approvals.</p>
      </div>
      <EmptyState 
        icon={Users} 
        title="Members Page Coming Soon" 
        description="This module is currently under development. Soon you will be able to manage all society residents from here." 
      />
    </div>
  );
};

export default Members;
