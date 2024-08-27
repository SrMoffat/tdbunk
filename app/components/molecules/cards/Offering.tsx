import { getCurrencyFlag } from "@/app/components/atoms/SearchOffersInput";
import CredentialsForm from '@/app/components/molecules/forms/Credentials';
import { Credentials } from "@/app/components/organisms/Credentials";
import { PFIs } from "@/app/lib/constants";
import { getEstimatedSettlementTime } from "@/app/lib/utils";
import { Offering } from "@tbdex/http-client";
import { Card, Flex, List, Modal } from "antd";
import { formatDistanceToNow } from 'date-fns';
import { useState } from "react";
import AssetExachangeAction from "../../atoms/OfferAction";
import AssetExchangeOffer from "../../atoms/OfferDetails";
import AssetExchangeRates from "../../atoms/OfferExchangeRates";
import PFIDetails from "../../atoms/OfferPFI";

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
        <Card className="border w-full min-h-[200px]">
            <PFIDetails
                pfiDid={pfiDid}
                pfiName={pfiName}
                createdAt={offeringCreatedAt}
                estimatedSettlementTime={getEstimatedSettlementTime(offeringToCurrencyMethods, true)}
            />
            <Flex className="mt-3 justify-between">
                <AssetExachangeAction
                    cta={cta}
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

const OfferingDetails = (props: any) => {
    const {
        isSelected,
        credentials,
        selectedCard,
        setIsSelected,
        createExchange,
        campaignAmount,
        setSelectedCard,
        offering: values,
        unformattedOfferings,
    } = props

    const [showModal, setShowModal] = useState(false)

    const offering = Object.values(values ? values : {})[0] as any
    const pfiDid = Object.keys(values ? values : {})[0] as any

    const offeringId = offering?.id
    const offeringCreatedAt = offering?.createdAt
    const offeringRequiredClaims = offering?.requiredClaims
    const offeringFromCurrency = offering?.pair[0]
    const offeringToCurrency = offering?.pair[1]
    const offeringFromCurrencyMethods = offeringFromCurrency?.methods
    const offeringToCurrencyMethods = offeringToCurrency?.methods
    const offeringCreatedTime = formatDistanceToNow(new Date(offeringCreatedAt), { addSuffix: true });

    const pfiName = PFIs.filter(pfi => pfi?.did === pfiDid)[0]?.name

    const hasRequiredCredentials = Boolean(credentials?.length)

    const rawOfferins = unformattedOfferings?.flat() as Offering[]
    const rawOfferingDetails = rawOfferins.filter(({ metadata: { id } }) => id === offeringId)
    const rawOffering = rawOfferingDetails[0]

    const offerRequiredClaims = rawOffering?.data?.requiredClaims

    const showPaymentModal = () => {
        const isReadyForQuote = hasRequiredCredentials && isSelected

        if (isReadyForQuote) {
            createExchange({
                offering,
                rawOffering,
                campaignAmount,
                vcJwts: credentials,
                presentationDefinition: offerRequiredClaims
            })
        }
        setShowModal(true)
    }

    const handleOk = () => {
        setShowModal(false);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const cta = isSelected
        ? 'Start Payment'
        : 'Request Credentials'

    const modalTitle = hasRequiredCredentials
        ? isSelected
            ? 'All Good'
            : 'Select Credential'
        : 'Request Credentials'

    const flow = hasRequiredCredentials
        ? isSelected
            ? <Flex>Proceed With Payment</Flex>
            : <Credentials
                credentials={credentials}
                isSelected={isSelected}
                selectedCard={selectedCard}
                setIsSelected={setIsSelected}
                setSelectedCard={setSelectedCard}
            />
        : <CredentialsForm />

    const issuerDid = offeringRequiredClaims?.['vc.issuer']
    const issuerVcSchema = offeringRequiredClaims?.['vc.credentialSchema.id']

    return (
        <List.Item className="flex flex-row gap-2">
            <Modal width={800} title={modalTitle} open={showModal} onOk={handleOk} onCancel={handleCancel}>
                {flow}
            </Modal>
            <AssetExchangePFIDetails
                cta={cta}
                fromUnit="1.0"
                pfiDid={pfiDid}
                pfiName={pfiName}
                toUnit={offeringToCurrency?.unit}
                showPaymentModal={showPaymentModal}
                offeringCreatedAt={offeringCreatedAt}
                toCurrencyCode={offeringToCurrency?.currencyCode}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
                fromCurrencyCode={offeringFromCurrency?.currencyCode}
                fromCurrencyFlag={getCurrencyFlag(offeringFromCurrency?.currencyCode)}
                toCurrencyFlag={getCurrencyFlag(offeringToCurrency?.currencyCode)}
            />
            <AssetExchangeOffer
                issuerDid={issuerDid}
                isSelected={isSelected}
                offeringId={offeringId}
                issuerVcSchema={issuerVcSchema}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
            />
        </List.Item>

    )
}


export default OfferingDetails
