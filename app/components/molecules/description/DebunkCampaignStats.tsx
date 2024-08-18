import { Community, Evidence, FactCheckers, Sponsorships, ValidCredential } from '@/app/components/atoms/Icon'
import { useCreateCampaignContext } from '@/app/providers/CreateCampaignProvider'
import { useTbdexContext } from '@/app/providers/TbdexProvider'
import { Badge, Card, Flex, Tag, Typography, Tooltip, Avatar, theme } from 'antd'
import Image from 'next/image'

const DebunkCampaignStats = () => {
    const {
        campaignType,
        campaignAmount,
        requiredCredentials,
        campaignMinEvidences,
        campaignNumOfFactCheckers,
    } = useCreateCampaignContext()
    const { selectedCurrency } = useTbdexContext()
    const { token: { colorPrimary } } = theme.useToken()

    const isSponsored = campaignType === 'Sponsored'
    return (
        <Card className="min-h-80 flex-col w-full">
            {
                isSponsored && (
                    <Flex className="flex-col">
                        <Typography.Title level={5} style={{ fontWeight: "bold" }}>Campaign Amount</Typography.Title>
                        <Flex className="-mt-2 gap-1 items-center">
                            <Flex className="justify-center">
                                <Tag className="mt-2" color="gold">{`${selectedCurrency} ${campaignAmount}`}</Tag>
                            </Flex>
                        </Flex>
                    </Flex>
                )
            }
            <Flex className="flex-col mt-5">
                <Typography.Title level={5} style={{ fontWeight: "bold" }}>Campaign Status</Typography.Title>
                <Flex>
                    <Tag className="-mt-1">
                        <Badge status="default" text="Pending" />
                    </Tag>
                </Flex>
            </Flex>
            <Flex className="flex-col mt-5">
                <Typography.Title level={5} style={{ fontWeight: "bold" }}>Campaign Type</Typography.Title>
                <Flex className="items-center gap-1">
                    <Tooltip title="Type of Campaign" placement="top">
                        <Avatar shape='square' style={{ backgroundColor: colorPrimary }} icon={<Image src={isSponsored ? Sponsorships : Community} alt="factChecker" width={50} height={50} />} />
                    </Tooltip>
                    <Typography.Text className="ml-1">{isSponsored ? 'Sponsored' : 'Community'}</Typography.Text>
                </Flex>
            </Flex>
            <Flex className="flex-col mt-5">
                <Typography.Title level={5} style={{ fontWeight: "bold" }}>Fact Checkers</Typography.Title>
                <Flex className="items-center gap-1">
                    <Tooltip title="Number of Fact Checkers" placement="top">
                        <Avatar shape='square' style={{ backgroundColor: colorPrimary }} icon={<Image src={FactCheckers} alt="factChecker" width={50} height={50} />} />
                    </Tooltip>
                    <Typography.Text className="ml-1">{`${campaignNumOfFactCheckers} Fact Checkers`}</Typography.Text>
                </Flex>
            </Flex>
            <Flex className="flex-col mt-5">
                <Typography.Title level={5} style={{ fontWeight: "bold" }}>Required Credentials</Typography.Title>
                <Flex className="items-center gap-1">
                    <Tooltip title="Number of Required Credentials" placement="top">
                        <Avatar shape='square' style={{ backgroundColor: colorPrimary }} icon={<Image src={ValidCredential} alt="credentials" width={50} height={50} />} />
                    </Tooltip>
                    <Typography.Text className="ml-1">{`${requiredCredentials?.length} Required Credentials`}</Typography.Text>
                </Flex>
            </Flex>
            <Flex className="flex-col mt-5">
                <Typography.Title level={5} style={{ fontWeight: "bold" }}>Required Evidence Count</Typography.Title>
                <Flex className="items-center gap-1">
                    <Tooltip title="Number of Required Evidence" placement="top">
                        <Avatar shape='square' style={{ backgroundColor: colorPrimary }} icon={<Image src={Evidence} alt="credentials" width={50} height={50} />} />
                    </Tooltip>
                    <Typography.Text className="ml-1">{`${campaignMinEvidences} Evidences`}</Typography.Text>
                </Flex>
            </Flex>
        </Card>
    )
}

export default DebunkCampaignStats;

