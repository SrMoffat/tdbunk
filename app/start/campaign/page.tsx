"use client"
import { Card1, Card2, Card3, Card4, Card5, Create, Import, Logo, LogoIcon, Request, StartCampaign, LogoIcon2, TBDVCLogoBlack, TBDVCLogoYellow, TikTok, Facebook, X, Youtube, Instagram, Community, Sponsor, Sponsorships, FactCheckers } from '@/app/components/atoms/Icon';
import { CopyOutlined, CopyFilled } from '@ant-design/icons';
import { Button, Flex, Layout, Modal, Segmented, Steps, List, Collapse, theme, Typography, CollapseProps, Card, Drawer, QRCode, Tabs, Form, Checkbox } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import countries from '@/public/countries.json'
import CredentialsForm from '@/app/components/molecules/forms/Credentials';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload, Select } from 'antd';
import { Input, Cascader, InputNumber, Space } from 'antd';
import DebounceSelect from '@/app/components/atoms/DebounceSelect';
import { ArrowUpOutlined } from '@ant-design/icons';
import type { StepsProps } from 'antd';
import { Popover } from 'antd';
import { Badge, Descriptions, Statistic } from 'antd';
import type { DescriptionsProps } from 'antd';

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
    const [isLoading, setIsLoading] = useState(false)
    const [current, setCurrent] = useState(0);

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

    console.log("Mode ==>", mode)

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


    const {
        token: { colorBgContainer },
    } = theme.useToken()

    return <Layout style={{ backgroundColor: colorBgContainer }}>
        <Flex className="h-auto min-h-[600px]">
            <Flex className="w-[230px] items-center">
                <Steps
                    direction="vertical"
                    progressDot={customDot}
                    current={current}
                    items={items}
                    onChange={onChange}
                />
            </Flex>
            <Flex className="w-full">
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
                <Flex>
                    <Image src={FactCheckers} width={25} height={25} alt="sponsored" />
                    <Typography.Text>4 Fact Checkers</Typography.Text>
                </Flex>
            ),
            span: 3,

        },
        {
            key: '12',
            label: 'Minimum Evidence',
            children: (
                <Flex>
                    <Image src={FactCheckers} width={25} height={25} alt="sponsored" />
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
    const {
        token: { colorBgContainer },
    } = theme.useToken()
    return <Layout style={{ backgroundColor: colorBgContainer }}>
        <Flex className="flex-col">
            <Flex className="border border-red-400 justify-between">
                <Flex>
                    <Card>
                        Credential
                    </Card>
                </Flex>
                <Flex>
                    <Card>
                        <Statistic
                            title="Active"
                            value={11.28}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Flex>
            </Flex>
            {/* <Flex onClick={() => console.log()} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
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
            </Flex> */}
            <Flex className="border border-yellow-500 flex-col">
                Wallet Balance
                Amount of the Campaign Sponsorship
                Source Currency
                Destination Currency

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
    const [current, setCurrent] = useState(0);

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
            <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: colorBgContainer }}>
                <Link href="/">
                    <Image alt="TDBunk" src={Logo} width={150} height={150} />
                </Link>
                <Flex className="w-full flex items-end justify-end gap-4">
                    {/* <Link href="/start/campaign">
                        <Button>Start Campaign</Button>
                    </Link> */}
                    <Link href="/start/debunking">
                        <Button>Start Debunking</Button>
                    </Link>
                    <Link href="/sponsor">
                        <Button>Sponsor Campaign</Button>
                    </Link>
                </Flex>
            </Header>
            <Flex className=" items-center flex-col pt-12 gap-5 h-auto mb-4">
                <Flex className="w-1/2 justify-center">
                    <Image alt="Start Campaign" src={StartCampaign} width={300} height={300} />
                </Flex>
                <Flex className="w-1/2">
                    <Card className="w-full">
                        <Steps current={current} items={items} />
                    </Card>
                </Flex>
                <Flex className="w-1/2 h-auto min-h-[750px]">
                    <Card className="w-full">
                        {steps[current].content}
                    </Card>
                </Flex>
                <Flex className="w-1/2 justify-between">
                    {isNotFirstStep ? <Button onClick={() => prev()}>Back</Button> : <Button className="opacity-0 cursor-none pointer-events-none" />}
                    {hasMoreSteps && <Button type="primary" onClick={() => next()}>Next</Button>}
                    {isLastStep && <Button type="primary" onClick={() => handleDone()}>Done</Button>}
                </Flex>
            </Flex>
            <Flex className='border p-4'>Footer</Flex>
        </Layout>
    );
}

