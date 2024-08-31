import { getCurrencyFlag } from "@/app/components/atoms/SearchOffersInput";
import CredentialsForm from '@/app/components/molecules/forms/Credentials';
import { Credentials } from "@/app/components/organisms/Credentials";
import { PFIs } from "@/app/lib/constants";
import { getEstimatedSettlementTime } from "@/app/lib/utils";
import { Offering } from "@tbdex/http-client";
import { Button, Card, Flex, List, Modal } from "antd";
import { formatDistanceToNow } from 'date-fns';
import { SetStateAction, useState } from "react";
import AssetExachangeAction from "../../atoms/OfferAction";
import AssetExchangeOffer from "../../atoms/OfferDetails";
import AssetExchangeRates from "../../atoms/OfferExchangeRates";
import PFIDetails from "../../atoms/OfferPFI";
import MakePayment from "../forms/MakePayment";


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
    const [paymentStage, setPaymentState] = useState<PaymentStage>(PaymentStage.REQUEST_QUOTE)

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

    const isRequestQuote = paymentStage === PaymentStage.REQUEST_QUOTE

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
        if (isRequestQuote) {
            setPaymentState(PaymentStage.MAKE_TRANSFER)
        } else {
            setShowModal(false);
        }
    };

    const handleCancel = () => {
        if (isRequestQuote) {
            setShowModal(false);
        } else {
            setPaymentState(PaymentStage.REQUEST_QUOTE)
        }
    };

    const cta = isSelected
        ? 'Start Transfer'
        : 'Request Credentials'

    const modalTitle = hasRequiredCredentials
        ? isSelected
            ? isRequestQuote
                ? 'Request for Quote'
                : 'Make Transfer'
            : 'Select Credential'
        : 'Request Credentials'

    const flow = hasRequiredCredentials
        ? isSelected
            ? <MakePayment
                pfiDid={pfiDid}
                pfiName={pfiName}
                offering={rawOffering}
                isRequestQuote={isRequestQuote}
                campaignAmount={campaignAmount}
                offeringCreatedAt={offeringCreatedAt}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
            />
            : <Credentials
                credentials={credentials}
                isSelected={isSelected}
                selectedCard={selectedCard}
                setIsSelected={setIsSelected}
                setSelectedCard={setSelectedCard}
            />
        : <CredentialsForm
            nextButtonDisabled={false}
            noCredentialsFound={false}
            localStorageCredentials={[]}
            stateCredentials={undefined}
            setNextButtonDisabled={function (value: SetStateAction<boolean>): void {
                throw new Error("Function not implemented.");
            }}
            setUserDid={undefined}
            setWeb5Instance={undefined}
            setCredentials={undefined}
            setRecoveryPhrase={undefined}
            setUserBearerDid={undefined}
        />

    const issuerDid = offeringRequiredClaims?.['vc.issuer']
    const issuerVcSchema = offeringRequiredClaims?.['vc.credentialSchema.id']

    const isPaymentStep = hasRequiredCredentials && isSelected

    const destinationCurrencyCode = rawOffering?.data?.payout?.currencyCode



    const cancelText = isRequestQuote
        ? 'Cancel'
        : 'Cancel Transfer'

    const submitText = isRequestQuote
        ? 'Request for Quote'
        : `Transfer ${destinationCurrencyCode} ${campaignAmount}`

    return (
        <List.Item className="flex flex-row gap-2">
            <Modal
                width={800}
                open={showModal}
                title={modalTitle}
                footer={isPaymentStep ? [
                    <Button danger key="back" onClick={handleCancel}>
                        {cancelText}
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        {submitText}
                    </Button>
                ] : []}
            >
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
                isRecommended
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
