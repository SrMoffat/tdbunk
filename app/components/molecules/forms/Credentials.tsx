import { DebounceSelect } from '@/app/components/atoms';
import useBrowserStorage from '@/app/hooks/useLocalStorage';
import { FieldType, generateVc } from '@/app/lib/api';
import { parseJwtToVc } from '@/app/lib/web5';
import { useWeb5Context } from '@/app/providers/Web5Provider';
import type { FormProps } from 'antd';
import { Button, Flex, Form, Input, Typography } from 'antd';
import React, { useState } from 'react';
import FinancialInstitutionCredential from '@/app/components/molecules/cards/FinancialCredential';
import { useTbdexContext } from '@/app/providers/TbdexProvider';
import { CREDENTIALS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY } from '@/app/lib/constants';
import countries from "@/public/countries.json";

export interface UserValue {
    label: string;
    value: string;
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
    const [isLoading, setIsLoading] = useState(false)
    const [value, setValue] = useState<UserValue[]>([]);
    const [localStorageData, setLocalCredentials] = useBrowserStorage<CredentialStorage>(
        CREDENTIALS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )

    const createOrUpdateCredentials = async (details: any) => {
        setIsLoading(true)

        if (localStorageData) {
            // @ts-ignore
            const existingCreds = localStorageData?.credentials
            console.log("Existing credentials", existingCreds)

        } else {
            const defaultCurrencyFromCredential = countries.filter(({ countryCode }) => countryCode === details?.country?.value)[0]?.currencyCode
            console.log("default currency from credential", defaultCurrencyFromCredential)
            const vc = await generateVc({
                ...details,
                did: walletDid
            })

            const parsedVc = parseJwtToVc(vc)

            const vcGranularTypes = parsedVc?.vcDataModel?.type
            const vcConcatenateTypes = vcGranularTypes.join(":")

            const storedVc = {
                [vcConcatenateTypes]: [vc]
            }

            console.log("Data does not existss created VC", {
                vc, parsedVc, vcConcatenateTypes, storedVc
            })

            setLocalCredentials({
                did: walletDid,
                credentials: storedVc,
                defaultCurrency: defaultCurrencyFromCredential,
            })
            setCredentials?.(storedVc)
            // setSelectedCurrency?.(defaultCurrencyFromCredential)
        }
    }

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
        await generateCredential(values)
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
                            <Button type="primary" htmlType="submit" loading={isLoading}>
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
