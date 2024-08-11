import { CampaignCard } from '@/app/components/molecules/cards';
import { CampaignProps } from '@/app/components/molecules/cards/Campaign';
import React from 'react';

export interface CampaignsContainerProps {
    campaigns: CampaignProps[]
}

const Campaigns: React.FC<CampaignsContainerProps> = ({
    campaigns
}) => {
    return campaigns?.map((campaign) => <CampaignCard campaign={campaign} />)
}

export default Campaigns;
