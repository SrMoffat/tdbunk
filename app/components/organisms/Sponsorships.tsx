import SponsorshipCard from '@/app/components/molecules/cards/Sponsorship';
import { DebunkProps } from '@/app/components/organisms/Debunks';
import { Flex, List } from 'antd';
import React from 'react';

export interface SponsorshipProps extends DebunkProps {}

export interface SponsorshipsContainerProps {
    sponsorships: SponsorshipProps[];
}

const Sponsorships: React.FC<SponsorshipsContainerProps> = ({
    sponsorships
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
                dataSource={sponsorships}
                renderItem={(item) => <SponsorshipCard sponsorship={item} />}
            />
        </Flex>
    );
};

export default Sponsorships;
