import React from 'react';
import { IndianRupee } from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';

const ManageFees = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Fees Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track maintenance collections and pending dues.</p>
      </div>
      <EmptyState 
        icon={IndianRupee} 
        title="Fees Page Coming Soon" 
        description="This module is currently under development. Soon you will be able to track maintenance fees and finances from here." 
      />
    </div>
  );
};

export default ManageFees;
