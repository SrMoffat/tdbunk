import { Flex, Segmented, Form, InputNumber, Input, Select } from "antd";
import { useState } from "react";
import { Community, Sponsor } from "@/app/components/atoms/Icon";
import Image from "next/image"

const { Option } = Select


interface CampaignDetailsProps { }
interface FieldType {
    title: string;
    link: string;
    source: string;
    amount: string;
    description: string;
};

const CampaignDetails: React.FC<CampaignDetailsProps> = () => {
    const [mode, setMode] = useState<any>();


    const isCommunity = mode === "Community"
    const isSponsored = mode === "Sponsored"

    const options = [
        {
            name: "Community",
            icon: Community
        },
        {
            name: "Sponsored",
            icon: Sponsor
        },
    ].map(({ name, icon }) => ({
        label: (
            <Flex className="p-6 gap-3 justify-center w-[150px] items-center">
                <Image alt={name} src={icon} width={30} height={30} />
                <Flex className="flex-col">
                    <Flex>{name}</Flex>
                    <Flex className="-mt-2">Campaign</Flex>
                </Flex>
            </Flex>
        ),
        value: name
    }))

    const selectAfter = (
        <Select defaultValue="USD" style={{ width: 100 }}>
            <Option value="USD">USD</Option>
            <Option value="EUR">EUR</Option>
            <Option value="GBP">GBP</Option>
            <Option value="CNY">CNY</Option>
        </Select>
    );

    const onFinish = () => { }
    const onFinishFailed = () => { }

    return (
        <Flex className="w-full flex-col">
            <Flex className="justify-center">
                <Segmented
                    onChange={(value) => {
                        // Launch modal
                        console.log("Values", value)
                        setMode(value)
                        // showModal()
                    }}
                    options={options}
                    style={{ backgroundColor: "#334155", height: 100 }}
                />
            </Flex>
            <Flex className='min-h-[520px]'>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    className='w-full'
                >
                    {isSponsored && (
                        <Form.Item<FieldType>
                            label="Sponsorhip Amount"
                            name="amount"
                            rules={[{ required: true, message: 'Please input your description!' }]}
                        >
                            <InputNumber size='large' addonBefore={selectAfter} defaultValue={100} />
                        </Form.Item>
                    )}
                    <Form.Item<FieldType>
                        label="Campaign Name"
                        name="title"
                        rules={[{ required: true, message: 'Please input your title!' }]}
                    >
                        <Input size='large' placeholder='Enter your title' allowClear />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Campaign Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input your description!' }]}
                    >
                        <Input.TextArea size='large' placeholder='Enter the description' allowClear />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Number of Fact Checkers"
                        name="amount"
                        rules={[{ required: true, message: 'Please input number of fact checkers!' }]}
                    >
                        <InputNumber size='large' addonBefore={selectAfter} defaultValue={4} />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Minimum Evidence Submissions"
                        name="amount"
                        rules={[{ required: true, message: 'Please input number of fact checkers!' }]}
                    >
                        <InputNumber size='large' addonBefore={selectAfter} defaultValue={4} />
                    </Form.Item>
                </Form>
            </Flex>
        </Flex>
    );
};

export default CampaignDetails;
