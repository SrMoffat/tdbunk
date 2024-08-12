import { Facebook, Instagram, TikTok, X, Youtube } from '@/app/components/atoms/Icon';
import { Flex, Form, Input, Typography } from "antd";
import Image from "next/image";
import { useState } from "react";
import { DebounceSelect } from "@/app/components/atoms";
import { UserValue } from "@/app/components/molecules/forms/Credentials";

interface DebunkSubjectProps { }
interface FieldType {
    title: string;
    link: string;
    source: string;
    amount: string;
    description: string;
};

const DebunkSubject: React.FC<DebunkSubjectProps> = () => {
    const [value, setValue] = useState<UserValue[]>([]);

    const onFinish = () => { }
    const onFinishFailed = () => { }
    async function fetchSourcesList(countryName: string): Promise<any[]> {
        const response = await fetch('/countries.json')
        const data = await response.json()

        const similar = data.filter((country: any) => country?.countryName.toLowerCase().includes(countryName.toLowerCase()))

        return [
            {
                name: "TikTok",
                icon: TikTok
            },
            {
                name: "Facebook",
                icon: Facebook
            },
            {
                name: "X",
                icon: X
            },
            {
                name: "Youtube",
                icon: Youtube
            },
            {
                name: "Instagram",
                icon: Instagram
            },
        ].map(({ name, icon }: any) => ({
            label: <Flex className="items-center">
                <Typography.Text>{name}</Typography.Text>
                <Image alt={name} width={25} height={25} src={icon} />
            </Flex>,
            value: name
        }))
    }
    return (
        <Flex className="w-full min-h-[520px]">
            <Form
                name="basic"
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className='w-full'
            >
                <Form.Item<FieldType>
                    label="Article Title"
                    name="title"
                    rules={[{ required: true, message: 'Please input article title!' }]}
                >
                    <Input size='large' placeholder='Enter article title' allowClear />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Article Link"
                    name="link"
                    rules={[{ required: true, message: 'Please input article link!' }]}
                >
                    <Input size='large' placeholder='Enter article link' allowClear />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Source Platform"
                    name="source"
                    rules={[{ required: true, message: 'Please input your source!' }]}
                >
                    <DebounceSelect
                        value={value}
                        placeholder="Select source platform"
                        fetchOptions={fetchSourcesList}
                        onChange={(newValue) => {
                            setValue(newValue as UserValue[]);
                        }}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
            </Form>
        </Flex>
    );
};

export default DebunkSubject;


