"use client"
import { DebounceSelect } from '@/app/components/atoms';
import { Card1, Card2, Card3, Card4, Card5, Community, Facebook, Instagram, Sponsor, TikTok, ValidCredential, X, Youtube } from '@/app/components/atoms/Icon';
import { UserValue } from '@/app/components/molecules/forms/Credentials';
import { CheckCircleFilled, CheckCircleOutlined } from '@ant-design/icons';
import { Avatar, Badge, Card, Flex, Form, Input, InputNumber, Layout, Segmented, Select, Steps, theme, Tooltip, Typography } from 'antd';
import Image from 'next/image';
import { useState } from 'react';

const {Option} = Select

interface FieldType {
    title: string;
    link: string;
    source: string;
    amount: string;
    description: string;
};

const StepTwo = () => {
    const [value, setValue] = useState<UserValue[]>([]);
    const [mode, setMode] = useState<any>();
    const [selectedCredentials, setSelectedCredentials] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false)
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(selectedCredentials.length);

    const onFinish = () => { }
    const onFinishFailed = () => { }

    const selectAfter = (
        <Select defaultValue="USD" style={{ width: 100 }}>
            <Option value="USD">USD</Option>
            <Option value="EUR">EUR</Option>
            <Option value="GBP">GBP</Option>
            <Option value="CNY">CNY</Option>
        </Select>
    );

    const options = [
        {
            name: "Community",
            icon: Community
        },
        {
            name: "Sponsored",
            icon: Sponsor
        },
    ].map(({ name, icon }) => ({
        label: (
            <Flex className="p-6 gap-3 justify-center w-[150px] items-center">
                <Image alt={name} src={icon} width={30} height={30} />
                <Flex className="flex-col">
                    <Flex>{name}</Flex>
                    <Flex className="-mt-2">Campaign</Flex>
                </Flex>
            </Flex>
        ),
        value: name
    }))

    const isCommunity = mode === "Community"
    const isSponsored = mode === "Sponsored"

    const handleCardClicked = (credential: string) => {
        const exists = selectedCredentials.includes(credential)

        if (exists) {
            const removed = selectedCredentials.filter(entry => entry !== credential)
            console.log("removed", removed)
            setSelectedCredentials(removed)
            setCount(removed.length)
        } else {
            setSelectedCredentials((existingCredentials) => ([...existingCredentials, credential]))
            setCount(selectedCredentials.length + 1)
        }
    }

    const {
        token: { colorBgContainer, colorPrimary },
    } = theme.useToken()

    const credentialOptions = [
        {
            name: "Financial",
            card: Card1,
            className: ''
        },
        {
            name: "Government",
            card: Card2,
            className: ''
        },
        {
            name: "Professional",
            card: Card3,
        },
        {
            name: "Educational",
            card: Card4,
        },
        {
            name: "Medical",
            card: Card5,
        }]

    const steps = [
        {
            title: 'Debunk Subject',
            description: 'Add the details of the article to be debunked',
            content: (
                <Flex className="w-full min-h-[520px]">
                    <Form
                        name="basic"
                        layout="vertical"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        className='w-full'
                    >
                        <Form.Item<FieldType>
                            label="Article Title"
                            name="title"
                            rules={[{ required: true, message: 'Please input article title!' }]}
                        >
                            <Input size='large' placeholder='Enter article title' allowClear />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Article Link"
                            name="link"
                            rules={[{ required: true, message: 'Please input article link!' }]}
                        >
                            <Input size='large' placeholder='Enter article link' allowClear />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Source Platform"
                            name="source"
                            rules={[{ required: true, message: 'Please input your source!' }]}
                        >
                            <DebounceSelect
                                value={value}
                                placeholder="Select source platform"
                                fetchOptions={fetchSourcesList}
                                onChange={(newValue) => {
                                    setValue(newValue as UserValue[]);
                                }}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Form>
                </Flex>
            )
        },
        {
            title: 'Campaign Details',
            description: 'Add the details of the campaign debunking the article',
            content: (
                <Flex className="w-full flex-col">
                    <Flex className="justify-center">
                        <Segmented
                            onChange={(value) => {
                                // Launch modal
                                console.log("Values", value)
                                setMode(value)
                                // showModal()
                            }}
                            options={options}
                            style={{ backgroundColor: "#334155", height: 100 }}
                        />
                    </Flex>
                    <Flex className='min-h-[520px]'>
                        <Form
                            name="basic"
                            layout="vertical"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            className='w-full'
                        >
                            {isSponsored && (
                                <Form.Item<FieldType>
                                    label="Sponsorhip Amount"
                                    name="amount"
                                    rules={[{ required: true, message: 'Please input your description!' }]}
                                >
                                    <InputNumber size='large' addonBefore={selectAfter} defaultValue={100} />
                                </Form.Item>
                            )}
                            <Form.Item<FieldType>
                                label="Campaign Name"
                                name="title"
                                rules={[{ required: true, message: 'Please input your title!' }]}
                            >
                                <Input size='large' placeholder='Enter your title' allowClear />
                            </Form.Item>
                            <Form.Item<FieldType>
                                label="Campaign Description"
                                name="description"
                                rules={[{ required: true, message: 'Please input your description!' }]}
                            >
                                <Input.TextArea size='large' placeholder='Enter the description' allowClear />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Number of Fact Checkers"
                                name="amount"
                                rules={[{ required: true, message: 'Please input number of fact checkers!' }]}
                            >
                                <InputNumber size='large' addonBefore={selectAfter} defaultValue={4} />
                            </Form.Item>
                            <Form.Item<FieldType>
                                label="Minimum Evidence Submissions"
                                name="amount"
                                rules={[{ required: true, message: 'Please input number of fact checkers!' }]}
                            >
                                <InputNumber size='large' addonBefore={selectAfter} defaultValue={4} />
                            </Form.Item>
                        </Form>
                    </Flex>
                </Flex>
            )
        },
        {
            title: "Investigators' Credentials",
            description: 'Add the credentials needed by face checkers to debunk the campaign subject. List of Selectable Credentials from those TDBunk has Integrated',
            content: (
                <Flex wrap className="w-full gap-6 mt-6">
                    <Tooltip title="Select the credentials required to be a fact checker in this campaign." placement="top" >
                        <Flex className="w-full justify-center items-center">
                            <Badge count={count} color={colorPrimary} style={{ color: "white" }}>
                                <Avatar shape='square' size='large' style={{ backgroundColor: colorPrimary }} icon={<Image src={ValidCredential} alt="factChecker" width={20} height={20} />} />
                            </Badge>
                            <Typography.Text className="ml-3">Required Credentials</Typography.Text>
                        </Flex>
                    </Tooltip>
                    <Flex wrap className="gap-3 justify-center">
                        {credentialOptions.map(({ name, card }) => {
                            const isSelected = selectedCredentials.includes(name)
                            console.log("Is Selected", isSelected)
                            return (
                                <Card onClick={() => handleCardClicked(name)} className={`transition-all cursor-pointer w-[380px] h-[130px] ${isSelected ? 'opacity-100' : 'opacity-60'} hover:opacity-80`}>
                                    <Flex className={`absolute  rounded-md transition-all cursor-pointer`}>
                                        <Image alt="card" src={card} width={150} height={150} />
                                    </Flex>
                                    <Flex className={`self-end absolute right-3 items-center h-[80px] w-[calc(100%-12rem)]`}>
                                        <Typography.Text style={{ fontSize: 10, marginRight: 5 }}>{`Verifiable ${name} Credential`}</Typography.Text>
                                        {
                                            isSelected
                                                ? <CheckCircleFilled style={{ color: colorPrimary }} />
                                                : <CheckCircleOutlined style={{ color: 'gray' }} />
                                        }
                                    </Flex>
                                </Card>
                            )
                        })}
                    </Flex>
                </Flex>
            )
        },
    ];


    const onChange = (value: number) => {
        console.log('onChange:', value);
        setCurrent(value);
    };

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    async function fetchSourcesList(countryName: string): Promise<any[]> {
        const response = await fetch('/countries.json')
        const data = await response.json()

        const similar = data.filter((country: any) => country?.countryName.toLowerCase().includes(countryName.toLowerCase()))

        return [
            {
                name: "TikTok",
                icon: TikTok
            },
            {
                name: "Facebook",
                icon: Facebook
            },
            {
                name: "X",
                icon: X
            },
            {
                name: "Youtube",
                icon: Youtube
            },
            {
                name: "Instagram",
                icon: Instagram
            },
        ].map(({ name, icon }: any) => ({
            label: <Flex className="items-center">
                <Typography.Text>{name}</Typography.Text>
                <Image alt={name} width={25} height={25} src={icon} />
            </Flex>,
            value: name
        }))
    }

    const selectBefore = (
        <Select defaultValue="add" style={{ width: 60 }}>
            <Option value="add">+</Option>
            <Option value="minus">-</Option>
        </Select>
    );


    return <Layout style={{ backgroundColor: colorBgContainer }}>
        <Flex className="h-auto min-h-[600px] flex-col">
            <Flex className="w-1/2 self-center">
                <Steps
                    size="small"
                    current={current}
                    items={items}
                    onChange={onChange}
                />
            </Flex>
            <Flex className="w-full mt-4">
                {steps[current]?.content}
            </Flex>
        </Flex>
    </Layout>
}

export default StepTwo;
