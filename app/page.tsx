"use client"
import { Logo, LogoIcon } from '@/app/components/atoms/Icon';
import LandingPageCarousel from '@/app/components/molecules/carousels/LandingPage';
import { Flex, Layout, Segmented, Button, theme } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link'

const { Header } = Layout

type Align = 'Campaigns' | 'Debunks' | 'Sponsorships';


export default function Home() {
  const [alignValue, setAlignValue] = useState<Align>('Campaigns');
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const isCampaign = alignValue === 'Campaigns'
  const isDebunks = alignValue === 'Debunks'
  const isSponsorships = alignValue === 'Sponsorships'

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
          <Link href="/signup">
            <Button>Signup</Button>
          </Link>
        </Flex>
      </Header>
      <LandingPageCarousel />
      <Flex className="items-center p-5 flex flex-col">
        <Segmented
          defaultValue="center"
          style={{ marginBottom: 8 }}
          onChange={(value) => setAlignValue(value as Align)}
          options={['Campaigns', 'Debunks', 'Sponsorships']}
        />
        <Flex className="h-[400px] border border-red-500 w-full">
          {isCampaign && 'isCampaign'}
          {isDebunks && 'Debunks'}
          {isSponsorships && 'isSponsorships'}
        </Flex>
      </Flex>
      <div className="border w-full">Footer</div>
    </Layout>
  );
}
