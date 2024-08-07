"use client"
import { Campaigns, Clock, Community, Debunks, Facebook, FactCheckers, Instagram, Logo, LogoIcon, Sponsorships, TikTok, X, Youtube } from '@/app/components/atoms/Icon';
import LandingPageCarousel from '@/app/components/molecules/carousels/LandingPage';
import { Flex, Layout, Card, Typography, Segmented, Button, Row, Col, Tooltip, Tag, theme } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link'

const { Header } = Layout

type Align = 'Campaigns' | 'Debunks' | 'Sponsorships';
type Source = 'Facebook' | 'TikTok' | 'Instagram' | 'X' | 'Youtube';
type CampaignType = 'Free' | 'Sponsored';

const campaigns = [
  {
    id: '1',
    title: "An amazing title to a Facebook fake news post.",
    source: "Facebook",
    factCheckers: [],
    type: "Community",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: ""
  },
  {
    id: '2',
    title: "An amazing title to a TikTok fake news post.",
    source: "TikTok",
    factCheckers: [],
    type: "Sponsored",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: ""
  },
  {
    id: '3',
    title: "An amazing title to a Instagram fake news post.",
    source: "Instagram",
    factCheckers: [],
    type: "Community",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: ""
  },
  {
    id: '3',
    title: "An amazing title to an X fake news post.",
    source: "X",
    factCheckers: [],
    type: "Sponsored",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: ""
  },
  {
    id: '3',
    title: "An amazing title to a Youtube fake news post.",
    source: "Youtube",
    factCheckers: [],
    type: "Community",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: ""
  },
  {
    id: '3',
    title: "campaigns This Story",
    source: "Facebook",
    factCheckers: [],
    type: "Sponsored",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: ""
  }
]

const debunks = [
  {
    id: '1',
    title: "Debunk This Story",
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
    title: "Debunk This Story",
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
    title: "Debunk This Story",
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
    title: "Debunk This Story",
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
    title: "Debunk This Story",
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
    title: "Debunk This Story",
    source: "Facebook",
    factCheckers: [],
    type: "Free",
    amount: 3000,
    currency: "USD",
    evidences: [],
    thumbnail: ""
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
          type='primary'
          defaultValue="Campaigns"
          className="my-8"
          onChange={(value) => setAlignValue(value as Align)}
          options={tabs}
        />
        <Row gutter={[0, 16]} className="mt-4 min-h-80">
          {isCampaign && campaigns?.map(({ id, title, source, factCheckers, type, amount, currency, evidences, thumbnail }) => {
            const isX = source === 'X'
            const isTikTok = source === 'TikTok'
            const isYoutube = source === 'Youtube'
            const isFacebook = source === 'Facebook'
            const isInstagram = source === 'Instagram'

            const isCommunity = type === 'Community'
            const isSponsored = type === 'Sponsored'

            const numOfFactCheckers = factCheckers.length
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
                        </Flex>
                      </Flex>
                      <Flex className="items-center">
                        <Image alt="Fact Checkers" src={FactCheckers} width={25} height={25} />
                        <Typography.Text style={{ fontSize: 12 }}>{`${numOfFactCheckers} Fact Checkers`}</Typography.Text>
                      </Flex>
                      <Flex className="items-center">
                        <Image alt="Fact Checkers" src={Clock} width={25} height={25} />
                        <Typography.Text style={{ fontSize: 11 }}>Started 2 days ago</Typography.Text>
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
          {isDebunks && debunks?.map(({ id, title, source, factCheckers, type, amount, currency, evidences, thumbnail }) => (
            <Col span={8} key={id}>
              <Card hoverable style={cardStyle} styles={{ body: { padding: 0, overflow: 'hidden' } }}>
                <Flex justify="start">
                  <img alt="avatar" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    style={imgStyle} />
                  <Flex vertical className="px-4 py-2">
                    <Typography.Text>{title}</Typography.Text>
                    <Typography.Text>{source}</Typography.Text>
                    <Typography.Text>{type}</Typography.Text>
                    <Typography.Text>{amount}</Typography.Text>
                    <Typography.Text>{currency}</Typography.Text>
                    <Button size="small">View Debunk</Button>
                  </Flex>
                </Flex>
              </Card>
            </Col>
          ))}
          {isSponsorships && sponsorships?.map(({ id, title, source, factCheckers, type, amount, currency, evidences, thumbnail }) => (
            <Col span={8} key={id}>
              <Card hoverable style={cardStyle} styles={{ body: { padding: 0, overflow: 'hidden' } }}>
                <Flex justify="space-between">
                  <img alt="avatar" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    style={imgStyle} />
                  <Flex vertical align="flex-end" justify="space-between" style={{ padding: 32 }}>
                    <Typography.Text>{title}</Typography.Text>
                    <Typography.Text>{source}</Typography.Text>
                    <Typography.Text>{type}</Typography.Text>
                    <Typography.Text>{amount}</Typography.Text>
                    <Typography.Text>{currency}</Typography.Text>
                    <Typography.Text>{thumbnail}</Typography.Text>
                  </Flex>
                </Flex>
              </Card>
            </Col>
          ))}
        </Row>
      </Flex>
      <div className="border w-full p-12 mt-12 flex">Footer</div>
    </Layout>
  );
}
