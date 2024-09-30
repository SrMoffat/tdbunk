import { CheckCircleFilled } from "@ant-design/icons";
import { Card, Flex, Tag, Typography } from "antd";
import Link from "next/link";

export interface OfferCardProps {
    issuerDid: string
    offeringId: string
    selectedCard: any
    isSpecial: boolean
    isSelected: boolean
    isRecommended: boolean
    issuerVcSchema: string
    selectedPayinMethod: any;
    selectedPayoutMethod: any;
    hasRequiredClaims: boolean
    offeringToCurrencyMethods: any[]
    offeringFromCurrencyMethods: any[]
    setSelectedPayinMethod: React.Dispatch<React.SetStateAction<any>>;
    setSelectedPayoutMethod: React.Dispatch<React.SetStateAction<any>>;
}

const OfferCard = ({
    isSpecial,
    issuerDid,
    offeringId,
    selectedCard,
    issuerVcSchema,
}: OfferCardProps) => {
    const noRequiredClaims = !issuerVcSchema && !issuerDid

    const hasClaims = selectedCard?.issuer === issuerDid

    return (
        <Card className={`w-[470px] min-h-[200px] ${!isSpecial ? 'opacity-100' : 'opacity-40'}`}>
            <Flex className="w-full gap-2">
                <Typography.Text className="font-bold">
                    Offer ID:
                </Typography.Text>
                <Tag className="items-center" >
                    {offeringId}
                </Tag>
            </Flex>
            <Flex className="gap-1">
                <Flex className="mt-4 border-[0.3px] border-gray-800 w-full rounded-md p-3 justify-between items-center">
                    {!noRequiredClaims
                        ? (
                            <>
                                <Flex className="flex-col gap-2">
                                    <Typography.Text className="text-xs" style={{ fontSize: 11 }}>
                                        Required Credential and Issuer:
                                    </Typography.Text>
                                    <Flex>
                                        <Tag className="items-center text-xs" color={hasClaims ? 'green' : 'default'}>
                                            <Link href={issuerVcSchema ? issuerVcSchema : 'https://google.com'} target="_blank">
                                                <Typography.Text style={{ color: hasClaims ? '#16a34a' : 'inherit' }}>
                                                    View Credential Structure
                                                </Typography.Text>
                                            </Link>
                                        </Tag>
                                    </Flex>
                                    <Flex>
                                        <Tag color={hasClaims ? 'green' : 'default'}>
                                            <Typography.Text style={{ color: hasClaims ? '#16a34a' : 'inherit' }} copyable>
                                                {`${issuerDid?.slice(0, 18)}...${issuerDid?.slice(-18)}`}
                                            </Typography.Text>
                                        </Tag>
                                    </Flex>
                                </Flex>
                                <Flex className="items-center">
                                    {hasClaims && <CheckCircleFilled style={{ color: "#16a34a" }} />}
                                </Flex>
                            </>
                        )
                        : (
                            <Flex>
                                <Tag color={hasClaims ? 'green' : 'default'}>
                                    <Typography.Text>
                                        No Required Credentials
                                    </Typography.Text>
                                </Tag>
                            </Flex>
                        )
                    }
                </Flex>
            </Flex>
        </Card>
    )
}

export default OfferCard

