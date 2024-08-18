import { DebounceSelect } from "@/app/components/atoms";
import { Facebook, Instagram, TikTok, X, Youtube } from '@/app/components/atoms/Icon';
import { DEBUNK_SOURCE } from '@/app/lib/constants';
import { useCreateCampaignContext } from '@/app/providers/CreateCampaignProvider';
import { Flex, Form, Input, Typography } from "antd";
import Image from "next/image";

export interface DebunkSubjectProps { }
export interface FieldType {
    title: string;
    link: string;
    source: string;
    amount: string;
    description: string;
};

// TO DO: Fetch from some registry?
export const sourcesList = [
    {
        name: DEBUNK_SOURCE.TIKTOK,
        icon: TikTok
    },
    {
        name: DEBUNK_SOURCE.FACEBOOK,
        icon: Facebook
    },
    {
        name: DEBUNK_SOURCE.X,
        icon: X
    },
    {
        name: DEBUNK_SOURCE.YOUTUBE,
        icon: Youtube
    },
    {
        name: DEBUNK_SOURCE.INSTAGRAM,
        icon: Instagram
    },
]

export async function fetchSourcesList() {
    return sourcesList.map(({ name, icon }: any) => ({
        label: <Flex className="items-center">
            <Typography.Text>{name}</Typography.Text>
            <Image alt={name} width={25} height={25} src={icon} />
        </Flex>,
        value: name
    }))
}

const DebunkSubjectForm: React.FC<DebunkSubjectProps> = () => {
    const { setStepOneValues, debunkTitle, debunkLink, debunkSource } = useCreateCampaignContext()

    const selected = sourcesList.filter(({ name }) => name === debunkSource)[0]
    return (
        <Flex className="w-full min-h-[520px]">
            <Form
                name="DebunkSubjectForm"
                layout="vertical"
                initialValues={{
                    title: debunkTitle,
                    link: debunkLink,
                    source: debunkSource ? {
                        label: <Flex className="items-center">
                            <Typography.Text>{selected?.name}</Typography.Text>
                            <Image alt={selected?.name} width={25} height={25} src={selected?.icon} />
                        </Flex>,
                        value: selected?.name
                    } : undefined
                }}
                className='w-full'
                onValuesChange={(_, all) => {
                    const details = {
                        title: all?.title,
                        link: all?.link,
                        source: all?.source?.value,
                    }
                    setStepOneValues?.(details)
                }}
            >
                <Form.Item<FieldType>
                    label="Debunk Title"
                    name="title"
                    rules={[{ required: true, message: 'Please input debunk title!' }]}
                >
                    <Input size='large' placeholder='Enter debunk title' allowClear />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Debunk Link"
                    name="link"
                    rules={[{ required: true, message: 'Please input debunk link!' }]}
                >
                    <Input size='large' placeholder='Enter debunk link' allowClear />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Source Platform"
                    name="source"
                    rules={[{ required: true, message: 'Please input your source!' }]}
                >
                    <DebounceSelect
                        placeholder="Select source platform"
                        fetchOptions={fetchSourcesList}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
            </Form>
        </Flex>
    );
};

export default DebunkSubjectForm;


