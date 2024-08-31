import { DebounceSelect } from '@/app/components/atoms';
import { fetchUserList, FieldType, UserValue } from '@/app/lib/api';
import { Button, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import { useState } from 'react';

export interface ProfessionalCredentialFieldType {
    nameOfProfessionalBody: string;
};

export default function ProfessionalCredential() {
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
          <Form.Item<ProfessionalCredentialFieldType>
              label="Name of Professional Body"
              name="nameOfProfessionalBody"
              rules={[{ required: true, message: 'Please input name of professional body!' }]}
          >
              <Input type='text' size='large' placeholder='Enter name of professional body' allowClear />
          </Form.Item>
        
          {/* <Form.Item<FieldType>
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
          </Form.Item> */}
      </Form>
  )
}
