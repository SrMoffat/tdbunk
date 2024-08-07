"use client"
import React from 'react'
import { Logo, LogoIcon } from '@/app/components/atoms/Icon';
import { Flex, Layout, Button, Card, Typography, theme } from 'antd';
import Image from 'next/image';
import Link from 'next/link'
import CredentialsForm from '@/app//components/molecules/forms/Credentials';

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
            <Flex className="h-full items-center justify-center">
                <Card className='w-1/4'>
                    <Flex className="flex flex-col justify-center items-center">
                        <Image alt="TDBunk" src={LogoIcon} width={60} height={60} />
                        <Typography.Title level={3} className="mt-4">Create Credential</Typography.Title>
                    </Flex>
                    <CredentialsForm />
                </Card>
            </Flex>
            <div className="border w-full">Footer</div>
        </Layout>
    )
}
