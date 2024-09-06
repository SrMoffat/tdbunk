import AssetExachangeAction from "@/app/components/atoms/OfferAction";
import AssetExchangeRates from "@/app/components/atoms/OfferExchangeRates";
import PFIDetails from "@/app/components/atoms/OfferPFI";
import { getEstimatedSettlementTime } from "@/app/lib/utils";
import { Card, Flex } from "antd";
import React from "react"

export interface AssetExchangePFIDetailsProps {
    cta: string;
    offering: any;
    toUnit: string;
    pfiDid: string;
    pfiName: string;
    fromUnit: string;
    selectedOffering: any;
    toCurrencyCode: string;
    toCurrencyFlag: string;
    fromCurrencyFlag: string;
    fromCurrencyCode: string;
    offeringCreatedAt: string;
    showPaymentModal: () => void;
    offeringToCurrencyMethods: any[];
    setSelectedOffering: React.Dispatch<React.SetStateAction<any>>
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
    offering,
    toCurrencyFlag,
    toCurrencyCode,
    showPaymentModal,
    fromCurrencyCode,
    fromCurrencyFlag,
    offeringCreatedAt,
    selectedOffering,
    setSelectedOffering,
    offeringToCurrencyMethods,
}: AssetExchangePFIDetailsProps) => {
    return (
        <Card className={`w-full min-h-[200px] ${pfiName ? 'opacity-100' : 'opacity-40'}`}>
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
                    offering={offering}
                    showModal={showPaymentModal}
                    selectedOffering={selectedOffering}
                    setSelectedOffering={setSelectedOffering}
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
