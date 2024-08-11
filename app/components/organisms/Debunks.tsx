import { DEBUNK_SOURCE, DEBUNK_CAMPAIGN_TYPE } from '@/app/constants';
import { Flex, List } from 'antd';
import React from 'react'
import DebunkCard from '@/app/components/molecules/cards/Debunk';

export interface DebunkProps {
    href: string;
    title: string;
    avatar: string;
    amount: number;
    tippers: any[];
    sponsors: any[];
    content: string;
    evidences: any[];
    currency: string;
    factCheckers: any[];
    description: string;
    isFactual: boolean;
    source: DEBUNK_SOURCE;
    type: DEBUNK_CAMPAIGN_TYPE;
}

export interface DebunksContainerProps {
    debunks: DebunkProps[]
}

const Debunks: React.FC<DebunksContainerProps> = ({
    debunks
}) => {
    const pagination = {
        onChange: (page: any) => {
            console.log(page);
        },
        pageSize: 3,
    }
    return (
        <Flex className="w-svw justify-center">
            <List className='w-[70%]' size="small"
                bordered
                itemLayout="vertical"
                pagination={pagination}
                dataSource={debunks}
                renderItem={(item) => <DebunkCard debunk={item} />}
            />
        </Flex>

    )
}

export default Debunks

