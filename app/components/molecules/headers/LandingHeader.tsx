import { Logo } from '@/app/components/atoms/Icon';
import { Button, Flex, theme } from 'antd';
import { Header } from 'antd/es/layout/layout';
import Image from 'next/image';
import Link from 'next/link';

const LandingHeader = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const links = [
        {
            name: "Start Campaign",
            path: "/start/campaign"
        },
        {
            name: "Start Debunking",
            path: "/start/debunking"
        },
        {
            name: "Sponsor Campaign",
            path: "/sponsor"
        }
    ].map(({ name, path}) => (
        <Link href={path}>
            <Button>{name}</Button>
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



