import DebounceSelect from '@/app/components/atoms/DebounceSelect';
import { DidDht } from '@web5/dids';
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';

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
    // Creates a DID using the DHT method and publishes the DID Document to the DHT
    const didDht = await DidDht.create({
        options: {
            publish: true
        }
    });
    // DID and its associated data which can be exported and used in different contexts/apps
    const portableDid = await didDht.export()
    return {
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

const SignupForm: React.FC = () => {
    const [value, setValue] = useState<UserValue[]>([]);
    const [isLoading, setIsLoading] = useState(false)

    const generateCredential = async (details: any) => {
        setIsLoading(true)
        try {
            const { portableDid } = await generateDid()
            const vc = await generateVc({
                ...details,
                did: portableDid.uri
            })

            console.log("Generate Credentials ---....", vc)

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
        const response = await fetch('countries.json')
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
                <Input placeholder='Enter your email' allowClear />
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
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
};

export default SignupForm;
