import AssetExachangeAction from "@/app/components/atoms/OfferAction";
import AssetExchangeRates from "@/app/components/atoms/OfferExchangeRates";
import PFIDetails from "@/app/components/atoms/OfferPFI";
import { getEstimatedSettlementTime } from "@/app/lib/utils";
import { Card, Flex } from "antd";

export interface AssetExchangePFIDetailsProps {
    cta: string;
    toUnit: string;
    pfiDid: string;
    pfiName: string;
    fromUnit: string;
    toCurrencyCode: string;
    toCurrencyFlag: string;
    fromCurrencyFlag: string;
    fromCurrencyCode: string;
    offeringCreatedAt: string;
    showPaymentModal: () => void;
    offeringToCurrencyMethods: any[];
}

export enum PaymentStage {
    REQUEST_QUOTE = 'REQUEST_QUOTE',
    MAKE_TRANSFER = 'MAKE_TRANSFER',
}

const AssetExchangePFIDetails = ({
    cta,
    toUnit,
    pfiDid,
    pfiName,
    fromUnit,
    toCurrencyFlag,
    toCurrencyCode,
    showPaymentModal,
    fromCurrencyCode,
    fromCurrencyFlag,
    offeringCreatedAt,
    offeringToCurrencyMethods,
}: AssetExchangePFIDetailsProps) => {
    return (
        <Card className="w-full min-h-[200px]">
            <PFIDetails
                pfiDid={pfiDid}
                pfiName={pfiName}
                createdAt={offeringCreatedAt}
                estimatedSettlementTime={getEstimatedSettlementTime(offeringToCurrencyMethods, true)}
            />
            <Flex className="mt-3 justify-between">
                <AssetExachangeAction
                    cta={cta}
                    pfiName={pfiName}
                    showModal={showPaymentModal}
                />
                <AssetExchangeRates
                    toUnit={toUnit}
                    fromUnit={fromUnit}
                    toCurrencyCode={toCurrencyCode}
                    toCurrencyFlag={toCurrencyFlag}
                    fromCurrencyFlag={fromCurrencyFlag}
                    fromCurrencyCode={fromCurrencyCode}
                />
            </Flex>
        </Card>
    )
}

export default AssetExchangePFIDetails
