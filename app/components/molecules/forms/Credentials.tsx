import { DebounceSelect } from '@/app/components/atoms';
import FinancialInstitutionCredential from '@/app/components/molecules/cards/FinancialCredential';
import useBrowserStorage from '@/app/hooks/useLocalStorage';
import { FieldType, generateVc } from '@/app/lib/api';
import { CREDENTIALS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY } from '@/app/lib/constants';
import { parseJwtToVc } from '@/app/lib/web5';
import { useTbdexContext } from '@/app/providers/TbdexProvider';
import { useWeb5Context } from '@/app/providers/Web5Provider';
import countries from "@/public/countries.json";
import {
    useMutation
} from '@tanstack/react-query';
import type { FormProps } from 'antd';
import { Button, Flex, Form, Input, Typography, notification, Space } from 'antd';
import React, { useState } from 'react';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface UserValue {
    label: string;
    value: string;
}
export interface NotificationDetails {
    message: string;
    description: string
}

export interface CredentialsFormProps {
    nextButtonDisabled: boolean;
    setNextButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

export type CredentialStorage = {} | null

const CredentialsForm: React.FC<CredentialsFormProps> = ({
    nextButtonDisabled,
    setNextButtonDisabled
}) => {
    const { walletDid } = useWeb5Context()
    const { setCredentials, setSelectedCurrency } = useTbdexContext()

    const [api, contextHolder] = notification.useNotification();
    const [localStorageData, setLocalCredentials] = useBrowserStorage<CredentialStorage>(
        CREDENTIALS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )

    const [isLoading, setIsLoading] = useState(false)
    const [value, setValue] = useState<UserValue[]>([]);

    const openNotificationWithIcon = (type: NotificationType, { message, description }: NotificationDetails) => {
        api[type]({
            message,
            description
        });
    };

    const createOrUpdateCredentials = async (details: any) => {
        try {
            console.log("Sikhelelaa", details)
        } catch (error: any) {
            console.log("createOrUpdateCredentials here", error)
        }
        // setIsLoading(true)

        // if (localStorageData) {
        //     // @ts-ignore
        //     const existingCreds = localStorageData?.credentials
        //     console.log("Existing credentials", existingCreds)

        // } else {
        //     const defaultCurrencyFromCredential = countries.filter(({ countryCode }) => countryCode === details?.country?.value)[0]?.currencyCode
        //     console.log("default currency from credential", defaultCurrencyFromCredential)
        //     const vc = await generateVc({
        //         ...details,
        //         did: walletDid
        //     })

        //     const parsedVc = parseJwtToVc(vc)

        //     const vcGranularTypes = parsedVc?.vcDataModel?.type
        //     const vcConcatenateTypes = vcGranularTypes.join(":")

        //     const storedVc = {
        //         [vcConcatenateTypes]: [vc]
        //     }

        //     console.log("Data does not existss created VC", {
        //         vc, parsedVc, vcConcatenateTypes, storedVc
        //     })

        //     setLocalCredentials({
        //         did: walletDid,
        //         credentials: storedVc,
        //         defaultCurrency: defaultCurrencyFromCredential,
        //     })
        //     setCredentials?.(storedVc)
        //     // setSelectedCurrency?.(defaultCurrencyFromCredential)
        // }
    }

    const { isPending, mutateAsync: createCredentials } = useMutation({
        mutationFn: createOrUpdateCredentials,
        onSuccess: () => {
            openNotificationWithIcon('success', {
                message: 'Credential Created!',
                description: 'Your credential has been sucesfully created!'
            })
        },
        onError: () => {
            openNotificationWithIcon('error', {
                message: 'Credential Creation Failed!',
                description: 'Something went wrong. Please try again.'
            })
        }
    })

    const generateCredential = async (details: any) => {
        setIsLoading(true)

        try {
            await createOrUpdateCredentials(details)
        } catch (error: any) {
            console.log("Request errored here", error)
        } finally {
            setIsLoading(false)
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setNextButtonDisabled(false)
        await createCredentials(values)
        // await generateCredential(values)
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        setNextButtonDisabled(true)
        console.log('Failed:', errorInfo);
    };

    async function fetchUserList(countryName: string): Promise<UserValue[]> {
        const response = await fetch('/countries.json')
        const data = await response.json()

        const similar = data.filter((country: any) => country?.countryName.toLowerCase().includes(countryName.toLowerCase()))

        return similar.map(({ countryName, flag, countryCode }: any) => ({
            label: `${countryName} ${flag}`,
            value: countryCode
        }))
    }




    // @ts-ignore
    const existingCreds = localStorageData?.credentials

    return (
        <Flex className="flex-col">
            {contextHolder}
            {!existingCreds && <Typography.Text className="font-bold mb-4">Create Credential</Typography.Text>}
            {existingCreds
                ? (
                    <Flex className="w-full justify-center">
                        <Flex className="w-1/6">
                            <FinancialInstitutionCredential existingCreds={existingCreds} />
                        </Flex>
                    </Flex>
                )
                : (
                    <Form
                        name="basic"
                        layout="vertical"
                        className='w-full'
                        autoComplete="off"
                        onFinish={onFinish}
                        initialValues={{ remember: true }}
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
