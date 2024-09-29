"use client"

import { Footer } from '@/app/components/atoms';
import {
    TransactionArea,
    TransactionBar,
    TransactionLine,
    TransactionPie
} from '@/app/components/molecules/charts';
import LandingHeader from '@/app/components/molecules/headers/LandingHeader';
import { PFIs } from '@/app/lib/constants';
import { getCurrencyFlag } from '@/app/lib/utils';
import { PRIMARY_GOLD_HEX } from '@/app/providers/ThemeProvider';
import { RightCircleFilled } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { Badge, Button, Card, Flex, Layout, Space, Table, Tag, theme, Typography } from 'antd';
import React from 'react';

export interface PFI { name: any; did?: string; currencyPairs?: string[][]; }

interface DataType {
    key: React.Key;
    name: string;
    did: string;
    currencyPairs: string[][];
}

const PFIList = () => {
    const columns: TableColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (value: string) => {
                const PFI = PFIs.find((entry: any) => entry.name === value);
                return (
                    <Tag color={PFI?.color}>{value}</Tag>
                )
            }
        },
        {
            title: 'DID',
            dataIndex: 'did',
            render: (value: string) => {
                return (
                    <Typography.Text copyable>{value}</Typography.Text>
                )
            }
        },
        {
            title: 'Offerings',
            dataIndex: 'currencyPairs',
            render: (values) => {
                const currencyPairs = values
                return (
                    <Flex className="gap-2">
                        {currencyPairs?.map((pair: any, index: number) => {
                            const [from, to] = pair
                            return (
                                <Space.Compact className="w-full" key={index}>
                                    <Button className="h-[30px] w-full" disabled>
                                        <Flex className="flex flex-col justify-center items-center">
                                            <Flex className="text-white" >
                                                {from}
                                                {' '}
                                                {getCurrencyFlag(from)}
                                            </Flex>
                                        </Flex>
                                    </Button>
                                    <Button className="w-[60px] h-[30px] opacity-100">
                                        <RightCircleFilled style={{ color: PRIMARY_GOLD_HEX }} />
                                    </Button>
                                    <Button className="h-[30px] w-full" disabled >
                                        <Flex className="flex flex-col justify-center items-center">
                                            <Flex className="text-white" >
                                                {to}
                                                {' '}
                                                {getCurrencyFlag(to)}
                                            </Flex>
                                        </Flex>
                                    </Button>
                                </Space.Compact>
                            )
                        })}
                    </Flex>
                )
            }
        },
    ];
    return (
        <Table<DataType> columns={columns} dataSource={PFIs} size="small" />
    )
}
export default function ParticipatingFinancialInstitutions() {
    const { token: { colorPrimary } } = theme.useToken()
    return (
        <Layout className="">
            <LandingHeader />
            <Flex className="flex-col w-full gap-4 mt-2 px-12 py-8">
                <Flex>
                    <Card className="w-full">
                        <Badge count={PFIs?.length} style={{ color: "white", backgroundColor: colorPrimary }}>
                            <Typography.Title level={4} className="mb-12">Participating Financial Institutions</Typography.Title>
                        </Badge>
                        <PFIList />
                    </Card>
                </Flex>
                <Flex className="gap-4">
                    <Card className="w-full">
                        <Typography.Title level={4} className="mb-12">Monthly Transactions (Line)</Typography.Title>
                        <TransactionLine />
                    </Card>
                    <Card className="w-full">
                        <Typography.Title level={4} className="mb-12">Monthly Transactions (Area)</Typography.Title>
                        <TransactionBar />
                    </Card>
                </Flex>
                <Flex className="gap-4">
                    <Card className="w-full">
                        <Typography.Title level={4} className="mb-12">Monthly Transactions (Bar)</Typography.Title>
                        <TransactionArea />
                    </Card>
                    <Card className="w-full">
                        <Typography.Title level={4} className="mb-12">Monthly Transactions (Pie)</Typography.Title>
                        <TransactionPie />
                    </Card>
                </Flex>
                <Flex>
                    <Card className="w-full">Four</Card>
                </Flex>
            </Flex>
            <Footer />
        </Layout>
    )
}
