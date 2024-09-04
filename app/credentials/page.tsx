"use client"
import { Logo } from '@/app/components/atoms/Icon';
import { Button, Flex, Layout, theme } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

const { Header } = Layout

export default function CredentialsFormPage() {
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: colorBgContainer }}>
                <Link href="/">
                    <Image alt="TDBunk" src={Logo} width={150} height={150} />
                </Link>
                <Flex className="w-full flex items-end justify-end gap-4">
                    <Link href="/">
                        <Button>Home</Button>
                    </Link>
                    <Link href="/login">
                        <Button>Login</Button>
                    </Link>
                </Flex>
            </Header>
            <div className="border w-full">Footer</div>
        </Layout>
    );
};
