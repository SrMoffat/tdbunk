import { FactCheckers, X } from '@/app/components/atoms/Icon';
import { DEBUNK_CAMPAIGN_TYPE, DEBUNK_SOURCE } from '@/app/lib/constants';
import countries from '@/public/countries.json';
import { Flex, List, Rate, Typography } from 'antd';
import Image from 'next/image';
import React from 'react';

export interface SponsorshipProps {
    href: string;
    title: string;
    tippers: any[];
    avatar: string;
    amount: number;
    content: string;
    sponsors: any[];
    evidences: any[];
    currency: string;
    isFactual: boolean;
    description: string;
    factCheckers: any[];
    source: DEBUNK_SOURCE;
    type: DEBUNK_CAMPAIGN_TYPE;
}

export interface SponsorshipCardProps {
    sponsorship: SponsorshipProps;
}

const SponsorshipCard: React.FC<SponsorshipCardProps> = ({
    sponsorship
}) => {
    const {
        title,
        source,
        factCheckers,
    } = sponsorship
    const iconProps = {
        width: 50,
        height: 50
    }
    const country = 'NL'
    const countryDetails = countries.filter(entry => entry.countryCode === country)[0]
    const countryFlag = countryDetails.flag
    const numOfFactCheckers = factCheckers.length

    return (
        <List.Item
            key={title}
        >
            <Flex className="flex-col">
                <Typography.Text style={{ fontSize: 12 }}>{`A good title from Facebook fake post`}</Typography.Text>

                <Image alt={source} src={X} {...iconProps} />
                <Flex className="border justify-between w-[200px]">
                    <Flex className="border">
                        <Typography.Text style={{ fontSize: 12 }}>{' Sender Name'}</Typography.Text>
                        <Typography.Text style={{ fontSize: 12 }}>{countryFlag}</Typography.Text>
                    </Flex>
                    <Flex>
                        {'>'}
                    </Flex>
                    <Flex className="border">
                        <Typography.Text style={{ fontSize: 12 }}>{' Receiver Name'}</Typography.Text>
                        <Typography.Text style={{ fontSize: 12 }}>{countryFlag}</Typography.Text>
                    </Flex>
                </Flex>
                <Flex className="border">
                    <Typography.Text style={{ fontSize: 12 }}>{'PFI Name'}</Typography.Text>
                    <Rate disabled allowHalf defaultValue={2.5} style={{ color: '#CC9933' }} />
                </Flex>
                <Flex className="items-center">
                    <Image alt="Fact Checkers" src={FactCheckers} width={25} height={25} />
                    <Typography.Text style={{ fontSize: 12 }}>{`${numOfFactCheckers + 4} Fact Checkers`}</Typography.Text>
                </Flex>
                Number of Investigators
                Amount Contributed - Percentage of Total
            </Flex>
        </List.Item>
    )
}

export default SponsorshipCard;

