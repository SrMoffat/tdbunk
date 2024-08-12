import { Community, Evidence, Facebook, FactCheckers, False, Instagram, Sponsor, Sponsorships, TikTok, True, X, Youtube } from '@/app/components/atoms/Icon';
import { DEBUNK_CAMPAIGN_TYPE, DEBUNK_SOURCE } from '@/app/lib/constants';
import { Flex, List, Tag, Typography } from 'antd';
import Image from 'next/image';
import React from 'react';

export interface DebunkProps {
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

export interface DebunkCardProps {
    debunk: DebunkProps

}

const DebunkCard: React.FC<DebunkCardProps> = ({
    debunk
}) => {
    const {
        href,
        type,
        title,
        amount,
        source,
        content,
        currency,
        isFactual,
        description,
        factCheckers,
    } = debunk

    const isCommunity = type === 'Community'
    const isSponsored = type === 'Sponsored'

    const isX = source === 'X'
    const isTikTok = source === 'TikTok'
    const isYoutube = source === 'Youtube'
    const isFacebook = source === 'Facebook'
    const isInstagram = source === 'Instagram'

    const iconProps = {
        width: 50,
        height: 50
    }
    return (
        <List.Item
            key={title}
            actions={[
                <Flex className="items-center">
                    <Image alt="Investigators" src={FactCheckers} width={25} height={25} />
                    <Typography.Text style={{ fontSize: 12 }}>{`${factCheckers.length + 4} Investigators`}</Typography.Text>
                </Flex>,
                <Flex className="items-center">
                    <Image alt="Evidences" src={Evidence} width={25} height={25} />
                    <Typography.Text style={{ fontSize: 12 }}>{`${factCheckers.length + 4} Evidences`}</Typography.Text>
                </Flex>,
                <Flex className="items-center">
                    {isCommunity && <>
                        <Image alt="Community" src={Community} width={25} height={25} />
                        <Typography.Text style={{ fontSize: 12 }}>{`${factCheckers.length + 3} Tips`}</Typography.Text>
                    </>}
                    {isSponsored && <>
                        <Image alt="Sponsorhips" src={Sponsor} width={25} height={25} />
                        <Typography.Text style={{ fontSize: 12 }}>{`${factCheckers.length + 3} Sponsors`}</Typography.Text>
                    </>}
                </Flex>,
                <Flex className="items-center">
                    {isCommunity && <>
                        <Image alt="Community" src={Sponsorships} width={25} height={25} />
                        <Tag className="ml-2" color="green">{`USD 50`}</Tag>
                    </>}
                    {isSponsored && <>
                        <Image alt="Sponsorhips" src={Sponsorships} width={25} height={25} />
                        <Tag className="ml-2" color="green">{`${currency} ${amount}`}</Tag>
                    </>}
                </Flex>
            ]}
            extra={
                <Flex className="h-full items-center justify-center">
                    {isFactual && <Image alt="Fact Checkers" src={True} width={90} height={90} />}
                    {!isFactual && <Image alt="Fact Checkers" src={False} width={90} height={90} />}
                </Flex>
            }
        >
            <List.Item.Meta
                avatar={<Flex>
                    {isX && <Image alt={source} src={X} {...iconProps} />}
                    {isTikTok && <Image alt={source} src={TikTok} {...iconProps} />}
                    {isYoutube && <Image alt={source} src={Youtube} {...iconProps} />}
                    {isFacebook && <Image alt={source} src={Facebook} {...iconProps} />}
                    {isInstagram && <Image alt={source} src={Instagram} {...iconProps} />}
                </Flex>}
                title={<a href={href}>{title}</a>}
                description={description}
            />
            {content}
        </List.Item>
    )
}

export default DebunkCard

