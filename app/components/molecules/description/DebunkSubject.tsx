import { sourcesList } from '@/app/components/molecules/forms/DebunkSubject';
import { useCreateCampaignContext } from '@/app/providers/CreateCampaignProvider';
import { Card, Descriptions, DescriptionsProps, Flex, Typography } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

export enum DebunkSteps {
    TITLE = 'Debunk Title',
    LINK = 'Debunk Link',
    SOURCE = 'Debunk Source',
}

const DebunkingSubject = () => {
    const { debunkTitle, debunkLink, debunkSource } = useCreateCampaignContext()

    const selected = sourcesList.filter(({ name }) => name === debunkSource)[0]

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: DebunkSteps.TITLE,
            children: <Link href={`${debunkLink}`}><Typography.Text>{debunkTitle}</Typography.Text></Link>,
            span: 3,
        },
        {
            key: '3',
            label: DebunkSteps.LINK,
            children: <Typography.Text copyable>{debunkLink}</Typography.Text>,
            span: 3,

        },
        {
            key: '2',
            label: DebunkSteps.SOURCE,
            children: (<Flex className="items-center">
                <Typography.Text>{selected?.name}</Typography.Text>
                <Image alt={selected?.name} width={25} height={25} src={selected?.icon} />
            </Flex>),
            span: 3,

        },
    ];
    return (
        <Card>
            <Descriptions title="Debunking Subject" bordered items={items} />
        </Card>
    );
};

export default DebunkingSubject;


