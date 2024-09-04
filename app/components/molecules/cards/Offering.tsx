import AssetExchangeOffer from "@/app/components/atoms/OfferDetails";
import AssetExchangePFIDetails from "@/app/components/molecules/cards/OfferingPFIDetails";
import CredentialsForm from '@/app/components/molecules/forms/Credentials';
import MakePayment from "@/app/components/molecules/forms/MakePayment";
import { Credentials } from "@/app/components/organisms/Credentials";
import { PFIs } from "@/app/lib/constants";
import { pollExchanges, sendCloseMessage } from "@/app/lib/tbdex";
import { getCurrencyFlag } from "@/app/lib/utils";
import { Offering, Close, TbdexHttpClient } from "@tbdex/http-client";
import { Button, List, Modal, Spin } from "antd";
import { formatDistanceToNow } from 'date-fns';
import { SetStateAction, useEffect, useState } from "react";

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





const OfferingDetails = (props: any) => {
    const {
        isSelected,
        credentials,
        stateCredentials,
        selectedCard,
        setIsSelected,
        userBearerDid,
        createExchange,
        campaignAmount,
        setSelectedCard,
        offering: values,
        unformattedOfferings,
    } = props

    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [activateButton, setActivateButton] = useState(false)
    const [relevantExchange, setRelevantExchanges] = useState<{ rfq: any; quote: any }>({
        rfq: {},
        quote: {}
    })
    const [requiredPaymentDetails, setRequiredPaymentDetails] = useState<any>({
        payin: {},
        payout: {}
    })
    const [paymentStage, setPaymentState] = useState<PaymentStage>(PaymentStage.REQUEST_QUOTE)

    console.log("<OfferingDetails />:requiredPaymentDetails", requiredPaymentDetails)


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
            setShowModal(true)
        }

        setShowModal(true)
    }

    const handleOk = () => {
        setIsLoading(true)
        if (isRequestQuote) {
            // Here ==>
            console.log("requiredPaymentDetails Make Transfer", {
                requiredPaymentDetails,
                credentials,
                userBearerDid,
                stateCredentials
            })

            createExchange({
                requiredPaymentDetails,
                credentials,
                userBearerDid,
                amount: campaignAmount,
                offering: rawOffering,
                stateCredentials
            })
        } else {
            console.log("requiredPaymentDetails Make Transfer", {
                requiredPaymentDetails
            })
            setShowModal(false);
        }
    };

    const handleCancel = async () => {
        const TBDEX_CANCEL_REASON = 'Cancalled transaction'

        if (isRequestQuote) {
            setShowModal(false);
        } else {
            // To Do: Send close message
            const closeMessage = await sendCloseMessage({
                pfiDid,
                userBearerDid,
                reason: TBDEX_CANCEL_REASON,
                exchangeId: relevantExchange?.rfq?.rfqId,
            })
            console.log("Cancel Message", closeMessage)
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
                userBearerDid={userBearerDid}
                isRequestQuote={isRequestQuote}
                campaignAmount={campaignAmount}
                createExchange={createExchange}
                relevantExchange={relevantExchange}
                setActivateButton={setActivateButton}
                offeringCreatedAt={offeringCreatedAt}
                requiredPaymentDetails={requiredPaymentDetails}
                setPaymentDetails={setRequiredPaymentDetails}
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

    useEffect(() => {
        pollExchanges(userBearerDid, setRelevantExchanges)
    }, [])
    useEffect(() => {

        const exchangeOfferingId = relevantExchange?.rfq?.offeringId
        const isRelevant = exchangeOfferingId === offeringId

        if (isRelevant) {
            setIsLoading(false)
            setPaymentState(PaymentStage.MAKE_TRANSFER)
        }

        console.log("relevantExchange:iiisndie", { relevantExchange, isRelevant, requiredPaymentDetails })
    }, [relevantExchange])

    const isButtonDisabled = !activateButton

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
                    <Button loading={isLoading} key="submit" type="primary" onClick={handleOk} disabled={isButtonDisabled}>
                        {submitText}
                    </Button>
                ] : []}
            >
                {
                    isLoading
                        ? <Spin>
                            {flow}
                        </Spin>
                        : flow
                }
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
                isRecommended={Boolean(pfiName)}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
            />
        </List.Item>

    )
}


export default OfferingDetails
