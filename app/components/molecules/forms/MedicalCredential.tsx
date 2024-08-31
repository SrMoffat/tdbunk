import { DebounceSelect } from '@/app/components/atoms';
import { fetchUserList, FieldType, UserValue } from '@/app/lib/api';
import { Button, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import { useState } from 'react';

export default function MedicalCredential() {
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
              <Button type="primary" htmlType="submit" loading={true}>
                  Create
              </Button>
          </Form.Item>
      </Form>
  )
}
