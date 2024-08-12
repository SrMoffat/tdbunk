import { DebounceSelect } from '@/app/components/atoms';
import { FieldType, generateVc } from '@/app/lib/api';
import { parseJwtToVc } from '@/app/lib/web5';
import { useWeb5Context } from '@/app/providers/Web5Provider';
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';

export interface UserValue {
    label: string;
    value: string;
}

const CredentialsForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { walletDid } = useWeb5Context()
    const [value, setValue] = useState<UserValue[]>([]);

    const generateCredential = async (details: any) => {
        setIsLoading(true)
        try {
            console.log("Details", details)
            const vc = await generateVc({
                ...details,
                did: walletDid
            })
            const parsedVc = await parseJwtToVc(vc)

            console.log("vc", { vc, parsedVc })

            //     // Check if the user has any other credentials we set in the browser
            //     localStorage.setItem(`tdbunk:${details?.email}`, JSON.stringify({
            //         portableDid: omit(portableDid, 'privateKeys'),
            //         keyUri,
            //         vc
            //     }))
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
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className='w-full'
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
