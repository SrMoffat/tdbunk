import { DebounceSelect } from '@/app/components/atoms';
import useBrowserStorage from '@/app/hooks/useLocalStorage';
import { FieldType, generateVc } from '@/app/lib/api';
import { parseJwtToVc } from '@/app/lib/web5';
import { useWeb5Context } from '@/app/providers/Web5Provider';
import type { FormProps } from 'antd';
import { Button, Flex, Form, Input } from 'antd';
import React, { useState } from 'react';
import FinancialInstitutionCredential from '@/app/components/molecules/cards/FinancialCredential';


export interface UserValue {
    label: string;
    value: string;
}

export type UserStorage = {} | null


const CredentialsForm: React.FC = () => {
    const { walletDid } = useWeb5Context()
    const [isLoading, setIsLoading] = useState(false)
    const [value, setValue] = useState<UserValue[]>([]);
    const [showExistingCredentialModal, setShowExistingCredentialModal] = useState(false)
    const [localStorageData, setLocalUser,] = useBrowserStorage<UserStorage>(
        'TDBunk',
        'local'
    )

    const createOrUpdateCredentials = async (details: any) => {
        setIsLoading(true)

        if (localStorageData) {
            // @ts-ignore
            const existingCreds = localStorageData?.credentials
            console.log("Existing credentials", existingCreds)

        } else {
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
            setLocalUser({
                credentials: storedVc,
                did: walletDid
            })

            setShowExistingCredentialModal(true)
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
        await generateCredential(values)
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
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
        <Flex>
            {existingCreds
                ? <FinancialInstitutionCredential existingCreds={existingCreds} />
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
                            <Input size='large' placeholder='Enter your email' allowClear />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Country"
                            name="country"
                            rules={[{ required: true, message: 'Please input your country!' }]}
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
