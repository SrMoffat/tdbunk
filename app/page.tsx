"use client"
import { Campaigns, Clock, Community, Debunks, Evidence, Facebook, FactCheckers, False, Instagram, Logo, LogoIcon, Sponsor, Sponsorships, TikTok, Tips, True, X, Youtube } from '@/app/components/atoms/Icon';
import LandingPageCarousel from '@/app/components/molecules/carousels/LandingPage';
import { Flex, Layout, Card, Typography, Segmented, Button, Row, Col, Tooltip, Transfer, Tag, List, Rate, theme, Avatar, Space } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns';
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';

import countries from '@/public/countries.json'

import type { TransferProps } from 'antd';


const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);


const date = new Date(2023, 5, 15);
const formattedDistance = formatDistanceToNow(date, { addSuffix: true });

console.log(formattedDistance);


const { Header } = Layout

type Align = 'Campaigns' | 'Debunks' | 'Sponsorships';
type Source = 'Facebook' | 'TikTok' | 'Instagram' | 'X' | 'Youtube';
type CampaignType = 'Community' | 'Sponsored';

const campaigns = [
  {
    id: '1',
    title: "An amazing title to a Facebook fake news post.",
    source: "Facebook",
    factCheckers: [],
    sponsors: [],
    type: "Community",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: "",
    status: 'open',
    isFactual: undefined,
    href: 'https://articlesource.com',
  },
  {
    id: '2',
    title: "An amazing title to a TikTok fake news post.",
    source: "TikTok",
    factCheckers: [],
    sponsors: [],
    type: "Sponsored",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: "",
    status: 'open',
    isFactual: undefined,
    href: 'https://articlesource.com',
  },
  {
    id: '3',
    title: "An amazing title to a Instagram fake news post.",
    source: "Instagram",
    factCheckers: [],
    sponsors: [],
    type: "Community",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: "",
    status: 'open',
    isFactual: undefined,
    href: 'https://articlesource.com',
  },
  {
    id: '4',
    title: "An amazing title to an X fake news post.",
    source: "X",
    factCheckers: [],
    sponsors: [],
    type: "Sponsored",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: "",
    status: 'open',
    isFactual: undefined,
    href: 'https://articlesource.com',
  },
  {
    id: '5',
    title: "An amazing title to a Youtube fake news post.",
    source: "Youtube",
    factCheckers: [],
    sponsors: [],
    type: "Community",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: "",
    status: 'open',
    isFactual: undefined,
    href: 'https://articlesource.com',
  },
  {
    id: '6',
    title: "campaigns This Story",
    source: "Facebook",
    factCheckers: [],
    sponsors: [],
    type: "Sponsored",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: "",
    status: 'open',
    isFactual: undefined,
    href: 'https://articlesource.com',
  }
]

const debunks = [
  {
    id: '1',
    title: "An amazing title to a Facebook fake news post.",
    source: "Facebook",
    factCheckers: [],
    sponsors: [],
    type: "Community",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: "",
    status: 'closed',
    isFactual: false
  },
  {
    id: '2',
    title: "An amazing title to a TikTok fake news post.",
    source: "TikTok",
    factCheckers: [],
    sponsors: [],
    type: "Sponsored",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: "",
    status: 'closed',
    isFactual: true
  },
  {
    id: '3',
    title: "An amazing title to a Instagram fake news post.",
    source: "Instagram",
    factCheckers: [],
    sponsors: [],
    type: "Community",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: "",
    status: 'closed',
    isFactual: false
  },
  {
    id: '4',
    title: "An amazing title to an X fake news post.",
    source: "X",
    factCheckers: [],
    sponsors: [],
    type: "Sponsored",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: "",
    status: 'closed',
    isFactual: true
  },
  {
    id: '5',
    title: "An amazing title to a Youtube fake news post.",
    source: "Youtube",
    factCheckers: [],
    sponsors: [],
    type: "Community",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: "",
    status: 'closed',
    isFactual: false
  },
  {
    id: '6',
    title: "campaigns This Story",
    source: "Facebook",
    factCheckers: [],
    sponsors: [],
    type: "Sponsored",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: "",
    status: 'closed',
    isFactual: true
  }
]

const sponsorships = [
  {
    id: '1',
    title: "sponsorships This Story",
    source: "Facebook",
    factCheckers: [],
    type: "Free",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: ""
  },
  {
    id: '2',
    title: "sponsorships This Story",
    source: "Facebook",
    factCheckers: [],
    type: "Free",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: ""
  },
  {
    id: '3',
    title: "sponsorships This Story",
    source: "Facebook",
    factCheckers: [],
    type: "Free",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: ""
  },
  {
    id: '3',
    title: "sponsorships This Story",
    source: "Facebook",
    factCheckers: [],
    type: "Free",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: ""
  },
  {
    id: '3',
    title: "sponsorships This Story",
    source: "Facebook",
    factCheckers: [],
    type: "Free",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: ""
  },
  {
    id: '3',
    title: "sponsorships This Story",
    source: "Facebook",
    factCheckers: [],
    type: "Free",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: ""
  }
]

const data = Array.from({ length: 23 }).map((_, i) => ({
  href: 'https://articlesource.com',
  title: `ant design part ${i}`,
  avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
  description:
    'Ant Design, a design language for background applications, is refined by Ant UED Team.',
  content:
    'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  factCheckers: [],
  sponsors: [],
  tippers: [],
  evidences: [],
  amount: 3000,
  currency: "USD",
  isFactual: i % 2 === 0,
  source: i % 2 === 0 ? "X" : i % 3 === 0 ? "TikTok" : "Facebook",
  type: i % 2 === 0 ? "Community" : "Sponsored"
}));

export default function Home() {
  const [alignValue, setAlignValue] = useState<Align>('Campaigns');
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const isCampaign = alignValue === 'Campaigns'
  const isDebunks = alignValue === 'Debunks'
  const isSponsorships = alignValue === 'Sponsorships'

  const cardStyle: React.CSSProperties = {
    width: 450,
    // height: 200
  };

  const imgStyle: React.CSSProperties = {
    // display: 'block',
    width: 140,
  };

  const tabs = [
    {
      name: "Campaigns",
      icon: Campaigns
    },
    {
      name: "Debunks",
      icon: Debunks
    },
    {
      name: "Sponsorships",
      icon: Sponsorships
    }
  ].map(({ name, icon }) => (
    {
      value: name,
      label: (
        <Flex className="flex items-center gap-1">
          <Image alt={name} src={icon} width={30} height={30} />
          <Typography.Text>{name}</Typography.Text>
        </Flex>
      )
    }
  ))

  interface RecordType {
    key: string;
    title: string;
    description: string;
    disabled: boolean;
  }

  const mockData: RecordType[] = Array.from({ length: 20 }).map((_, i) => ({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: i % 3 < 1,
  }));

  const oriTargetKeys = mockData.filter((item) => Number(item.key) % 3 > 1).map((item) => item.key);


  const [targetKeys, setTargetKeys] = useState<React.Key[]>(oriTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [disabled, setDisabled] = useState(false);

  const handleChange: TransferProps['onChange'] = (newTargetKeys, direction, moveKeys) => {
    setTargetKeys(newTargetKeys);

    console.log('targetKeys: ', newTargetKeys);
    console.log('direction: ', direction);
    console.log('moveKeys: ', moveKeys);
  };

  const handleSelectChange: TransferProps['onSelectChange'] = (
    sourceSelectedKeys,
    targetSelectedKeys,
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);

    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  };

  const handleScroll: TransferProps['onScroll'] = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };

  const handleDisable = (checked: boolean) => {
    setDisabled(checked);
  };


  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: colorBgContainer }}>
        <Link href="/">
          <Image alt="TDBunk" src={Logo} width={150} height={150} />
        </Link>
        <Flex className="w-full flex items-end justify-end gap-4">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/credentials">
            <Button>Credentials</Button>
          </Link>
        </Flex>
      </Header>
      <LandingPageCarousel />
      <Flex className="items-center p-5 flex flex-col">
        <Segmented
          defaultValue="Campaigns"
          onChange={(value) => setAlignValue(value as Align)}
          options={tabs}
          style={{ backgroundColor: "#334155" }}
        />
        <Row gutter={[0, 16]} className="mt-4 min-h-80">
          {isCampaign && campaigns?.map(({ id, title, source, factCheckers, sponsors, type, amount, currency, evidences, thumbnail }) => {
            const isX = source === 'X'
            const isTikTok = source === 'TikTok'
            const isYoutube = source === 'Youtube'
            const isFacebook = source === 'Facebook'
            const isInstagram = source === 'Instagram'

            const isCommunity = type === 'Community'
            const isSponsored = type === 'Sponsored'

            const numOfFactCheckers = factCheckers.length
            const numOfSponsors = sponsors.length
            return (
              <Col span={8} key={id}>
                <Card hoverable style={cardStyle} styles={{ body: { padding: 0, overflow: 'hidden' } }}>
                  <Flex justify="start">
                    <img alt="avatar" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                      className="w-[140px]" />
                    <Flex vertical className="px-4 py-2 w-full">
                      <Tooltip title={title}>
                        <Flex>
                          {isX && <Image className="-mt-2 -ml-1" alt={source} src={X} width={30} height={30} />}
                          {isTikTok && <Image className="-mt-2 -ml-1" alt={source} src={TikTok} width={30} height={30} />}
                          {isYoutube && <Image className="-mt-2 -ml-1" alt={source} src={Youtube} width={30} height={30} />}
                          {isFacebook && <Image className="-mt-2 -ml-1" alt={source} src={Facebook} width={30} height={30} />}
                          {isInstagram && <Image className="-mt-2 -ml-1" alt={source} src={Instagram} width={30} height={30} />}
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
            )
          })}
          {isDebunks && (
            <Flex className="w-svw justify-center">
              <List className='w-[70%]' size="small"
                bordered
                pagination={{
                  onChange: (page) => {
                    console.log(page);
                  },
                  pageSize: 3,
                }}
                itemLayout="vertical"
                dataSource={data}
                renderItem={(item) => {
                  const source = item.source

                  const isCommunity = item.type === 'Community'
                  const isSponsored = item.type === 'Sponsored'

                  const isX = source === 'X'
                  const isTikTok = source === 'TikTok'
                  const isYoutube = source === 'Youtube'
                  const isFacebook = source === 'Facebook'
                  const isInstagram = source === 'Instagram'

                  const numOfFactCheckers = item.factCheckers.length
                  const numOfSponsors = item.sponsors.length

                  const iconProps = {
                    width: 50,
                    height: 50
                  }
                  return (
                    <List.Item
                      key={item.title}
                      actions={[
                        <Flex className="items-center">
                          <Image alt="Investigators" src={FactCheckers} width={25} height={25} />
                          <Typography.Text style={{ fontSize: 12 }}>{`${item.factCheckers.length + 4} Investigators`}</Typography.Text>
                        </Flex>,
                        <Flex className="items-center">
                          <Image alt="Evidences" src={Evidence} width={25} height={25} />
                          <Typography.Text style={{ fontSize: 12 }}>{`${item.factCheckers.length + 4} Evidences`}</Typography.Text>
                        </Flex>,
                        <Flex className="items-center">
                          {isCommunity && <>
                            <Image alt="Community" src={Community} width={25} height={25} />
                            <Typography.Text style={{ fontSize: 12 }}>{`${item.factCheckers.length + 3} Tips`}</Typography.Text>
                          </>}
                          {isSponsored && <>
                            <Image alt="Sponsorhips" src={Sponsor} width={25} height={25} />
                            <Typography.Text style={{ fontSize: 12 }}>{`${item.factCheckers.length + 3} Sponsors`}</Typography.Text>
                          </>}
                        </Flex>,
                        <Flex className="items-center">
                          {isCommunity && <>
                            <Image alt="Community" src={Sponsorships} width={25} height={25} />
                            <Tag className="ml-2" color="green">{`USD 50`}</Tag>
                          </>}
                          {isSponsored && <>
                            <Image alt="Sponsorhips" src={Sponsorships} width={25} height={25} />
                            <Tag className="ml-2" color="green">{`${item.currency} ${item.amount}`}</Tag>
                          </>}
                        </Flex>
                      ]}
                      extra={
                        <Flex className="h-full items-center justify-center">
                          {item.isFactual && <Image alt="Fact Checkers" src={True} width={90} height={90} />}
                          {!item.isFactual && <Image alt="Fact Checkers" src={False} width={90} height={90} />}
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
                        title={<a href={item.href}>{item.title}</a>}
                        description={item.description}
                      />
                      {item.content}
                    </List.Item>
                  )
                }
                }
              />
            </Flex>
          )}
          {isSponsorships && (
            <Flex className="w-svw justify-center">
              <List className='w-[70%]' size="small"
                bordered
                pagination={{
                  onChange: (page) => {
                    console.log(page);
                  },
                  pageSize: 3,
                }}
                itemLayout="vertical"
                dataSource={data}
                renderItem={(item) => {
                  const country = 'NL'

                  const countryDetails = countries.filter(entry => entry.countryCode === country)[0]

                  const countryFlag = countryDetails.flag
                  const source = item.source

                  const isCommunity = item.type === 'Community'
                  const isSponsored = item.type === 'Sponsored'

                  const isX = source === 'X'
                  const isTikTok = source === 'TikTok'
                  const isYoutube = source === 'Youtube'
                  const isFacebook = source === 'Facebook'
                  const isInstagram = source === 'Instagram'

                  const numOfFactCheckers = item.factCheckers.length
                  const numOfSponsors = item.sponsors.length

                  const iconProps = {
                    width: 50,
                    height: 50
                  }
                  return (
                    <List.Item
                      key={item.title}
                    // actions={[
                    //   <Flex className="items-center">
                    //     <Image alt="Investigators" src={FactCheckers} width={25} height={25} />
                    //     <Typography.Text style={{ fontSize: 12 }}>{`${item.factCheckers.length + 4} Investigators`}</Typography.Text>
                    //   </Flex>,
                    //   <Flex className="items-center">
                    //     <Image alt="Evidences" src={Evidence} width={25} height={25} />
                    //     <Typography.Text style={{ fontSize: 12 }}>{`${item.factCheckers.length + 4} Evidences`}</Typography.Text>
                    //   </Flex>,
                    //   <Flex className="items-center">
                    //     {isCommunity && <>
                    //       <Image alt="Community" src={Community} width={25} height={25} />
                    //       <Typography.Text style={{ fontSize: 12 }}>{`${item.factCheckers.length + 3} Tips`}</Typography.Text>
                    //     </>}
                    //     {isSponsored && <>
                    //       <Image alt="Sponsorhips" src={Sponsor} width={25} height={25} />
                    //       <Typography.Text style={{ fontSize: 12 }}>{`${item.factCheckers.length + 3} Sponsors`}</Typography.Text>
                    //     </>}
                    //   </Flex>,
                    //   <Flex className="items-center">
                    //     {isCommunity && <>
                    //       <Image alt="Community" src={Sponsorships} width={25} height={25} />
                    //       <Tag className="ml-2" color="green">{`USD 50`}</Tag>
                    //     </>}
                    //     {isSponsored && <>
                    //       <Image alt="Sponsorhips" src={Sponsorships} width={25} height={25} />
                    //       <Tag className="ml-2" color="green">{`${item.currency} ${item.amount}`}</Tag>
                    //     </>}
                    //   </Flex>
                    // ]}
                    // extra={
                    //   <Flex className="h-full items-center justify-center">
                    //     {item.isFactual && <Image alt="Fact Checkers" src={True} width={90} height={90} />}
                    //     {!item.isFactual && <Image alt="Fact Checkers" src={False} width={90} height={90} />}
                    //   </Flex>
                    // }
                    >
                      <List.Item.Meta
                      // avatar={<Flex>
                      //   {isX && <Image alt={source} src={X} {...iconProps} />}
                      //   {isTikTok && <Image alt={source} src={TikTok} {...iconProps} />}
                      //   {isYoutube && <Image alt={source} src={Youtube} {...iconProps} />}
                      //   {isFacebook && <Image alt={source} src={Facebook} {...iconProps} />}
                      //   {isInstagram && <Image alt={source} src={Instagram} {...iconProps} />}
                      // </Flex>}
                      // title={<a href={item.href}>{item.title}</a>}
                      // description={item.description}
                      />
                      {/* {item.content} */}
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
                        Number of Investigators
                        Amount Contributed - Percentage of Total
                      </Flex>
                    </List.Item>
                  )
                }
                }
              />
            </Flex>
          )}
        </Row>
      </Flex>
      <div className="border w-full p-12 mt-12 flex">Footer</div>
    </Layout>
  );
}
