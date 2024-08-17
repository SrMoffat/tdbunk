import { useCreateCampaignContext } from '@/app/providers/CreateCampaignProvider';
import { Card, Descriptions, DescriptionsProps } from "antd";

const DebunkingCampaign = () => {
    const {
        campaignName,
        campaignAmount,
        requiredCredentials,
        campaignDescription,
        campaignMinEvidences,
        campaignNumOfFactCheckers
    } = useCreateCampaignContext()

    const items2: DescriptionsProps['items'] = [
        {
            key: '8',
            label: 'Name',
            children: campaignName,
            span: 3,
        },
        {
            key: '9',
            label: 'Description',
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
