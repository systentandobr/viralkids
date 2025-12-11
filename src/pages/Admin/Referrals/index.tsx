import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReferralDashboard } from './ReferralDashboard';
import { ReferralCampaignsManagement } from './ReferralCampaignsManagement';
import { ReferralsManagement } from './ReferralsManagement';
import { RewardsManagement } from './RewardsManagement';
import { ReferralAnalyticsDashboard } from './ReferralAnalyticsDashboard';
import { ReferralAutomations } from './ReferralAutomations';

export const ReferralsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="referrals">Indicações</TabsTrigger>
          <TabsTrigger value="rewards">Recompensas</TabsTrigger>
          <TabsTrigger value="automations">Automações</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ReferralDashboard />
        </TabsContent>

        <TabsContent value="analytics">
          <ReferralAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="campaigns">
          <ReferralCampaignsManagement />
        </TabsContent>

        <TabsContent value="referrals">
          <ReferralsManagement />
        </TabsContent>

        <TabsContent value="rewards">
          <RewardsManagement />
        </TabsContent>

        <TabsContent value="automations">
          <ReferralAutomations />
        </TabsContent>
      </Tabs>
    </div>
  );
};
