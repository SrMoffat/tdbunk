"use client"
import { Card1, Card2, Card3, Card4, Card5, Create, Import, Logo, LogoIcon, Request, StartCampaign } from '@/app/components/atoms/Icon';
import { CopyOutlined, CopyFilled } from '@ant-design/icons';
import { Button, Flex, Layout, Modal, Segmented, Steps, List, Collapse, theme, Typography, CollapseProps, } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import countries from '@/public/countries.json'

const country = countries.filter((entry) => entry?.countryCode === "KE")[0]

const { Header } = Layout

const FinancialInstitutionCredential = () => {
    return (
        <Flex className="h-[200px]">
            <Flex className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="card" src={Card1} width={300} height={300} />
                <Flex className="absolute left-2 top-2 flex-col">
                    <Image alt="LogoIcon" src={LogoIcon} width={100} height={100} />
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

const GovernmentInstitutionCredential = () => {
    return (
         <Flex className="h-[200px]">
            <Flex className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="Card2" src={Card2} width={300} height={300} />
                <Flex className="absolute right-4 top-2 flex-col">
                    <Image alt="LogoIcon" src={LogoIcon} width={100} height={100} />
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

const ProfessionalInstitutionCredential = () => {
    return (
         <Flex className="h-[200px]">
            <Flex className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="Card3" src={Card3} width={300} height={300} />
                <Flex className="absolute right-4 top-20 flex-col">
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>James Does</Typography.Text>
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>{`${country?.countryName} ${country?.flag}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 10, marginTop: 10, textAlign: "right" }}>Expires in 30 days</Typography.Text>
                </Flex>
            </Flex>
        </Flex>
    )
}

const EducationalInstitutionCredential = () => {
    return (
        <Flex className="h-[200px]">
            <Flex className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="Card4" src={Card4} width={300} height={300} />
                <Flex className="absolute right-4 top-20 flex-col">
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>James Does</Typography.Text>
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>{`${country?.countryName} ${country?.flag}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 10, marginTop: 10, textAlign: "right" }}>Expires in 30 days</Typography.Text>
                </Flex>
            </Flex>
        </Flex>
    )
}

const MedicalInstitutionCredential = () => {
    return (
         <Flex className="h-[200px]">
            <Flex className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
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

export default function StartCampaignPage() {
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const [mode, setMode] = useState('');
    const [open, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
    const draggleRef = useRef<HTMLDivElement>(null);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = (e: React.MouseEvent<HTMLElement>) => {
        setOpen(false);
    };

    const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
        setOpen(false);
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


    console.log("Mode", mode)

    const RequestCredential = () => {

        const items: CollapseProps['items'] = [
            {
                key: '1',
                label: 'Financial Insitution',
                children: <FinancialInstitutionCredential />
                // <Flex className="flex-col">
                //     <Flex>Name</Flex>
                //     <Flex>Website</Flex>
                //     <Flex>DID <CopyOutlined /></Flex>
                //     <Flex>
                //         <Button type="primary" size="small">Request</Button>
                //     </Flex>
                // </Flex>,
            },
            {
                key: '2',
                label: 'Government Institution',
                children: <GovernmentInstitutionCredential />

                // <Flex className="flex-col">
                //     <Flex>Name</Flex>
                //     <Flex>Website</Flex>
                //     <Flex>DID <CopyOutlined /></Flex>
                //     <Flex>
                //         <Button type="primary" size="small">Request</Button>
                //     </Flex>
                // </Flex>,
            },
            {
                key: '3',
                label: 'Professional Institution',
                children: <ProfessionalInstitutionCredential />

                // <Flex className="flex-col">
                //     <Flex>Name</Flex>
                //     <Flex>Website</Flex>
                //     <Flex>DID <CopyOutlined /></Flex>
                //     <Flex>
                //         <Button type="primary" size="small">Request</Button>
                //     </Flex>
                // </Flex>,
            },
            {
                key: '4',
                label: 'Educational Institution',
                children: <EducationalInstitutionCredential />

                // <Flex className="flex-col">
                //     <Flex>Name</Flex>
                //     <Flex>Website</Flex>
                //     <Flex>DID <CopyOutlined /></Flex>
                //     <Flex>
                //         <Button type="primary" size="small">Request</Button>
                //     </Flex>
                // </Flex>,
            },
            {
                key: '5',
                label: 'Medical Institution',
                children: <MedicalInstitutionCredential />

                // <Flex className="flex-col">
                //     <Flex>Name</Flex>
                //     <Flex>Website</Flex>
                //     <Flex>DID <CopyOutlined /></Flex>
                //     <Flex>
                //         <Button type="primary" size="small">Request</Button>
                //     </Flex>
                // </Flex>,
            },
        ];

        return (
            <Flex className="flex-col mt-4">
                <Typography.Text className="font-bold mb-4">Verifiable Credential Issuers</Typography.Text>
                <Collapse items={items} />

            </Flex>
        )
    }

    const CreateCredential = () => {
        return (
            <Flex>
                Create Credential

                Email
                Country
                Password?
            </Flex>
        )
    }

    const ImportCredential = () => {
        return (
            <Flex>
                Import Credential

                Copy/Paste DID Document?
                Scan QR Code?
            </Flex>
        )
    }

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
                    <Flex className="-mt-2">Credentials</Flex>
                </Flex>
            </Flex>
        ),
        value: name
    }))

    const isRequest = mode === options[0]?.value
    const isCreate = mode === options[1]?.value
    const isImport = mode === options[2]?.value

    return (
        <Layout style={{ height: '100vh' }}>
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
            <Flex className="h-full items-center flex-col pt-12 gap-5">
                <Image alt="Start Campaign" src={StartCampaign} width={300} height={300} />
                <Flex className="w-1/2 mt-6">
                    <Steps
                        items={
                            [
                                {
                                    title: 'Credentials',
                                    status: 'wait',
                                },
                                {
                                    title: 'Campaign Details',
                                    status: 'wait',
                                },
                                {
                                    title: 'Verify Details',
                                    status: 'wait',
                                },
                                {
                                    title: 'Start Campaign',
                                    status: 'wait',
                                },
                            ]}
                    />
                </Flex>
                <Flex className="w-1/2 h-full mt-32 justify-center">
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
                <Flex className="justify-between w-1/2">
                    <Button type="primary">Back</Button>
                    <Button type="primary">Next</Button>
                </Flex>
            </Flex>
            <Modal
                width={1000}
                title={
                    <div
                        style={{ width: '100%', cursor: 'move' }}
                        onMouseOver={() => {
                            if (disabled) {
                                setDisabled(false);
                            }
                        }}
                        onMouseOut={() => {
                            setDisabled(true);
                        }}
                        // fix eslintjsx-a11y/mouse-events-have-key-events
                        // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
                        onFocus={() => { }}
                        onBlur={() => { }}
                    // end
                    >

                        {isRequest && (
                            <Flex className="items-center gap-3 justify-center">
                                <Typography.Title level={4}>Request Credential</Typography.Title>
                                <Image className="-mt-4" alt="Request" src={Request} width={40} height={40} />
                            </Flex>
                        )}
                        {isCreate && (
                            <Flex className="items-center gap-3 justify-center">
                                <Typography.Title level={4}>Create Credential</Typography.Title>
                                <Image className="-mt-4" alt="Create" src={Create} width={40} height={40} />
                            </Flex>
                        )}
                        {isImport && (
                            <Flex className="items-center gap-3 justify-center">
                                <Typography.Title level={4}>Import Credential</Typography.Title>
                                <Image className="-mt-4" alt="Import" src={Import} width={40} height={40} />
                            </Flex>
                        )}
                    </div>
                }
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                modalRender={(modal) => (
                    <Draggable
                        disabled={disabled}
                        bounds={bounds}
                        nodeRef={draggleRef}
                        onStart={(event, uiData) => onStart(event, uiData)}
                    >
                        <div ref={draggleRef}>{modal}</div>
                    </Draggable>
                )}
            >
                {isRequest && <RequestCredential />}
                {isCreate && <CreateCredential />}
                {isImport && <ImportCredential />}
            </Modal>
            <div className="border w-full p-12 mt-12 flex">Footer</div>
        </Layout>
    );
}

