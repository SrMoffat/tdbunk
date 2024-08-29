"use client"
import { Create, Import, Request } from '@/app/components/atoms/Icon';
import CredentialDocumentDrawer from '@/app/components/molecules/drawers';
import CreateCredential from '@/app/components/molecules/forms/CreateCredential';
import ImportCredential from '@/app/components/molecules/forms/ImportCredential';
import RequestCredential from '@/app/components/molecules/forms/RequestCredential';
import useBrowserStorage from '@/app/hooks/useLocalStorage';
import { CREDENTIALS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY } from '@/app/lib/constants';
import { useWeb5Context } from '@/app/providers/Web5Provider';
import countries from '@/public/countries.json';
import { Flex, Layout, Segmented, theme } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';

export interface UserStorage { }

export interface StepOneProps {
    nextButtonDisabled: boolean;
    setNextButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

export enum CredentialMode {
    CREATE = 'Create',
    REQUEST = 'Request',
    IMPORT = 'Import',
}

export const STEP_ONE_TAB_OPTIONS = [
    {
        name: CredentialMode.CREATE,
        icon: Create
    },
    {
        name: CredentialMode.REQUEST,
        icon: Request
    },
    {
        name: CredentialMode.IMPORT,
        icon: Import
    }
]

const StepOne: React.FC<StepOneProps> = ({
    nextButtonDisabled,
    setNextButtonDisabled
}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false)
    const [mode, setMode] = useState<CredentialMode>(CredentialMode.CREATE);

    const { credentials: existingStateCreds } = useWeb5Context()
    const [localStorageData] = useBrowserStorage<UserStorage>(
        CREDENTIALS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const isCreate = mode === CredentialMode.CREATE
    const isRequest = mode === CredentialMode.REQUEST
    const isImport = mode === CredentialMode.IMPORT

    // @ts-ignore
    const existingLocalStorageCreds = localStorageData?.credentials

    const noCredentialsFound = !existingLocalStorageCreds && !existingStateCreds?.length

    console.log("Data", {
        noCredentialsFound,
        existingStateCreds,
        existingLocalStorageCreds
    })

    const options = STEP_ONE_TAB_OPTIONS.map(({ name, icon }) => ({
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
                        // showModal()
                    }}
                    options={options}
                    disabled={!nextButtonDisabled}
                    style={{ backgroundColor: "#334155", height: 118 }}
                />
            </Flex>
            {
                isCreate && <CreateCredential
                    nextButtonDisabled={nextButtonDisabled}
                    setNextButtonDisabled={setNextButtonDisabled} />
            }
            {isRequest && <RequestCredential showDrawer={showDrawer} />}
            {isImport && <ImportCredential />}
        </Layout>
    );
};

export default StepOne;
