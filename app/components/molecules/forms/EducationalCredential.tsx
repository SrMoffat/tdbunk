import { CREDENTIAL_TYPES } from '@/app/lib/constants';
import type { DatePickerProps } from 'antd';
import { DatePicker, Flex, Form, Input } from 'antd';

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

export default function EducationalCredentialForm({
    setFormData
 }: EducationalCredentialProps) {
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };

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
