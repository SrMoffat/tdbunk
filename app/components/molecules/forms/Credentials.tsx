import DebounceSelect from '@/app/components/atoms/DebounceSelect';
import { DidDht } from '@web5/dids';
import { Jwk, LocalKeyManager } from "@web5/crypto"
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import { omit } from 'lodash';

const localKeyManager = new LocalKeyManager();

interface UserValue {
    label: string;
    value: string;
}

interface FieldType {
    email?: string;
    country?: string;
};

type UserDetails = FieldType & {
    did: string
}

const generateDid = async () => {
    const didDht = await DidDht.create({
        keyManager: localKeyManager,
        options: {
            publish: true
        }
    });

    const portableDid = await didDht.export()

    const privateKey = portableDid?.privateKeys?.[0] as Jwk

    const keyUri = await localKeyManager.getKeyUri({
        key: privateKey
    });

    return {
        keyUri,
        didDht,
        portableDid
    }
}

const generateVc = async (data: UserDetails) => {
    const response = await fetch('/api/credentials', {
        method: 'POST',
        body: JSON.stringify(data)
    })

    const vc = await response.json()

    return vc
}

const CredentialsForm: React.FC = () => {
    const [value, setValue] = useState<UserValue[]>([]);
    const [isLoading, setIsLoading] = useState(false)

    const generateCredential = async (details: any) => {
        setIsLoading(true)
        try {
            const hasCredentials = false
            // const hasCredentials = localStorage.getItem(`tdbunk:${details?.email}`)

            if (hasCredentials) {
                console.log("Has creds", JSON.parse(hasCredentials))
                // Load credentials from key storage
            } else {
                // create new credentials
                const { portableDid, keyUri } = await generateDid()
                const vc = await generateVc({
                    ...details,
                    did: portableDid.uri
                })

                // Check if the user has any other credentials we set in the browser

                localStorage.setItem(`tdbunk:${details?.email}`, JSON.stringify({
                    portableDid: omit(portableDid, 'privateKeys'),
                    keyUri,
                    vc
                }))
            }
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
