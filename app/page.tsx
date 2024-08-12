"use client"
import { Footer } from '@/app/components/atoms';
import LandingPageCarousel from '@/app/components/molecules/carousels/LandingPage';
import LandingHeader from '@/app/components/molecules/headers/LandingHeader';
import LandingPageTabs from '@/app/components/molecules/tabs/LandingPageTabs';
import Campaigns from '@/app/components/organisms/Campaigns';
import Debunks from '@/app/components/organisms/Debunks';
import Sponsorships from '@/app/components/organisms/Sponsorships';
import { LANDING_PAGE_TABS } from '@/app/lib/constants';
import { campaigns, debunks, sponsorships } from '@/app/lib/mocks';
import { isCampaign, isDebunks, isSponsorships } from '@/app/lib/utils';
import { Flex, Layout, Row } from 'antd';
import React, { useState } from 'react';

const LandingPageContent: React.FC<any> = () => {
  const [selectedTab, setSelectedTab] = useState<LANDING_PAGE_TABS>(LANDING_PAGE_TABS.CAMPAIGNS);
  return (
    <Flex className="items-center p-5 flex flex-col">
      <LandingPageTabs setSelectedTab={setSelectedTab} />
      <Row gutter={[0, 16]} className="mt-4 min-h-80">
        {isCampaign(selectedTab) && <Campaigns campaigns={campaigns} />}
        {isDebunks(selectedTab) && <Debunks debunks={debunks} />}
        {isSponsorships(selectedTab) && <Sponsorships sponsorships={sponsorships} />}
      </Row>
    </Flex>
  )
}

export default function Home() {
  return (
    <Layout style={{ height: '100vh' }}>
      <LandingHeader />
      <LandingPageCarousel />
      <LandingPageContent />
      <Footer />
    </Layout>
  );
}
