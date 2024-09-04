"use client"

import { Logo } from '@/app/components/atoms/Icon';
import { useWeb5Context } from '@/app/providers/Web5Provider';
import { Button, Flex, theme } from 'antd';
import { Header } from 'antd/es/layout/layout';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LandingHeader = () => {
    const { userDid, web5, campaigns } = useWeb5Context()
    const pathname = usePathname()

    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const START_CAMPAIGN = '/start/campaign'
    const START_DEBUNKING = '/start/debunking'
    const SPONSOR_CAMPAIGN = '/sponsor'

    const links = [
        {
            name: "Start Campaign",
            path: START_CAMPAIGN,
            active: pathname === START_CAMPAIGN
        },
        {
            name: "Start Debunking",
            path: START_DEBUNKING,
            active: pathname === START_DEBUNKING

        },
        {
            name: "Sponsor Campaign",
            path: SPONSOR_CAMPAIGN,
            active: pathname === SPONSOR_CAMPAIGN

        }
    ].map(({ name, path, active }) => (
        <Link key={path} href={path}>
            <Button type={active ? "primary" : "default"}>{name}</Button>
        </Link>
    ))

    return (
        <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: colorBgContainer }}>
            <Link href="/">
                <Image alt="TDBunk" src={Logo} width={150} height={150} />
            </Link>
            <Flex className="w-full flex items-end justify-end gap-4">
                {links}
            </Flex>
        </Header>
    )
}

export default LandingHeader



