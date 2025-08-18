import React from 'react';
import SecurityOverview from '../components/Dashboard/SecurityOverview';
import ThreatRadar from '../components/Dashboard/ThreatRadar';
import ChainHealth from '../components/Dashboard/ChainHealth';
import RecentThreats from '../components/Dashboard/RecentThreats';
import ActionCenter from '../components/Dashboard/ActionCenter';
import PortfolioOverview from '../components/Dashboard/PortfolioOverview';
import MarketTrends from '../components/Dashboard/MarketTrends';
import SystemStatus from '../components/Dashboard/SystemStatus';
import { Threat } from '../types';

interface DashboardProps {
  overview: any;
  recentThreats: Threat[];
}

const Dashboard: React.FC<DashboardProps> = ({ overview, recentThreats }) => {
  return (
    <div className="space-y-6">
      {/* Top Row - Security & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SecurityOverview data={overview} />
        </div>
        <div className="space-y-6">
          <SystemStatus />
          <ChainHealth chains={overview?.chains || []} />
        </div>
      </div>
      
      {/* Second Row - Portfolio & Market Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioOverview />
        <MarketTrends />
      </div>
      
      {/* Third Row - Threat Radar & Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ThreatRadar threats={recentThreats} />
        </div>
        <div>
          <ActionCenter />
        </div>
      </div>
      
      {/* Bottom Row - Recent Threats */}
      <div>
        <RecentThreats threats={recentThreats} />
      </div>
    </div>
  );
};

export default Dashboard; 