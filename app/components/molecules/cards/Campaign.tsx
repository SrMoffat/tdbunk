import { Clock, Community, Facebook, FactCheckers, Instagram, Sponsorships, TikTok, X, Youtube } from '@/app/components/atoms/Icon';
import { DEBUNK_SOURCE } from '@/app/constants';
import { Button, Card, Col, Flex, Tag, Tooltip, Typography } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import React from 'react';

const date = new Date(2023, 5, 15);
const formattedDistance = formatDistanceToNow(date, { addSuffix: true });

export interface CampaignProps {
    id: string;
    type: string;
    title: string;
    sponsors: any[];
    amount: number;
    currency: string;
    evidences: any[];
    thumbnail: string;
    factCheckers: any[];
    source: DEBUNK_SOURCE;
}

export interface CampaignCardProps {
    campaign: CampaignProps;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
    const {
        id,
        type,
        title,
        amount,
        source,
        sponsors,
        currency,
        factCheckers,
    } = campaign

    const cardStyle: React.CSSProperties = {
        width: 450,
        // height: 200
    };



    const isCommunity = type === 'Community'
    const isSponsored = type === 'Sponsored'

    const numOfFactCheckers = factCheckers.length
    const numOfSponsors = sponsors.length

    interface SourceIconProps {
        source: DEBUNK_SOURCE
    }

    const SourceIcon: React.FC<SourceIconProps> = ({ source }) => {
        let src = X

        const isX = source === DEBUNK_SOURCE.X
        const isTikTok = source === DEBUNK_SOURCE.TIKTOK
        const isYoutube = source === DEBUNK_SOURCE.YOUTUBE
        const isFacebook = source === DEBUNK_SOURCE.FACEBOOK
        const isInstagram = source === DEBUNK_SOURCE.INSTAGRAM

        const commonProps = {
            width: 30,
            height: 30,
            alt: source,
            className: '-mt-2 -ml-1'
        }

        switch (true) {
            case isX: {
                src = X
                break
            }
            case isTikTok: {
                src = TikTok
                break
            }
            case isYoutube: {
                src = Youtube
                break
            }
            case isFacebook: {
                src = Facebook
                break
            }
            case isInstagram: {
                src = Instagram
                break
            }
        }

        return <Image src={src} {...commonProps} />
    }

    return (
        <Col span={8} key={id}>
            <Card hoverable style={cardStyle} styles={{ body: { padding: 0, overflow: 'hidden' } }}>
                <Flex justify="start">
                    <img alt="avatar" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                        className="w-[140px]" />
                    <Flex vertical className="px-4 py-2 w-full">
                        <Tooltip title={title}>
                            <Flex>
                                <SourceIcon source={source} />
                                <Typography.Title level={5} ellipsis>{title.slice(0, 29)}...</Typography.Title>
                            </Flex>
                        </Tooltip>
                        <Flex className='flex items-center'>
                            <Flex className="items-center gap-1">
                                {isCommunity && <Image alt="Community" src={Community} width={25} height={25} />}
                                {isSponsored && <Image alt="Community" src={Sponsorships} width={25} height={25} />}
                                <Tag color="gold">{
                                    isSponsored
                                        ? `${currency} ${amount}`
                                        : 'Community'
                                }</Tag>
                                {isSponsored && <Tag color="gold">{`${numOfSponsors + 3} sponsors`}</Tag>}
                            </Flex>
                        </Flex>
                        <Flex className="items-center">
                            <Image alt="Fact Checkers" src={FactCheckers} width={25} height={25} />
                            <Typography.Text style={{ fontSize: 12 }}>{`${numOfFactCheckers + 3} Fact Checkers`}</Typography.Text>
                        </Flex>
                        <Flex className="items-center">
                            <Image alt="Fact Checkers" src={Clock} width={25} height={25} />
                            <Typography.Text style={{ fontSize: 11 }}>Started {`${formattedDistance}`}</Typography.Text>
                        </Flex>
                        <Flex className="justify-end">
                            <Button size="small" type="primary" style={{ fontSize: 12 }}>View Campaign</Button>
                        </Flex>
                    </Flex>
                </Flex>
            </Card>
        </Col>

    );
};

export default CampaignCard;
