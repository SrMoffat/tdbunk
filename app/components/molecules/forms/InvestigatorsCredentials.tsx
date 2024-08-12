import { Card1, Card2, Card3, Card4, Card5, ValidCredential } from '@/app/components/atoms/Icon';
import { CheckCircleFilled, CheckCircleOutlined } from "@ant-design/icons";
import { Avatar, Badge, Card, Flex, theme, Tooltip, Typography } from "antd";
import Image from "next/image";
import { useState } from "react";

interface InvestigatorsCredentialsProps { }

const InvestigatorsCredentials: React.FC<InvestigatorsCredentialsProps> = () => {
    const [selectedCredentials, setSelectedCredentials] = useState<string[]>([]);

    const [count, setCount] = useState(selectedCredentials.length);
    const {
        token: { colorPrimary },
    } = theme.useToken()

    const handleCardClicked = (credential: string) => {
        const exists = selectedCredentials.includes(credential)

        if (exists) {
            const removed = selectedCredentials.filter(entry => entry !== credential)
            console.log("removed", removed)
            setSelectedCredentials(removed)
            setCount(removed.length)
        } else {
            setSelectedCredentials((existingCredentials) => ([...existingCredentials, credential]))
            setCount(selectedCredentials.length + 1)
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
            card: Card2,
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
        {
            name: "Medical",
            card: Card5,
        }]
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
                    const isSelected = selectedCredentials.includes(name)
                    console.log("Is Selected", isSelected)
                    return (
                        <Card onClick={() => handleCardClicked(name)} className={`transition-all cursor-pointer w-[380px] h-[130px] ${isSelected ? 'opacity-100' : 'opacity-60'} hover:opacity-80`}>
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