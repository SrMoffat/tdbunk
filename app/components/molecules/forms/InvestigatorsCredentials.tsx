import { Card1, Card3, Card4, Card5, ValidCredential } from '@/app/components/atoms/Icon';
import { useCreateCampaignContext } from '@/app/providers/CreateCampaignProvider';
import { CheckCircleFilled, CheckCircleOutlined } from "@ant-design/icons";
import { Avatar, Badge, Card, Flex, theme, Tooltip, Typography } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";

const InvestigatorsCredentials: React.FC<any> = ({
    setNextButtonDisabled
}) => {
    const { requiredCredentials, setRequiredCredentials } = useCreateCampaignContext()

    const [count, setCount] = useState(requiredCredentials!.length - 1);
    const {
        token: { colorPrimary },
    } = theme.useToken()

    const handleCardClicked = (credential: string) => {
        const exists = requiredCredentials!.includes(credential)

        if (exists) {
            const removed = requiredCredentials!.filter(entry => entry !== credential)
            setRequiredCredentials?.(removed)
            setCount(removed.length - 1)
        } else {
            setRequiredCredentials?.((existingCredentials) => ([...existingCredentials, credential]))
            setCount(requiredCredentials!.length)
        }
    }

    const credentialOptions = [
        {
            name: "Financial",
            card: Card1,
            className: ''
        },
        {
            name: "Government",
            card: Card5,
            className: ''
        },
        {
            name: "Professional",
            card: Card3,
        },
        {
            name: "Educational",
            card: Card4,
        },
    ]

    useEffect(() => {
        // To do: Clean this up, lazy validation, check the actual cred types
        const hasAllValues = count > 0

        setNextButtonDisabled((prev: any) => ({
            ...prev,
            stepThree: !hasAllValues
        }))
    }, [count])
    return (
        <Flex wrap className="w-full gap-6 mt-6">
            <Tooltip title="Select the credentials required to be a fact checker in this campaign." placement="top" >
                <Flex className="w-full justify-center items-center">
                    <Badge count={count} color={colorPrimary} style={{ color: "white" }}>
                        <Avatar shape='square' size='large' style={{ backgroundColor: colorPrimary }} icon={<Image src={ValidCredential} alt="factChecker" width={20} height={20} />} />
                    </Badge>
                    <Typography.Text className="ml-3">Required Credentials</Typography.Text>
                </Flex>
            </Tooltip>
            <Flex wrap className="gap-3 justify-center">
                {credentialOptions.map(({ name, card }) => {
                    const isSelected = requiredCredentials!.includes(name)
                    return (
                        <Card key={name} onClick={() => handleCardClicked(name)} className={`transition-all cursor-pointer w-[380px] h-[130px] ${isSelected ? 'opacity-100' : 'opacity-60'} hover:opacity-80`}>
                            <Flex className={`absolute  rounded-md transition-all cursor-pointer`}>
                                <Image alt="card" src={card} width={150} height={150} />
                            </Flex>
                            <Flex className={`self-end absolute right-3 items-center h-[80px] w-[calc(100%-12rem)]`}>
                                <Typography.Text style={{ fontSize: 10, marginRight: 5 }}>{`Verifiable ${name} Credential`}</Typography.Text>
                                {
                                    isSelected
                                        ? <CheckCircleFilled style={{ color: colorPrimary }} />
                                        : <CheckCircleOutlined style={{ color: 'gray' }} />
                                }
                            </Flex>
                        </Card>
                    )
                })}
            </Flex>
        </Flex>
    );
};

export default InvestigatorsCredentials;