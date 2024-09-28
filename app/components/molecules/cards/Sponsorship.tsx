import { Community, Evidence, Facebook, FactCheckers, False, Instagram, Sponsor, Sponsorships, TikTok, True, X, Youtube } from '@/app/components/atoms/Icon';
import { DEBUNK_CAMPAIGN_TYPE, DEBUNK_SOURCE, PFIs } from '@/app/lib/constants';
import { getCurrencyFlag } from "@/app/lib/utils";
import { PRIMARY_GOLD_HEX } from "@/app/providers/ThemeProvider";
import countries from '@/public/countries.json';
import { RightCircleFilled } from "@ant-design/icons";
import { Avatar, Button, Flex, List, Rate, Space, Tag, Typography } from 'antd';
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
    } = sponsorship
    const iconProps = {
        width: 50,
        height: 50
    }
    const country = 'NL'
    const countryDetails = countries.filter(entry => entry.countryCode === country)[0]
    const countryFlag = countryDetails.flag
    const numOfFactCheckers = factCheckers.length

    const isCommunity = type === 'Community'
    const isSponsored = type === 'Sponsored'

    const isX = source === 'X'
    const isTikTok = source === 'TikTok'
    const isYoutube = source === 'Youtube'
    const isFacebook = source === 'Facebook'
    const isInstagram = source === 'Instagram'

    const pfiDetails = PFIs[0]

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
                </Flex>,
                <Flex className="items-center">
                    <Image className="opacity-0" alt="Community" src={Sponsorships} width={25} height={25} />
                    <Button className="-ml-6" size='small' type='primary'>View Details</Button>
                </Flex>,
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

            <Flex className='items-center mt-2 gap-4'>
                <Flex className="w-full">
                    <Space.Compact className="w-full" >
                        <Button className="h-[70px] w-full" disabled>
                            <Flex className="flex flex-col justify-center items-center">
                                <Flex className="text-white" >
                                    {'USD'}
                                    {' '}
                                    {getCurrencyFlag('USD')}
                                </Flex>
                                <Flex className="-mt-1 text-xs text-white" > {`${parseFloat('1646').toFixed(2)}`}</Flex>
                            </Flex>
                        </Button>
                        <Button className="h-[70px] w-[80px]" >
                            <RightCircleFilled style={{ color: PRIMARY_GOLD_HEX }} />
                        </Button>
                        <Button className="h-[70px] w-full" disabled >
                            <Flex className="flex flex-col justify-center items-center">
                                <Flex className="text-white" >
                                    {'KES'}
                                    {' '}
                                    {getCurrencyFlag('KES')}
                                </Flex>
                                <Flex className="-mt-1 text-xs text-white" > {`${parseFloat('73737883').toFixed(2)}`} </Flex>
                            </Flex>
                        </Button>
                    </Space.Compact>
                </Flex>
                <Flex className="justify-between w-full">
                    <Tag className="w-full p-4 mr-0">
                        <Flex className="items-center justify-between w-full">
                            <Flex className="gap-3">
                                <Avatar shape="square" style={{ backgroundColor: '#f56a00', width: 40, height: 40 }}>{pfiDetails?.name?.charAt(0)?.toUpperCase()}</Avatar>
                                <Flex className="flex-col">
                                    <Typography.Text style={{ marginTop: -4 }}>
                                        {pfiDetails?.name}
                                    </Typography.Text>
                                    <Typography.Text style={{ fontSize: 12 }} copyable>
                                        {`${pfiDetails?.did?.slice(0, 14)}...${pfiDetails?.did?.slice(-8)}`}
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                            <Flex className="flex-col gap-2">
                                <Tag className="items-center mr-0">
                                    <Rate style={{ fontSize: 11, color: '#CC9933' }} disabled allowHalf defaultValue={5} />
                                </Tag>
                            </Flex>
                        </Flex>
                    </Tag>
                </Flex>
            </Flex>
        </List.Item>
    )
}

export default SponsorshipCard;

