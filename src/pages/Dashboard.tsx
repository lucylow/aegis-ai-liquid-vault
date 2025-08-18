import React from 'react';
import SecurityOverview from '../components/Dashboard/SecurityOverview';
import ThreatRadar from '../components/Dashboard/ThreatRadar';
import ChainHealth from '../components/Dashboard/ChainHealth';
import RecentThreats from '../components/Dashboard/RecentThreats';
import ActionCenter from '../components/Dashboard/ActionCenter';
import { Threat } from '../types';

interface DashboardProps {
  overview: any;
  recentThreats: Threat[];
}

const Dashboard: React.FC<DashboardProps> = ({ overview, recentThreats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SecurityOverview data={overview} />
        </div>
        <div>
          <ChainHealth chains={overview?.chains || []} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ThreatRadar threats={recentThreats} />
        </div>
        <div>
          <ActionCenter />
        </div>
      </div>
      
      <div>
        <RecentThreats threats={recentThreats} />
      </div>
    </div>
  );
};

export default Dashboard; 