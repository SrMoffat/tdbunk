import { FieldType } from '@/app/lib/api';
import type { DatePickerProps, FormProps } from 'antd';
import { DatePicker, Flex, Form, Input, Space } from 'antd';

export interface GovernmentCredentialFieldType {
    firstName?: string;
    lastName?: string;
    idNumber?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
};

export default function GovernmentCredential() {
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Values:', values);

    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };
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
                  <Form.Item<GovernmentCredentialFieldType>
                      label="First Name"
                      name="firstName"
                      rules={[{ required: true, message: 'Please input your first name!' }]}
                  >
                      <Input type='text' size='large' placeholder='Enter your first name' allowClear />
                  </Form.Item>
              </Flex>
              <Flex className="w-full">
                  <Form.Item<GovernmentCredentialFieldType>
                      label="Last Name"
                      name="lastName"
                      rules={[{ required: true, message: 'Please input your last name!' }]}
                  >
                      <Input type='text' size='large' placeholder='Enter your last name' allowClear />
                  </Form.Item>
              </Flex>
          </Flex>
          <Form.Item<GovernmentCredentialFieldType>
              label="ID Number"
              name="idNumber"
              rules={[{ required: true, message: 'Please input your id number!' }]}
          >
              <Input type='text' size='large' placeholder='Enter your id number' allowClear />
          </Form.Item>
          <Form.Item<GovernmentCredentialFieldType>
              label="Phone Number"
              name="phoneNumber"
              rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
              <Space.Compact>
                  <Input style={{ width: '20%' }} defaultValue="+254" />
                  <Input style={{ width: '80%' }} defaultValue="488008883" />
              </Space.Compact>
          </Form.Item>
          <Form.Item<GovernmentCredentialFieldType>
              label="Date of Birth"
              name="dateOfBirth"
              rules={[{ required: true, message: 'Please input your date of birth!' }]}
          >
              <DatePicker onChange={onChange} />
          </Form.Item>
      </Form>
  )
}
