import { Card1, TBDVCLogoYellow, FactCheckers, Sponsorships } from "@/app/components/atoms/Icon";
import { CheckCircleFilled, CheckCircleOutlined, RightCircleFilled, SearchOutlined, CopyOutlined } from "@ant-design/icons";
import { theme, StatisticProps, Layout, Flex, Card, Typography, Statistic, Space, Select, InputNumber, Button, Tooltip, Tag, Avatar, Input } from "antd";
import { useState } from "react";
import CountUp from "react-countup";
import Image from 'next/image'
import countries from '@/public/countries.json';


const { Option } = Select

const country = countries.filter((entry) => entry?.countryCode === "KE")[0]


const StepFour = () => {
    const [isSelected, setIsSelected] = useState(true)
    const {
        token: { colorBgContainer, colorPrimary },
    } = theme.useToken()

    const formatter: StatisticProps['formatter'] = (value) => (
        <CountUp end={value as number} separator="," />
    );

    const currency = 'USD'

    const handleCardClicked = () => {
        setIsSelected(!isSelected)
    }
    return <Layout style={{ backgroundColor: colorBgContainer }}>
        <Flex className="flex-col">
            <Flex className="justify-between">
                <Flex className="gap-3">
                    <Card className='w-[360px] h-[220px]'>
                        <Flex onClick={() => handleCardClicked()} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                            <Image alt="card" src={Card1} width={300} height={300} />
                            <Flex className="absolute left-4 top-4 flex-col">
                                <Image alt="LogoIcon" src={TBDVCLogoYellow} width={40} height={40} />
                                <a href="https://mock-idv.tbddev.org" style={{ fontSize: 10, marginTop: 8, color: "white" }}>TBD Issuer</a>
                            </Flex>
                            <Flex className="absolute left-4 top-20 flex-col">
                                <Typography.Text style={{ fontSize: 12 }}>James Does</Typography.Text>
                                <Typography.Text style={{ fontSize: 12 }}>{`${country?.countryName} ${country?.flag}`}</Typography.Text>
                                <Typography.Text style={{ fontSize: 10, marginTop: 10 }}>Expires in 30 days</Typography.Text>
                            </Flex>
                        </Flex>
                        {
                            isSelected
                                ? <CheckCircleFilled className='absolute right-0 mr-2' style={{ color: colorPrimary }} />
                                : <CheckCircleOutlined className='absolute right-0 mr-2' style={{ color: 'gray' }} />
                        }
                    </Card>
                    <Card className='w-[360px] h-[220px]'>
                        <Flex onClick={() => handleCardClicked()} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                            <Image alt="card" src={Card1} width={300} height={300} />
                            <Flex className="absolute left-4 top-4 flex-col">
                                <Image alt="LogoIcon" src={TBDVCLogoYellow} width={40} height={40} />
                                <a href="https://mock-idv.tbddev.org" style={{ fontSize: 10, marginTop: 8, color: "white" }}>TBD Issuer</a>
                            </Flex>
                            <Flex className="absolute left-4 top-20 flex-col">
                                <Typography.Text style={{ fontSize: 12 }}>James Does</Typography.Text>
                                <Typography.Text style={{ fontSize: 12 }}>{`${country?.countryName} ${country?.flag}`}</Typography.Text>
                                <Typography.Text style={{ fontSize: 10, marginTop: 10 }}>Expires in 30 days</Typography.Text>
                            </Flex>
                        </Flex>
                        {
                            isSelected
                                ? <CheckCircleFilled className='absolute right-0 mr-2' style={{ color: colorPrimary }} />
                                : <CheckCircleOutlined className='absolute right-0 mr-2' style={{ color: 'gray' }} />
                        }
                    </Card>
                    <Card className='w-[360px] h-[220px]'>
                        <Flex onClick={() => handleCardClicked()} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                            <Image alt="card" src={Card1} width={300} height={300} />
                            <Flex className="absolute left-4 top-4 flex-col">
                                <Image alt="LogoIcon" src={TBDVCLogoYellow} width={40} height={40} />
                                <a href="https://mock-idv.tbddev.org" style={{ fontSize: 10, marginTop: 8, color: "white" }}>TBD Issuer</a>
                            </Flex>
                            <Flex className="absolute left-4 top-20 flex-col">
                                <Typography.Text style={{ fontSize: 12 }}>James Does</Typography.Text>
                                <Typography.Text style={{ fontSize: 12 }}>{`${country?.countryName} ${country?.flag}`}</Typography.Text>
                                <Typography.Text style={{ fontSize: 10, marginTop: 10 }}>Expires in 30 days</Typography.Text>
                            </Flex>
                        </Flex>
                        {
                            isSelected
                                ? <CheckCircleFilled className='absolute right-0 mr-2' style={{ color: colorPrimary }} />
                                : <CheckCircleOutlined className='absolute right-0 mr-2' style={{ color: 'gray' }} />
                        }
                    </Card>
                </Flex>
                <Flex>
                    <Card className="h-[100px]">
                        <Statistic prefix={currency} valueStyle={{ color: colorPrimary, fontSize: 18, fontWeight: "bold" }} title="Wallet Balance" value={1000} precision={2} formatter={formatter} />
                    </Card>
                </Flex>
            </Flex>
            <Flex className="border border-yellow-500 flex-col mt-4">
                <Space.Compact block >
                    <Select defaultValue="USD">
                        <Option value="USD">USD</Option>
                        <Option value="KES">KES</Option>
                    </Select>
                    <InputNumber defaultValue={12} />
                    <RightCircleFilled className="px-4" style={{ color: colorPrimary }} />
                    <Select defaultValue="USD">
                        <Option value="USD">USD</Option>
                        <Option value="KES">KES</Option>
                    </Select>
                    <Button type="primary" icon={<SearchOutlined />} iconPosition='end'>
                        Search Offers
                    </Button>
                </Space.Compact>
                <Space.Compact block>
                    <Input
                        style={{ width: 'calc(100% - 200px)' }}
                        defaultValue="git@github.com:ant-design/ant-design.git"
                    />
                    <Tooltip title="copy did url">
                        <Button icon={<CopyOutlined />} />
                    </Tooltip>
                </Space.Compact>
                <Flex className="border items-center">
                    <Image src={Sponsorships} alt="sponsorships" width={40} height={40} />
                    <Tag color="gold">USD 300</Tag>
                </Flex>
                <Avatar.Group shape='square' size="large" max={{
                    count: 4, style: {
                        color: '#f56a00', backgroundColor: '#fde3cf',
                        cursor: 'pointer'
                    }, popover: { trigger: 'click' },
                }}>
                    <Tooltip title="Fact Checker 1" placement="top">
                        <Avatar style={{ backgroundColor: colorPrimary }} icon={<Image src={FactCheckers} alt="factChecker" width={50} height={50} />} />
                    </Tooltip>
                    <Tooltip title="Fact Checker 2" placement="top">
                        <Avatar style={{ backgroundColor: colorPrimary }} icon={<Image src={FactCheckers} alt="factChecker" width={50} height={50} />} />
                    </Tooltip>
                    <Tooltip title="Fact Checker 3" placement="top">
                        <Avatar style={{ backgroundColor: colorPrimary }} icon={<Image src={FactCheckers} alt="factChecker" width={50} height={50} />} />
                    </Tooltip>
                    <Tooltip title="Fact Checker 4" placement="top">
                        <Avatar style={{ backgroundColor: colorPrimary }} icon={<Image src={FactCheckers} alt="factChecker" width={50} height={50} />} />
                    </Tooltip>
                </Avatar.Group>
                List of relevant PFI based on selection
            </Flex>
        </Flex>
    </Layout>
}

export default StepFour;
