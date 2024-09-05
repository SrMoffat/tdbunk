import { toCapitalizedWords } from "@/app/lib/utils";
import { CheckCircleFilled } from "@ant-design/icons";
import { Card, Flex, Tag, Typography } from "antd";
import Link from "next/link";

export interface OfferCardProps {
    offeringId: string
    issuerDid: string
    isSelected: boolean
    isRecommended: boolean
    issuerVcSchema: string
    offeringToCurrencyMethods: any[]
}

const renderPaymentMethods = (methods: any[]) => {
    const renderPropertyNames = (names: any[]) => {
        return (
            <Flex>
                {names.map((name, index) => <Tag key={index}>{toCapitalizedWords(name)}</Tag>)}
            </Flex>
        )
    }

    return (
        <Flex className="flex-col gap-2">
            {methods.map(entry => {
                const kind = entry.kind
                const paymentProperties = entry.paymentProperties

                const paymentPropertyNames = paymentProperties ? Object.keys(paymentProperties) : []
                return (
                    <Flex key={entry.kind} className="w-full">
                        <Tag>{toCapitalizedWords(kind)}</Tag>
                        {/* {renderPropertyNames(paymentPropertyNames)} */}
                    </Flex>
                )
            })}
        </Flex>
    )
}


const OfferCard = ({
    offeringId,
    issuerDid,
    isSelected,
    isRecommended,
    issuerVcSchema,
    offeringToCurrencyMethods
}: OfferCardProps) => {
    const noRequiredClaims = !issuerVcSchema && !issuerDid

    return (
        <Card className={`w-[470px] min-h-[200px] ${isRecommended ? 'opacity-100' : 'opacity-40'}`}>
            <Flex className="w-full gap-2">
                <Typography.Text className="font-bold">
                    Offer ID:
                </Typography.Text>
                <Tag className="items-center" >
                    {offeringId}
                </Tag>
            </Flex>
            <Flex className="gap-1">
                <Flex className="mt-4 border-[0.3px] border-gray-800 rounded-md p-3 w-[250px] justify-between items-center">
                    {!noRequiredClaims
                        ? (
                            <>
                                <Flex className="flex-col gap-2">
                                    <Typography.Text className="text-xs" style={{ fontSize: 11, color: isSelected ? '#6abe39': 'inherit' }}>
                                        Required Credential and Issuer:
                                    </Typography.Text>
                                    <Flex>
                                        <Tag className="items-center text-xs" color={isSelected ? 'green' : 'default'}>
                                            <Link href={issuerVcSchema ? issuerVcSchema : 'http://localhost:3000'} target="_blank" style={{ color: isSelected ? 'green' : 'default' }}>
                                                View Credential Structure
                                            </Link>
                                        </Tag>
                                    </Flex>
                                    <Flex>
                                        <Tag>
                                            <Typography.Text copyable>
                                                {`${issuerDid?.slice(0, 14)}...${issuerDid?.slice(-6)}`}
                                            </Typography.Text>
                                        </Tag>
                                    </Flex>
                                </Flex>
                                <Flex className="items-center">
                                    {isSelected && <CheckCircleFilled style={{ color: "#6abe39" }} />}
                                </Flex>
                            </>
                        )
                        : (
                            <Flex>
                                <Tag color={isSelected ? 'green' : 'default'}>
                                    <Typography.Text>
                                        No Required Credentials
                                    </Typography.Text>
                                </Tag>
                            </Flex>
                        )
                    }
                </Flex>
                <Flex className="mt-4 border-[0.3px] border-gray-800 rounded-md p-3 w-[250px] justify-between flex-col">
                    <Typography.Text className="text-xs" style={{ fontSize: 11 }}>
                        Payout Payment Methods:
                    </Typography.Text>
                    {/* <Flex className="flex-col w-full">
                            {renderPaymentMethods(offeringFromCurrencyMethods)}
                        </Flex> */}
                    <Flex className="flex-col w-full">
                        {renderPaymentMethods(offeringToCurrencyMethods)}
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    )
}

export default OfferCard

