import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, Space } from 'antd';
import { DidDht } from '@web5/dids'
import DebounceSelect from '@/app/components/atoms/DebounceSelect';

interface UserValue {
    label: string;
    value: string;
}

const SignupForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)

    const generateCredential = async (details: any) => {
        setIsLoading(true)

        const response = await fetch('/api/credentials', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(details)
        })

        const data = await response.json()

        console.log("Generate Credentials ---....", data)

        // // Creates a DID using the DHT method and publishes the DID Document to the DHT
        // const didDht = await DidDht.create({
        //     options: {
        //         publish: true
        //     }
        // });
        // console.log("DID", didDht)
        // // DID and its associated data which can be exported and used in different contexts/apps
        // const portableDid = await didDht.export()
        // console.log("portableDid", portableDid)

        // // DID string
        // const did = didDht.uri;
        // console.log("did string", did)

        // // DID Document
        // const didDocument = JSON.stringify(didDht.document);
        // console.log("didDocument", didDocument)
        setIsLoading(false)
    }

    type FieldType = {
        email?: string;
        country?: string;
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values);
        await generateCredential({
            name: values?.email,
            country: values?.country
        })
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const [value, setValue] = useState<UserValue[]>([]);

    async function fetchUserList(countryName: string): Promise<UserValue[]> {
        const response = await fetch('countries.json')
        const data = await response.json()
        const similar = data.filter((country: any) => country?.countryName.toLowerCase().includes(countryName))
        console.log('fetching user', {
            countryName,
            similar
        });

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
