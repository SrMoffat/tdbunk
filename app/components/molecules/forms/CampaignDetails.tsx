import { Community, Sponsor } from "@/app/components/atoms/Icon";
import { DEBUNK_CAMPAIGN_TYPE } from "@/app/lib/constants";
import { getCurrencyFlag } from "@/app/lib/utils";
import { useCreateCampaignContext } from "@/app/providers/CreateCampaignProvider";
import { useTbdexContext } from "@/app/providers/TbdexProvider";
import { Flex, Form, Input, InputNumber, Segmented, Select, Typography } from "antd";
import Image from "next/image";
import { useState } from "react";

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

const CampaignDetails: React.FC<any> = ({
    setNextButtonDisabled
}) => {
    const {
        destinationCurrencies,
        setSelectedDestinationCurrency
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
                        amount: isSponsored ? campaignAmount : 1,
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
                            type: all?.amount > 0 ? DEBUNK_CAMPAIGN_TYPE.SPONSORED : DEBUNK_CAMPAIGN_TYPE.COMMUNITY,
                        }
                        // To do: Clean this up, lazy validation
                        const hasAllValues = Boolean(details.name)
                            && Boolean(details.description)
                            && Boolean(details.factCheckers)
                            && Boolean(details.minEvidences)

                        setNextButtonDisabled((prev: any) => ({
                            ...prev,
                            stepTwo: !hasAllValues
                        }))
                        setCampaignAmount?.(all?.amount)
                        setStepTwoValues?.(details)
                    }}
                >
                    {isSponsored && (
                        <Form.Item<FieldType>
                            label="Sponsorhip Amount"
                            extra={<Typography.Text style={{ fontSize: 11 }} className="mt-1 opacity-50">
                                The campaign will receive amount in selected currency
                            </Typography.Text>}
                            name="amount"
                            rules={[{ required: true, message: 'Please input the sponsorship amount!' }]}
                        >
                            <InputNumber min={1} size='large' addonBefore={(
                                <Select style={{ width: 130 }} defaultValue={'USD'} onChange={(value) => {
                                    setSelectedDestinationCurrency?.(value)
                                }}>
                                    {destinationCurrencies?.map(entry => {
                                        const flag = getCurrencyFlag(entry)
                                        return (
                                            <Option key={entry} value={entry}>{`${entry} ${flag}`}</Option>
                                        )
                                    })}
                                </Select>
                            )}
                            />
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
                        name="factCheckers"
                        rules={[{ required: true, message: 'Please input number of fact checkers!' }]}
                    >
                        <InputNumber min={1} size='large' />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Minimum Evidence Submissions"
                        name="minEvidences"
                        rules={[{ required: true, message: 'Please input number of fact checkers!' }]}
                    >
                        <InputNumber min={1} size='large' />
                    </Form.Item>
                </Form>
            </Flex>
        </Flex>
    );
};

export default CampaignDetails;
