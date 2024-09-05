import { DebounceSelect } from '@/app/components/atoms';
import FinancialInstitutionCredential from '@/app/components/molecules/cards/FinancialCredential';
import { CreateCredentialProps } from '@/app/components/molecules/forms/CreateCredential';
import useBrowserStorage from '@/app/hooks/useLocalStorage';
import { fetchUserList, FieldType, generateUltimateIdentifierVc, UserValue } from '@/app/lib/api';
import { CREDENTIALS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY, WALLET_LOCAL_STORAGE_KEY } from '@/app/lib/constants';
import { getCurrencyFromCountry } from '@/app/lib/utils';
import { initWeb5, parseJwtToVc, storeVcJwtInDwn } from '@/app/lib/web5';
import { useNotificationContext } from '@/app/providers/NotificationProvider';
import { useTbdexContext } from '@/app/providers/TbdexProvider';
import { useWeb5Context } from '@/app/providers/Web5Provider';
import countries from '@/public/countries.json';
import { useMutation } from '@tanstack/react-query';
import type { FormProps } from 'antd';
import { Button, Flex, Form, Input, Typography } from 'antd';
import React, { useState, useEffect } from 'react';

export type CredentialStorage = {} | null

export type WalletStorage = {} | null

export interface CreateCredentialFormDetails {
    email?: string | undefined;
    password?: string | undefined;
    country?: any
}

const CredentialsForm: React.FC<CreateCredentialProps> = ({
    stateCredentials,
    noCredentialsFound,
    nextButtonDisabled,
    isCreatingCredential,
    localStorageCredentials,

    setUserDid,
    setCredentials,
    setWeb5Instance,
    setUserBearerDid,
    setRecoveryPhrase,
    setNextButtonDisabled,
    setIsCreatingCredential
}) => {
    const { userDid } = useWeb5Context()
    const { setSelectedCurrency } = useTbdexContext()
    const { notify } = useNotificationContext()

    const [localStorageData, setLocalCredentials] = useBrowserStorage<CredentialStorage>(
        CREDENTIALS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )
    const [_, setLocalWallet] = useBrowserStorage<WalletStorage>(
        WALLET_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )

    const [value, setValue] = useState<UserValue[]>([]);
    // const [credentials, setCredentials] = useState<{ [x: string]: any[]; }>({});


    const createOrUpdateCredentials = async (details: CreateCredentialFormDetails) => {
        try {
            if (noCredentialsFound) {
                // Recheck local storage?
                const local = localStorageData as any
                const localCreds = local?.credentials

                if (localCreds) {
                    const hasCreds = localCreds.length
                    console.log("Found creds in local storage", {
                        hasCreds,
                        details,
                        stateCredentials,
                        localStorageCredentials
                    })
                } else {
                    // Get currency
                    const defaultCurrencyFromCredential = getCurrencyFromCountry(countries, details?.country?.value)

                    // Create DWN and Did
                    const { web5, did, bearerDid, recoveryPhrase } = await initWeb5({
                        password: details?.password as string
                    })

                    setUserDid?.(did)
                    setWeb5Instance?.(web5)
                    setUserBearerDid?.(bearerDid)
                    setRecoveryPhrase?.(recoveryPhrase)

                    // Create new credential
                    const vc = await generateUltimateIdentifierVc({
                        ...details,
                        did
                    })

                    // Parse VC to get metadata
                    const parsedVc = parseJwtToVc(vc)

                    const vcGranularTypes = parsedVc?.vcDataModel?.type
                    const vcConcatenateTypes = vcGranularTypes.join(":")

                    const storedVc = {
                        [vcConcatenateTypes]: [vc]
                    }

                    // Store formatted VC in state and local storage
                    // To Do: Best practices around this? Maybe store VCs in DWN?
                    setCredentials?.(storedVc)
                    setLocalCredentials({
                        did,
                        credentials: storedVc,
                        defaultCurrency: defaultCurrencyFromCredential,
                    })
                    // To Do: Persist bearer did somehow
                    // localStorage.setItem('TDBunk:BearerDid', JSON.stringify(bearerDid))
                    setNextButtonDisabled(false)

                    const status = await storeVcJwtInDwn(web5, vc, did)

                    console.log("Data does not existss created VC", {
                        vc, parsedVc, vcConcatenateTypes, storedVc,
                        setSelectedCurrency,
                        userDid,
                        did,
                        storedVcResponse: status
                    })

                    console.log("Create new credential", {
                        details,
                        web5,
                        did,
                        recoveryPhrase,
                        bearerDid,
                        stateCredentials,
                        localStorageCredentials,
                        defaultCurrencyFromCredential
                    })
                }
            } else {
                // Credentials found, check to avoid duplicates?
                console.log("Credentials found, check to avoid duplicates?", {
                    details,
                    stateCredentials,
                    localStorageCredentials
                })
            }
        } catch (error: any) {
            console.log("createOrUpdateCredentials here", error)
        }
    }

    const { isPending, mutateAsync: createCredentials } = useMutation({
        mutationFn: createOrUpdateCredentials,
        onSuccess: () => {
            setNextButtonDisabled(false)
            notify?.('success', {
                message: 'Credential Created!',
                description: 'Your credential has been sucesfully created!'
            })
        },
        onError: () => {
            setNextButtonDisabled(true)
            notify?.('error', {
                message: 'Credential Creation Failed!',
                description: 'Something went wrong. Please try again.'
            })
        }
    })

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        await createCredentials(values)
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        setNextButtonDisabled(true)
        console.log('Failed:', errorInfo);
    };

    // useEffect(() => {
    //     console.log("Create credential form mounted", { stateCredentials, localStorageCredentials })
    // }, [])

    useEffect(() => {
        setIsCreatingCredential(isPending)
    }, [isPending])

    return (
        <Flex className="flex-col">
            {noCredentialsFound && <Typography.Text className="font-bold mb-4">Create Credential</Typography.Text>}
            {!noCredentialsFound
                ? (
                    <Flex className="w-full justify-center">
                        <Flex className="w-1/6">
                            <FinancialInstitutionCredential
                                stateCredentials={stateCredentials}
                                localStorageCredentials={localStorageCredentials}
                            />
                        </Flex>
                    </Flex>
                )
                : (
                    <Form
                        name="createCredential"
                        layout="vertical"
                        className='w-full'
                        autoComplete="off"
                        onFinish={onFinish}
                        disabled={isCreatingCredential}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item<FieldType>
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input type='email' size='large' placeholder='Enter your email' allowClear />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password type='password' size='large' placeholder='Enter your password' allowClear />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Country"
                            name="country"
                            rules={[{ required: true, message: 'Please input your country of residence!' }]}
                        >
                            <DebounceSelect
                                value={value}
                                placeholder="Select your country"
                                fetchOptions={fetchUserList}
                                onChange={(newValue) => {
                                    setValue(newValue as UserValue[]);
                                }}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={isPending}>
                                Create
                            </Button>
                        </Form.Item>
                    </Form>
                )
            }
        </Flex>
    )
};

export default CredentialsForm;
