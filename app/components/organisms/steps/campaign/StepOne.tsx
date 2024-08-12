"use client"
import { Create, Import, Request } from '@/app/components/atoms/Icon';
import CreateCredential from '@/app/components/molecules/forms/CreateCredential';
import ImportCredential from '@/app/components/molecules/forms/ImportCredential';
import RequestCredential from '@/app/components/molecules/forms/RequestCredential';
import CredentialDocumentDrawer from '@/app/components/molecules/drawers';
import countries from '@/public/countries.json';
import { Flex, Layout, Segmented, theme } from 'antd';
import Image from 'next/image';
import { useState } from 'react';

const StepOne = () => {
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

    const onClose = () => {
        setOpen(false);
    };
    return (
        <Layout style={{ backgroundColor: colorBgContainer }}>
            <CredentialDocumentDrawer
                open={open}
                copied={copied}
                data={countries}
                onClose={onClose}
                setCopied={setCopied}
            />
            <Flex className="justify-center mb-6">
                <Segmented
                    onChange={(value) => {
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
