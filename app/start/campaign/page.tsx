"use client"
import DebounceSelect from '@/app/components/atoms/DebounceSelect';
import { Card1, Card2, Card3, Card4, Card5, Community, Create, Evidence, Facebook, FactCheckers, Import, Instagram, LogoIcon2, Request, Sponsor, Sponsorships, StartCampaign, TBDVCLogoYellow, TikTok, ValidCredential, X, Youtube } from '@/app/components/atoms/Icon';
import CredentialsForm from '@/app/components/molecules/forms/Credentials';
import LandingHeader from '@/app/components/molecules/headers/LandingHeader';
import countries from '@/public/countries.json';
import { CheckCircleFilled, CheckCircleOutlined, CopyFilled, CopyOutlined, RightCircleFilled, SearchOutlined } from '@ant-design/icons';
import type { DescriptionsProps, StatisticProps, StepsProps, UploadProps } from 'antd';
import { Avatar, Badge, Button, Card, Collapse, CollapseProps, Descriptions, Divider, Drawer, Flex, Form, Input, InputNumber, Layout, message, Popover, QRCode, Segmented, Select, Space, Statistic, Steps, Tabs, Tag, theme, Tooltip, Typography, Upload } from 'antd';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import CountUp from 'react-countup';
import { DraggableData, DraggableEvent } from 'react-draggable';

const { Option } = Select;

const { TextArea } = Input;

const { Dragger } = Upload;

const country = countries.filter((entry) => entry?.countryCode === "KE")[0]

const customDot: StepsProps['progressDot'] = (dot, { status, index }) => (
    <Popover
        content={
            <span>
                step {index} status: {status}
            </span>
        }
    >
        {dot}
    </Popover>
);

const { Header } = Layout

const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};

interface FieldType {
    title?: string;
    description?: string;
    amount?: string;
    source?: string;
    link?: string;
};

interface UserValue {
    label: string;
    value: string;
}

const StepOne = () => {
    // Step 1
    const [mode, setMode] = useState('Request');
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [copied, setCopied] = useState(false)
    const draggleRef = useRef<HTMLDivElement>(null);
    const [disabled, setDisabled] = useState(true);
    const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });

    const options = [
        {
            name: "Request",
            icon: Request
        },
        {
            name: "Create",
            icon: Create
        },
        {
            name: "Import",
            icon: Import
        }
    ].map(({ name, icon }) => ({
        label: (
            <Flex className="p-8 gap-4 justify-center w-[150px] items-center">
                <Image alt={name} src={icon} width={50} height={50} />
                <Flex className="flex-col">
                    <Flex>{name}</Flex>
                    <Flex className="-mt-2">Credential</Flex>
                </Flex>
            </Flex>
        ),
        value: name
    }))

    const isRequest = mode === options[0]?.value
    const isCreate = mode === options[1]?.value
    const isImport = mode === options[2]?.value

    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = (e: React.MouseEvent<HTMLElement>) => {
        setOpen(false);
    };

    const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
        setOpen(false);
    };

    const showDrawer = () => {
        setOpen2(true);
    };

    const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };

    const RequestCredential = (props: any) => {
        const { showDrawer } = props

        const items: CollapseProps['items'] = [
            {
                key: '1',
                label: 'Financial Insitution',
                children:
                    <FinancialInstitutionCredential showDrawer={showDrawer} />
                // <CredentialIssuer />
            },
            {
                key: '2',
                label: 'Government Institution',
                children:
                    <GovernmentInstitutionCredential showDrawer={showDrawer} />
                // <CredentialIssuer />
            },
            {
                key: '3',
                label: 'Professional Institution',
                children:
                    <ProfessionalInstitutionCredential showDrawer={showDrawer} />
                // <CredentialIssuer />
            },
            {
                key: '4',
                label: 'Educational Institution',
                children:
                    <EducationalInstitutionCredential showDrawer={showDrawer} />
                // <CredentialIssuer />
            },
            {
                key: '5',
                label: 'Medical Institution',
                children:
                    <MedicalInstitutionCredential showDrawer={showDrawer} />
                // <CredentialIssuer />
            },
        ];

        return (
            <Flex className="flex-col">
                <Typography.Text className="font-bold mb-4">Verifiable Credential Issuers</Typography.Text>
                <Collapse accordion items={items} />
            </Flex>
        )
    }

    const CreateCredential = () => {
        return (
            <Flex className="h-full flex-col">
                <Typography.Text className="font-bold mb-4">Create Credential</Typography.Text>
                <CredentialsForm />
            </Flex>
        )
    }

    const ImportCredential = () => {
        return (
            <Tabs
                defaultActiveKey="1"
                type="card"
                size="small"
                items={[
                    {
                        label: 'Scan QR Code',
                        key: 'scan',
                        children: <QRCode
                            errorLevel="H"
                            size={240}
                            iconSize={240 / 4}
                            value="https://ant.design/"
                            icon="/logo-icon.svg"
                        />
                    },
                    {
                        label: 'Upload Document',
                        key: 'upload',
                        children: <Dragger {...props}>
                            <p className="flex justify-center">
                                <Image alt="Card3" src={Request} width={50} height={50} />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Upload the JSON document for the credential. Kindly ensure it is a valid JSON file.
                            </p>
                        </Dragger>
                    },
                    {
                        label: 'Paste Document',
                        key: 'paste',
                        children: <TextArea rows={4} placeholder="maxLength is 6" maxLength={6} />
                    }
                ]}
            />

        )
    }

    const onClose = () => {
        setOpen2(false);
    };
    return (
        <Layout style={{ backgroundColor: colorBgContainer }}>
            <Drawer title="Credential Document" onClose={onClose} open={open2} width={1000}>
                <Flex className="mb-3">
                    Copy Document
                    {copied && <CopyFilled style={{ color: "#CC9933" }} className="ml-1 cursor-pointer" />}
                    {!copied && <CopyOutlined onClick={() => {
                        setCopied(true)
                    }} className="ml-1 cursor-pointer" />}
                </Flex>
                <Flex className="border bg-[#334155] p-4 rounded-md border-gray-800 flex-col">
                    <pre>{JSON.stringify(countries, null, 2)}</pre>
                </Flex>
            </Drawer>
            <Flex className="justify-center mb-6">
                <Segmented
                    onChange={(value) => {
                        // Launch modal
                        console.log("Values", value)
                        setMode(value)
                        showModal()
                    }}
                    options={options}
                    style={{ backgroundColor: "#334155", height: 118 }}
                />
            </Flex>
            {isRequest && <RequestCredential showDrawer={showDrawer} />}
            {isCreate && <CreateCredential />}
            {isImport && <ImportCredential />}
        </Layout>

    )
}

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

const StepThree = () => {

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Article Title',
            children: 'Article Title',
            span: 3,
        },
        {
            key: '2',
            label: 'Article Source',
            children: 'Article Source',
            span: 3,

        },
        {
            key: '3',
            label: 'Article Link',
            children: 'Article Link',
            span: 3,

        },
    ];
    const items2: DescriptionsProps['items'] = [
        {
            key: '6',
            label: 'Status',
            children: <Badge status="default" text="Pending" />,
            span: 3,
        },
        {
            key: '6',
            label: 'Type',
            children: (
                <Flex>
                    <Image src={Sponsorships} width={25} height={25} alt="sponsored" />
                    <Typography.Text>Sponsored</Typography.Text>
                </Flex>
            ),
            span: 3,
        },
        {
            key: '7',
            label: 'Sponsored Amount',
            children: '$80.00',
            span: 3,

        },
        {
            key: '8',
            label: 'Name',
            children: 'Name',
            span: 3,

        },
        {
            key: '9',
            label: 'Description',
            children: 'I would like to disprove the theory that the article proposes mentioning a lot of disinformation and misinformation stuff.',
            span: 3,

        },
        {
            key: '11',
            label: 'Fact Checkers',
            children: (
                <Flex className="items-center">
                    <Image src={FactCheckers} width={25} height={25} alt="sponsored" />
                    <Typography.Text>4 Fact Checkers</Typography.Text>
                    <Divider className="ml-4" type="vertical" />
                    <Image src={ValidCredential} width={25} height={25} alt="sponsored" />
                    <Typography.Text>3 Required Credentials</Typography.Text>
                </Flex>
            ),
            span: 3,

        },
        {
            key: '12',
            label: 'Minimum Evidence',
            children: (
                <Flex>
                    <Image src={Evidence} width={25} height={25} alt="sponsored" />
                    <Typography.Text>4 Evidences</Typography.Text>
                </Flex>
            ),
            span: 3,

        },
    ];
    const {
        token: { colorBgContainer },
    } = theme.useToken()
    return <Layout style={{ backgroundColor: colorBgContainer }}>
        <Flex className="flex-col self-center">
            <Descriptions title="Debunking Subject" bordered items={items} />
            <Descriptions className="mt-6" title="Debunking Campaign" bordered items={items2} />
        </Flex>
    </Layout>
}

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

const FinancialInstitutionCredential = (props: any) => {
    const { showDrawer } = props
    return (
        <Flex className="h-[200px]">
            <Flex onClick={() => showDrawer()} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
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
        </Flex>
    )
}

const GovernmentInstitutionCredential = (props: any) => {
    const { showDrawer } = props
    return (
        <Flex className="h-[200px]">
            <Flex onClick={() => showDrawer()} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="Card2" src={Card2} width={300} height={300} />
                <Flex className="absolute right-4 top-2 flex-col justify-end items-end">
                    <Image alt="LogoIcon" src={LogoIcon2} width={40} height={40} />
                    <a href="https://mock-idv.tbddev.org" style={{ fontSize: 10, marginTop: -3, color: "white" }}>{`Government of ${country?.countryName}`} </a>
                </Flex>
                <Flex className="absolute right-4 top-20 flex-col">
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>James Does</Typography.Text>
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>{`${country?.countryName} ${country?.flag}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 10, marginTop: 10, textAlign: "right" }}>Expires in 30 days</Typography.Text>
                </Flex>
            </Flex>
        </Flex>
    )
}

const ProfessionalInstitutionCredential = (props: any) => {
    const { showDrawer } = props
    return (
        <Flex className="h-[200px]">
            <Flex onClick={() => showDrawer()} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="Card3" src={Card3} width={300} height={300} />
                <Flex className="absolute right-[102px] top-3 flex-col items-center">
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>Board of Journalists</Typography.Text>
                </Flex>
                <Flex className="absolute right-[108px] top-28 flex-col items-center">
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>James Does</Typography.Text>
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>{`${country?.countryName} ${country?.flag}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 10, textAlign: "right" }}>Expires in 30 days</Typography.Text>
                </Flex>
            </Flex>
        </Flex>
    )
}

const EducationalInstitutionCredential = (props: any) => {
    const { showDrawer } = props
    return (
        <Flex className="h-[200px]">
            <Flex onClick={() => showDrawer()} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="Card4" src={Card4} width={300} height={300} />

                <Flex className="absolute right-8 top-0 flex-col">
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>James Does</Typography.Text>
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>{`${country?.countryName} ${country?.flag}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 10, marginTop: 10, textAlign: "right" }}>Expires in 30 days</Typography.Text>
                </Flex>

                <Flex className="absolute right-4 top-20 flex-col">
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>James Does</Typography.Text>
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>{`${country?.countryName} ${country?.flag}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 10, marginTop: 10, textAlign: "right" }}>Expires in 30 days</Typography.Text>
                </Flex>
            </Flex>
        </Flex>
    )
}

const MedicalInstitutionCredential = (props: any) => {
    const { showDrawer } = props
    return (
        <Flex className="h-[200px]">
            <Flex onClick={() => showDrawer()} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="Card5" src={Card5} width={300} height={300} />
                <Flex className="absolute right-4 top-24 flex-col">
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>James Does</Typography.Text>
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>{`${country?.countryName} ${country?.flag}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 10, marginTop: 10, textAlign: "right" }}>Expires in 30 days</Typography.Text>
                </Flex>
            </Flex>
        </Flex>
    )
}

const CredentialIssuer = () => {
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined
        if (copied) {
            timer = setTimeout(() => {
                setCopied(false)
            }, 1000)
        }

        return () => {
            clearTimeout(timer)
        }
    }, [copied])
    return (
        <Flex className="flex-col border border-gray-800 rounded-md p-4 gap-2">
            <Flex>Credential Issuer Name</Flex>
            <Flex>https://credential.users.com</Flex>
            <Flex>
                did:dht:i73yjhjd....87jhbsdj
                {copied && <CopyFilled style={{ color: "#CC9933" }} className="ml-1 cursor-pointer" />}
                {!copied && <CopyOutlined onClick={() => {
                    setCopied(true)
                    // TO DO: Copy to clipboard
                }} className="ml-1 cursor-pointer" />}
            </Flex>
            <Flex>
                <Button type="primary" size="small">Request</Button>
            </Flex>
        </Flex>
    )
}

export default function StartCampaignPage() {
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const [mode, setMode] = useState('');
    const [open, setOpen] = useState(false);
    const draggleRef = useRef<HTMLDivElement>(null);

    const showModal = () => {
        setOpen(true);
    };

    const [copied, setCopied] = useState(false)

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined
        if (copied) {
            timer = setTimeout(() => {
                setCopied(false)
            }, 1000)
        }

        return () => {
            clearTimeout(timer)
        }
    }, [copied])

    const steps = [
        {
            title: 'Credentials',
            content: <StepOne />,
        },
        {
            title: 'Campaign Details',
            content: <StepTwo />,
        },
        {
            title: 'Verify Details',
            content: <StepThree />,
        },
        {
            title: 'Start Campaign',
            content: <StepFour />,
        },
    ];

    const { token } = theme.useToken();
    const [current, setCurrent] = useState(1);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    const handleDone = () => {
        // next()
        message.success('Processing complete!')
    }

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const isNotFirstStep = current > 0
    const hasMoreSteps = current < steps.length - 1
    const isLastStep = current === steps.length - 1

    return (
        <Layout className="h-screen">
            <LandingHeader />
            <Flex className=" items-center flex-col pt-12 gap-5 h-auto mb-4">
                <Flex className="w-1/2 justify-center">
                    <Image alt="Start Campaign" src={StartCampaign} width={300} height={300} />
                </Flex>
                <Flex className="w-[calc(100%-8rem)]">
                    <Card className="w-full">
                        <Steps current={current} items={items} />
                    </Card>
                </Flex>
                <Flex className="w-[calc(100%-8rem)] h-auto min-h-[750px]">
                    <Card className="w-full">
                        {steps[current].content}
                    </Card>
                </Flex>
                <Flex className="w-[calc(100%-8rem)] justify-between">
                    {isNotFirstStep ? <Button onClick={() => prev()}>Back</Button> : <Button className="opacity-0 cursor-none pointer-events-none" />}
                    {hasMoreSteps && <Button type="primary" onClick={() => next()}>Next</Button>}
                    {isLastStep && <Button type="primary" onClick={() => handleDone()}>Done</Button>}
                </Flex>
            </Flex>
            <Flex className='border p-4'>Footer</Flex>
        </Layout>
    );
}

