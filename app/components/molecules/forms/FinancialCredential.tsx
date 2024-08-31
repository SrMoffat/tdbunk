import { DebounceSelect } from '@/app/components/atoms';
import { fetchUserList, FieldType, UserValue } from '@/app/lib/api';
import type { FormProps } from 'antd';
import { Flex, Form, Input } from 'antd';
import { useState } from 'react';

export interface FinancialCredentialFieldType {
    firstName?: string;
    lastName?: string;
    email?: string;
    country?: string;
    password?: string;
};

export default function FinancialCredential() {
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Values:', values);

    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const [value, setValue] = useState<UserValue[]>([]);

    return (
        <Form
            name="basic"
            layout="vertical"
            className='w-full'
            autoComplete="off"
            onFinish={onFinish}

            onFinishFailed={onFinishFailed}
        >
            <Flex className="w-full">
                <Flex className="w-full">
                    <Form.Item<FinancialCredentialFieldType>
                        label="First Name"
                        name="firstName"
                        rules={[{ required: true, message: 'Please input your first name!' }]}
                    >
                        <Input type='text' size='large' placeholder='Enter your first name' allowClear />
                    </Form.Item>
                </Flex>
                <Flex className="w-full">
                    <Form.Item<FinancialCredentialFieldType>
                        label="Last Name"
                        name="lastName"
                        rules={[{ required: true, message: 'Please input your last name!' }]}
                    >
                        <Input type='text' size='large' placeholder='Enter your last name' allowClear />
                    </Form.Item>
                </Flex>
            </Flex>
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
        </Form>
    )
}
