"use client"
import { Create, Import, Request } from '@/app/components/atoms/Icon';
import CredentialDocumentDrawer from '@/app/components/molecules/drawers';
import CreateCredential from '@/app/components/molecules/forms/CreateCredential';
import ImportCredential from '@/app/components/molecules/forms/ImportCredential';
import RequestCredential from '@/app/components/molecules/forms/RequestCredential';
import useBrowserStorage from '@/app/hooks/useLocalStorage';
import { CREDENTIAL_TYPES, CREDENTIALS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY } from '@/app/lib/constants';
import { useWeb5Context } from '@/app/providers/Web5Provider';
import countries from '@/public/countries.json';
import { Web5 } from '@web5/api';
import { BearerDid } from '@web5/dids';
import { Flex, Layout, Segmented, theme } from 'antd';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { BearerIdentity } from '@web5/agent';


export interface UserStorage { }

export interface StepOneProps {
    nextButtonDisabled: boolean;
    setNextButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    setUserDid: React.Dispatch<React.SetStateAction<string | null>> | undefined;
    setWeb5Instance: React.Dispatch<React.SetStateAction<Web5 | null>> | undefined;
    setCredentials: React.Dispatch<React.SetStateAction<{ [x: string]: any[]; }>> | undefined;
    setRecoveryPhrase: React.Dispatch<React.SetStateAction<string | null | undefined>> | undefined;
    setUserBearerDid: React.Dispatch<React.SetStateAction<BearerDid | BearerIdentity | null | undefined>> | undefined;
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

    setUserDid,
    setCredentials,
    setWeb5Instance,
    setUserBearerDid,
    setRecoveryPhrase,
    setNextButtonDisabled
}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false)
    const [noCredentials, setNoCredentials] = useState<boolean>(true);
    const [hasRequiredCredentials, setHasRequiredCredentials] = useState<boolean>(false);
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



    // console.log("Data", {
    //     noCredentialsFound,
    //     existingStateCreds,
    //     existingLocalStorageCreds
    // })


    // @ts-ignore
    const existingLocalStorageCreds = localStorageData?.credentials

    useEffect(() => {
        if (existingLocalStorageCreds) {
            const allCredentials = Object.values(existingLocalStorageCreds)
            const localCredentials = allCredentials.flat()

            const localCreds = localCredentials.length > 0

            if (localCreds) {
                setNoCredentials(false)
            }

            const allCredentialTypes = Object.keys(existingLocalStorageCreds)[0]
            const localCredentialType = allCredentialTypes?.split(":")[1]
            const isKcc = localCredentialType === CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL

            setHasRequiredCredentials(isKcc)

            console.log("Something needs to be updated and local has?/", {
                isKcc,
                noCredentials,
                allCredentials,
                localCredentials,
                existingStateCreds,
                existingLocalStorageCreds
            })

        } else if (existingStateCreds) {
            const allCredentials = Object.values(existingStateCreds)
            const stateCredentials = allCredentials.flat()

            const stateCreds = stateCredentials.length > 0

            if (stateCreds) {
                setNoCredentials(false)
            }

            const allCredentialTypes = Object.keys(existingStateCreds)[0]
            const stateCredentialType = allCredentialTypes?.split(":")[1]
            const isKcc = stateCredentialType === CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL

            setHasRequiredCredentials(isKcc)

            console.log("Something needs to be updated and state has?/", {
                isKcc,
                noCredentials,
                allCredentials,
                stateCredentials,
                existingStateCreds,
                existingLocalStorageCreds
            })
        }


    }, [existingStateCreds, existingLocalStorageCreds])

    useEffect(() => {
        const noCredentialsFound = !existingLocalStorageCreds && !existingStateCreds?.length

        if (noCredentialsFound) {
            console.log("No credentials found")
            setNoCredentials(noCredentialsFound)
        } else {
            setNoCredentials(false)
            console.log("Credentials found pick?", {
                existingLocalStorageCreds,
                existingStateCreds
            })
        }
    }, [])

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

    const commonProps = {
        noCredentialsFound: noCredentials,
        stateCredentials: existingStateCreds,
        nextButtonDisabled,
        hasRequiredCredentials,
        localStorageCredentials: existingLocalStorageCreds,

        setUserDid,
        setCredentials,
        setWeb5Instance,
        setUserBearerDid,
        setRecoveryPhrase,
        setNextButtonDisabled
    }
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
                    disabled={!nextButtonDisabled || !noCredentials}
                    style={{ backgroundColor: "#334155", height: 118 }}
                />
            </Flex>
            {
                isCreate && <CreateCredential
                    {...commonProps}
                />
            }
            {isRequest && <RequestCredential
                {...commonProps}
                showDrawer={showDrawer}
            />}
            {isImport && <ImportCredential />}
        </Layout>
    );
};

export default StepOne;
