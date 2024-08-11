import { TabItem } from '@/app/components/atoms';
import { Campaigns, Debunks, Sponsorships } from '@/app/components/atoms/Icon';
import { LANDING_PAGE_TABS } from '@/app/constants';
import { Segmented } from 'antd';
import React from 'react';

export interface TabDetails {
    value: string;
    label: string;
};

export interface LandingPageTabsProps {
    setSelectedTab: React.Dispatch<React.SetStateAction<LANDING_PAGE_TABS>>;
};

const LandingPageTabs: React.FC<LandingPageTabsProps> = ({ setSelectedTab }) => {
    const tabs = [
        {
            name: "Campaigns",
            icon: Campaigns
        },
        {
            name: "Debunks",
            icon: Debunks
        },
        {
            name: "Sponsorships",
            icon: Sponsorships
        }
    ].map(({ name, icon }) => (
        {
            value: name,
            label: (<TabItem name={name} icon={icon} />)
        }
    ))
  return (
      <Segmented
          defaultValue="Campaigns"
          onChange={(value) => setSelectedTab(value as LANDING_PAGE_TABS)}
          options={tabs}
          style={{ backgroundColor: "#334155" }}
      />
  );
};

export default LandingPageTabs;

