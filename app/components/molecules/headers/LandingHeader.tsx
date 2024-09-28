"use client"

import { Logo } from '@/app/components/atoms/Icon';
import { Button, Flex, theme } from 'antd';
import { Header } from 'antd/es/layout/layout';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export enum Actions {
    CAMPAIGN = "Start Campaign",
    DEBUNKING = "Start Debunking",
    SPONSOR = "Sponsor Campaign",
    PARTNERS = "View Partners",
}

const START_CAMPAIGN = '/start/campaign'
const START_DEBUNKING = '/start/debunking'
const SPONSOR_CAMPAIGN = '/sponsor'
const VIEW_PARTNERS = '/partners'

const LandingHeader = () => {
    const pathname = usePathname()

    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const links = [
        {
            name: Actions.CAMPAIGN,
            path: START_CAMPAIGN,
            active: pathname === START_CAMPAIGN
        },
        {
            name: Actions.DEBUNKING,
            path: START_DEBUNKING,
            active: pathname === START_DEBUNKING

        },
        {
            name: Actions.SPONSOR,
            path: SPONSOR_CAMPAIGN,
            active: pathname === SPONSOR_CAMPAIGN
        },
        {
            name: Actions.PARTNERS,
            path: VIEW_PARTNERS,
            active: pathname === VIEW_PARTNERS
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



