"use client"
import { Create, Import, Request } from '@/app/components/atoms/Icon';
import {
    CredentialIssuerCard,
    EducationCredentialCard,
    // FinancialCredentialCard,
    GovernmentCredentialCard,
    MedicalCredentialCard,
    ProfessionalCredentialCard
} from '@/app/components/molecules/cards';
import CredentialsForm from '@/app/components/molecules/forms/Credentials';
import countries from '@/public/countries.json';
import { CopyFilled, CopyOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Collapse, CollapseProps, Drawer, Flex, Input, Layout, message, QRCode, Segmented, Tabs, theme, Typography, Upload } from 'antd';
import Image from 'next/image';
import { useState } from 'react';

const { TextArea } = Input;
const { Dragger } = Upload;

const StepOne = () => {
    // Step 1
    const [mode, setMode] = useState('Request');
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false)

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

    const showDrawer = () => {
        setOpen(true);
    };

    const RequestCredential = (props: any) => {
        const { showDrawer } = props

        const items: CollapseProps['items'] = [
            {
                key: '1',
                label: 'Financial Insitution',
                children:
                    // <FinancialCredentialCard showDrawer={showDrawer} />
                <CredentialIssuerCard />
            },
            {
                key: '2',
                label: 'Government Institution',
                children:
                    <GovernmentCredentialCard showDrawer={showDrawer} />
                // <CredentialIssuer />
            },
            {
                key: '3',
                label: 'Professional Institution',
                children:
                    <ProfessionalCredentialCard showDrawer={showDrawer} />
                // <CredentialIssuer />
            },
            {
                key: '4',
                label: 'Educational Institution',
                children:
                    <EducationCredentialCard showDrawer={showDrawer} />
                // <CredentialIssuer />
            },
            {
                key: '5',
                label: 'Medical Institution',
                children:
                    <MedicalCredentialCard showDrawer={showDrawer} />
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
        setOpen(false);
    };
    return (
        <Layout style={{ backgroundColor: colorBgContainer }}>
            <Drawer title="Credential Document" onClose={onClose} open={open} width={1000}>
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
    );
};

export default StepOne;
