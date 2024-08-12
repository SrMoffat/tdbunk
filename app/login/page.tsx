"use client"
import React from 'react'
import { Logo, LogoIcon } from '@/app/components/atoms/Icon';
import { Flex, Layout, Button, Card, theme } from 'antd';
import Image from 'next/image';
import Link from 'next/link'
import LoginForm from '@/app/components/molecules/forms/Login';

const { Header } = Layout

export default function LoginPage() {
    const {
        token: { colorBgContainer },
    } = theme.useToken()
    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: colorBgContainer }}>
                <Link href="/">
                    <Image alt="TDBunk" src={LogoIcon} width={50} height={50} />
                </Link>
                <Flex className="w-full flex items-end justify-end gap-4">
                    <Link href="/">
                        <Button>Home</Button>
                    </Link>
                    <Link href="/credentials">
                        <Button>Credentials</Button>
                    </Link>
                </Flex>
            </Header>
            <Flex className="h-full items-center justify-center">
                <Card className='w-1/4'>
                    <Image alt="TDBunk" src={Logo} width={150} height={150} />
                    Login
                    <LoginForm />
                </Card>
            </Flex>
            <div className="border w-full">Footer</div>
        </Layout>
    );
};
