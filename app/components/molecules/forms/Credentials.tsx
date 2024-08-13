import { DebounceSelect } from '@/app/components/atoms';
import useBrowserStorage from '@/app/hooks/useLocalStorage';
import { FieldType, generateVc } from '@/app/lib/api';
import { useWeb5Context } from '@/app/providers/Web5Provider';
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';

export interface UserValue {
    label: string;
    value: string;
}

export type UserStorage = {} | null


const CredentialsForm: React.FC = () => {
    const { walletDid } = useWeb5Context()
    const [isLoading, setIsLoading] = useState(false)
    const [value, setValue] = useState<UserValue[]>([]);
    const [data, setLocalUser,] = useBrowserStorage<UserStorage>(
        'TDBunk',
        'local'
    )

    const generateCredential = async (details: any) => {
        setIsLoading(true)
        try {
            const vc = await generateVc({
                ...details,
                did: walletDid
            })

            if (data) {
                console.log("check data 1", data)
                // Check it
                const details = data as any
                const hasVCs = details?.vCs?.length

                if (hasVCs) {
                    // Append
                    console.log("check data 2", hasVCs)
                    setLocalUser({
                        vCs: [...details?.vCs, vc],
                    })
                } else {
                    // Add this one
                    console.log("check data 3", hasVCs)
                    setLocalUser({
                        vCs: [vc],
                    })
                }
            } else {
                console.log("check data 4", data)
                setLocalUser({
                    vCs: [vc],
                    did: walletDid
                })
            }
            console.log("vc", { vc, did: walletDid, data })
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

    return (
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
};

export default CredentialsForm;
