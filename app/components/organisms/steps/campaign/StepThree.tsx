import { FactCheckers, ValidCredential, Evidence, Sponsorships } from "@/app/components/atoms/Icon";
import { DescriptionsProps, Badge, Flex, Typography, Divider, theme, Layout, Descriptions } from "antd";
import Image from "next/image";

const StepThree = () => {

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Article Title',
            children: 'Article Title',
            span: 3,
        },
        {
            key: '2',
            label: 'Article Source',
            children: 'Article Source',
            span: 3,

        },
        {
            key: '3',
            label: 'Article Link',
            children: 'Article Link',
            span: 3,

        },
    ];
    const items2: DescriptionsProps['items'] = [
        {
            key: '6',
            label: 'Status',
            children: <Badge status="default" text="Pending" />,
            span: 3,
        },
        {
            key: '6',
            label: 'Type',
            children: (
                <Flex>
                    <Image src={Sponsorships} width={25} height={25} alt="sponsored" />
                    <Typography.Text>Sponsored</Typography.Text>
                </Flex>
            ),
            span: 3,
        },
        {
            key: '7',
            label: 'Sponsored Amount',
            children: '$80.00',
            span: 3,

        },
        {
            key: '8',
            label: 'Name',
            children: 'Name',
            span: 3,

        },
        {
            key: '9',
            label: 'Description',
            children: 'I would like to disprove the theory that the article proposes mentioning a lot of disinformation and misinformation stuff.',
            span: 3,

        },
        {
            key: '11',
            label: 'Fact Checkers',
            children: (
                <Flex className="items-center">
                    <Image src={FactCheckers} width={25} height={25} alt="sponsored" />
                    <Typography.Text>4 Fact Checkers</Typography.Text>
                    <Divider className="ml-4" type="vertical" />
                    <Image src={ValidCredential} width={25} height={25} alt="sponsored" />
                    <Typography.Text>3 Required Credentials</Typography.Text>
                </Flex>
            ),
            span: 3,

        },
        {
            key: '12',
            label: 'Minimum Evidence',
            children: (
                <Flex>
                    <Image src={Evidence} width={25} height={25} alt="sponsored" />
                    <Typography.Text>4 Evidences</Typography.Text>
                </Flex>
            ),
            span: 3,

        },
    ];
    const {
        token: { colorBgContainer },
    } = theme.useToken()
    return <Layout style={{ backgroundColor: colorBgContainer }}>
        <Flex className="flex-col self-center">
            <Descriptions title="Debunking Subject" bordered items={items} />
            <Descriptions className="mt-6" title="Debunking Campaign" bordered items={items2} />
        </Flex>
    </Layout>
}

export default StepThree;
