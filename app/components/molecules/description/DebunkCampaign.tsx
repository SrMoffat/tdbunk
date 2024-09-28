import { useCreateCampaignContext } from '@/app/providers/CreateCampaignProvider';
import { Card, Descriptions, DescriptionsProps } from "antd";

export enum DebunkCampaignSteps {
    NAME = 'Name',
    DESCRIPTION = 'Description',
}

const DebunkingCampaign = () => {
    const {
        campaignName,
        campaignDescription,
    } = useCreateCampaignContext()

    const items2: DescriptionsProps['items'] = [
        {
            key: '1',
            label: DebunkCampaignSteps.NAME,
            children: campaignName,
            span: 3,
        },
        {
            key: '2',
            label: DebunkCampaignSteps.DESCRIPTION,
            children: campaignDescription,
            span: 3,
        },
    ];
    return (
        <Card>
            <Descriptions className="" title="Debunking Campaign" bordered items={items2} />
        </Card>
    );
};

export default DebunkingCampaign;
