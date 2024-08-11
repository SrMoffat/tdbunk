"use client"
import { Campaigns, Clock, Community, Debunks, Evidence, Facebook, FactCheckers, False, Instagram, Logo, Sponsor, Sponsorships, TikTok, True, X, Youtube } from '@/app/components/atoms/Icon';
import LandingPageCarousel from '@/app/components/molecules/carousels/LandingPage';
import { Flex, Layout, Card, Typography, Segmented, Button, Row, Col, Tooltip, Tag, List, Rate, theme } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns';
import countries from '@/public/countries.json'
import { campaigns, campaignData } from './mocks';
import { LANDING_PAGE_TABS } from './constants';
import { isCampaign, isDebunks, isSponsorships } from './utils';

const date = new Date(2023, 5, 15);
const formattedDistance = formatDistanceToNow(date, { addSuffix: true });
console.log(formattedDistance);
const { Header } = Layout

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<LANDING_PAGE_TABS>(LANDING_PAGE_TABS.CAMPAIGNS);
  const {
    token: { colorBgContainer },
  } = theme.useToken()

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
          <Link href="/start/campaign">
            <Button>Start Campaign</Button>
          </Link>
          <Link href="/start/debunking">
            <Button>Start Debunking</Button>
          </Link>
          <Link href="/sponsor">
            <Button>Sponsor Campaign</Button>
          </Link>
        </Flex>
      </Header>
      <LandingPageCarousel />
      <Flex className="items-center p-5 flex flex-col">
        <Segmented
          defaultValue="Campaigns"
          onChange={(value) => setSelectedTab(value as LANDING_PAGE_TABS)}
          options={tabs}
          style={{ backgroundColor: "#334155" }}
        />
        <Row gutter={[0, 16]} className="mt-4 min-h-80">
          {isCampaign(selectedTab) && campaigns?.map(({ id, title, source, factCheckers, sponsors, type, amount, currency, evidences, thumbnail }) => {
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
          {isDebunks(selectedTab) && (
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
                dataSource={campaignData}
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
          {isSponsorships(selectedTab) && (
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
                dataSource={campaignData}
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
