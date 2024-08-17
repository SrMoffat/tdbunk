import { Flex, Segmented, Form, InputNumber, Input, Select, Typography } from "antd";
import { useState } from "react";
import { Community, Evidence, FactCheckers, Sponsor, Sponsorships } from "@/app/components/atoms/Icon";
import Image from "next/image"
import { useCreateCampaignContext } from "@/app/providers/CreateCampaignProvider";
import { DEBUNK_CAMPAIGN_TYPE } from "@/app/lib/constants";
import { useTbdexContext } from "@/app/providers/TbdexProvider";

const { Option } = Select

export interface SelectBeforeProps {
    type: string;
    currency?: string;
}


export interface CampaignDetailsProps { }
export interface FieldType {
    title: string;
    link: string;
    source: string;
    amount: number;
    factCheckers: number;
    minEvidences: number;
    description: string;
};

const CampaignDetails: React.FC<CampaignDetailsProps> = () => {
    const {
        sourceCurrencies,
        setSelectedCurrency
    } = useTbdexContext()
    const {
        campaignName,
        campaignAmount,
        campaignDescription,
        campaignMinEvidences,
        campaignNumOfFactCheckers,
        setCampaignType,
        setCampaignAmount,
        setStepTwoValues,
    } = useCreateCampaignContext()
    const [mode, setMode] = useState<DEBUNK_CAMPAIGN_TYPE>();
    const isSponsored = mode === DEBUNK_CAMPAIGN_TYPE.SPONSORED

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
        value: name as DEBUNK_CAMPAIGN_TYPE
    }))

    const SelectBefore = (props: SelectBeforeProps) => {
        let icon = undefined

        switch (props.type) {
            case 'amount': {
                icon = Sponsorships
                break
            }
            case 'factCheckers': {
                icon = FactCheckers
                break
            }
            case 'minEvidences': {
                icon = Evidence
                break
            }

        }

        const isAmount = props.type === 'amount'
        return (
            <Flex className={`items-center justify-center w-[${isAmount ? '100px' : '30px'}] h-[30px]`}>
                <Image className="mr-2" alt={props.type} src={icon} width={50} height={50} />
                {isAmount && props.currency}
            </Flex>
        )
    }

    console.log("==>", sourceCurrencies)

    return (
        <Flex className="w-full flex-col">
            <Flex className="justify-center">
                <Segmented
                    value={mode}
                    onChange={(value) => {
                        const isSponsored = value === DEBUNK_CAMPAIGN_TYPE.COMMUNITY
                        setMode(value)
                        setCampaignType?.(value)
                        if (isSponsored) {
                            setCampaignAmount?.(0)
                        }
                    }}
                    options={options}
                    style={{ backgroundColor: "#334155", height: 100 }}
                />
            </Flex>
            <Flex className='min-h-[520px]'>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{
                        title: campaignName,
                        amount: campaignAmount,
                        description: campaignDescription,
                        factCheckers: campaignNumOfFactCheckers,
                        minEvidences: campaignMinEvidences,
                    }}
                    className='w-full'
                    onValuesChange={(_, all) => {
                        const details = {
                            name: all?.title,
                            description: all?.description,
                            factCheckers: all?.factCheckers,
                            minEvidences: all?.minEvidences,
                        }
                        setCampaignAmount?.(all?.amount)
                        setStepTwoValues?.(details)
                    }}
                >
                    <Form.Item<FieldType>
                        label="Sponsorhip Amount"
                        name="amount"
                        rules={[{ required: true, message: 'Please input your description!' }]}
                    >
                        <InputNumber min={1} disabled={!isSponsored} size='large' addonBefore={(
                            <Select defaultValue="USD" disabled={!isSponsored} onChange={(value) => {
                                setSelectedCurrency?.(value)
                            }}>
                                {sourceCurrencies?.map(entry => <Option key={entry} value={entry}>{entry}</Option>)}
                            </Select>
                        )} />
                        {/* <InputNumber min={1} disabled={!isSponsored} size='large' addonBefore={<SelectBefore type="amount" currency="USD" />} /> */}
                    </Form.Item>
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
                        name="factCheckers"
                        rules={[{ required: true, message: 'Please input number of fact checkers!' }]}
                    >
                        <InputNumber min={1} size='large' />
                        {/* <InputNumber min={1} size='large' addonBefore={<SelectBefore type="factCheckers" />} /> */}
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Minimum Evidence Submissions"
                        name="minEvidences"
                        rules={[{ required: true, message: 'Please input number of fact checkers!' }]}
                    >
                        <InputNumber min={1} size='large' />
                        {/* <InputNumber min={1} size='large' addonBefore={<SelectBefore type="minEvidences" />} /> */}
                    </Form.Item>
                </Form>
            </Flex>
        </Flex>
    );
};

export default CampaignDetails;
