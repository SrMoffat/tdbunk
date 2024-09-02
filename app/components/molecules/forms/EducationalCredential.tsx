import { DebounceSelect } from '@/app/components/atoms';
import { fetchUserList, FieldType, UserValue } from '@/app/lib/api';
import { CREDENTIAL_TYPES } from '@/app/lib/constants';
import { Button, Form, Input, Flex, DatePicker } from 'antd';
import type { FormProps, DatePickerProps } from 'antd';
import { useState } from 'react';

export interface EducationalCredentialFieldType {
    nameOfInstituion: string;
    nameOfCourse: string;
    startedDate: string;
    endedDate: string;
};

export interface EducationalCredentialProps {
    setFormData: any
    //() => React.Dispatch<React.SetStateAction<{ [key: CREDENTIAL_TYPES]: { }; }>>
}

export default function EducationalCredential({
    setFormData
 }: EducationalCredentialProps) {
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Values:', values);

    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };

    const [value, setValue] = useState<UserValue[]>([]);
  return (
      <Form
          name="educationalCredential"
          layout="vertical"
          className='w-full'
          autoComplete="off"
          onValuesChange={(_, all) => {
              setFormData((prev: any) => ({
                  ...prev,
                  [CREDENTIAL_TYPES.EDUCATIONAL_CREDENTIAL]: {
                      ...all
                  }
              }))
          }}
      >
          <Form.Item<EducationalCredentialFieldType>
              label="Name of Instituion"
              name="nameOfInstituion"
              rules={[{ required: true, message: 'Please input name of instituion!' }]}
          >
              <Input type='text' size='large' placeholder='Enter name of instituion' allowClear />
          </Form.Item>
          <Form.Item<EducationalCredentialFieldType>
              label="Name of Course"
              name="nameOfCourse"
              rules={[{ required: true, message: 'Please input name of course!' }]}
          >
              <Input type='text' size='large' placeholder='Enter name of course' allowClear />
          </Form.Item>
          <Flex className="w-full">
              <Flex className="w-full">
                  <Form.Item<EducationalCredentialFieldType>
                      label="Start Date"
                      name="startedDate"
                      rules={[{ required: true, message: 'Please input the start date!' }]}
                  >
                      <DatePicker onChange={onChange} />
                  </Form.Item>
              </Flex>
              <Flex className="w-full">
                  <Form.Item<EducationalCredentialFieldType>
                      label="End Date"
                      name="endedDate"
                      rules={[{ required: true, message: 'Please input the end date!' }]}
                  >
                      <DatePicker onChange={onChange} />
                  </Form.Item>
              </Flex>
          </Flex>
      </Form>
  )
}
