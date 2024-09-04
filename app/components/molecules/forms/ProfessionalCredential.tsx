import { FieldType, UserValue } from '@/app/lib/api';
import { CREDENTIAL_TYPES } from '@/app/lib/constants';
import type { DatePickerProps, FormProps } from 'antd';
import { DatePicker, Flex, Form, Input } from 'antd';
import { useState } from 'react';

export interface ProfessionalCredentialFieldType {
    nameOfProfessionalBody: string;
    nameOfProfession: string;
    startDate: string;
    endDate: string;
};

export interface ProfessionalCredentialProps {
    setFormData: any
    //() => React.Dispatch<React.SetStateAction<{ [key: CREDENTIAL_TYPES]: { }; }>>
}

export default function ProfessionalCredential({ 
    setFormData
}: ProfessionalCredentialProps) {
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
            name="professionalCredential"
            layout="vertical"
            className='w-full'
            autoComplete="off"
            onValuesChange={(_, all) => {
                setFormData((prev: any) => ({
                    ...prev,
                    [CREDENTIAL_TYPES.PROFESSIONAL_CREDENTIAL]: {
                        ...all
                    }
                }))
            }}
        >
            <Form.Item<ProfessionalCredentialFieldType>
                label="Name of Professional Body"
                name="nameOfProfessionalBody"
                rules={[{ required: true, message: 'Please input name of professional body!' }]}
            >
                <Input type='text' size='large' placeholder='Enter name of professional body' allowClear />
            </Form.Item>
            <Form.Item<ProfessionalCredentialFieldType>
                label="Name of Profession"
                name="nameOfProfession"
                rules={[{ required: true, message: 'Please input name of profession!' }]}
            >
                <Input type='text' size='large' placeholder='Enter name of profession' allowClear />
            </Form.Item>
            <Flex className="w-full">
                <Flex className="w-full">
                    <Form.Item<ProfessionalCredentialFieldType>
                        label="Start Date"
                        name="startDate"
                        rules={[{ required: true, message: 'Please input the start date!' }]}
                    >
                        <DatePicker onChange={onChange} />
                    </Form.Item>
                </Flex>
                <Flex className="w-full">
                    <Form.Item<ProfessionalCredentialFieldType>
                        label="End Date"
                        name="endDate"
                        rules={[{ required: true, message: 'Please input the end date!' }]}
                    >
                        <DatePicker onChange={onChange} />
                    </Form.Item>
                </Flex>
            </Flex>
        </Form>
    )
}
