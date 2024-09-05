import AssetExchangeOffer from "@/app/components/atoms/OfferDetails";
import AssetExchangePFIDetails from "@/app/components/molecules/cards/OfferingPFIDetails";
import CredentialsForm from '@/app/components/molecules/forms/Credentials';
import MakePayment from "@/app/components/molecules/forms/MakePayment";
import { Credentials } from "@/app/components/organisms/Credentials";
import { INTERVALS_LOCAL_STORAGE_KEY, PFIs } from "@/app/lib/constants";
import { pollExchanges, sendCloseMessage, sendOrderMessage } from "@/app/lib/tbdex";
import { getCurrencyFlag } from "@/app/lib/utils";
import { useNotificationContext } from "@/app/providers/NotificationProvider";
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

function clearAllIntervals(intervalIds: string[]) {
    for (const interval of intervalIds) {
        console.log("Clearing interval with ID:", interval)
        window && window.clearInterval(interval);
    }
    localStorage && localStorage.removeItem(INTERVALS_LOCAL_STORAGE_KEY)
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
    const { notify } = useNotificationContext()
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
            setShowModal(true)
        }

        setShowModal(true)
    }

    const handleOk = async () => {
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
            // To Do: Check if the offering allows cancellations also aler user after they request quote

            const orderMessage = await sendOrderMessage({
                pfiDid,
                userBearerDid,
                exchangeId: relevantExchange?.rfq?.rfqId,
            })

            console.log("Order Message returned", orderMessage)
            // setShowModal(false);
        }
    };

    const handleCancel = async () => {
        const TBDEX_CANCEL_REASON = 'User cancelled transaction.'

        if (isRequestQuote) {
            setShowModal(false);
        } else {
            // To Do: Check if the offering allows cancellations also aler user after they request quote
            const closeMessage = await sendCloseMessage({
                pfiDid,
                userBearerDid,
                reason: TBDEX_CANCEL_REASON,
                exchangeId: relevantExchange?.rfq?.rfqId,
            })

            console.log("Cancel Message returned", closeMessage)

            if (closeMessage) {
                notify?.('error', {
                    message: 'Transaction Cancelled!',
                    description: 'Your transaction has been cancelled!'
                })
            }

            const storedIntervals = localStorage.getItem(INTERVALS_LOCAL_STORAGE_KEY)
            if (storedIntervals) {
                const existingIntervals = JSON.parse(storedIntervals)
                const newIntervals = [...existingIntervals]
                clearAllIntervals(newIntervals)
            }
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
                isLoading={isLoading}
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
            setUserBearerDid={undefined} setIsCreatingCredential={function (value: SetStateAction<boolean>): void {
                throw new Error("Function not implemented.");
            }} />

    const issuerDid = offeringRequiredClaims?.['vc.issuer'] || offeringRequiredClaims?.['issuer']
    const issuerVcSchema = offeringRequiredClaims?.['vc.credentialSchema.id'] || offeringRequiredClaims?.['credentialSchem[*].id']

    const isPaymentStep = hasRequiredCredentials && isSelected

    const destinationCurrencyCode = rawOffering?.data?.payout?.currencyCode


    const cancelText = isRequestQuote
        ? 'Cancel'
        : 'Cancel Transfer'

    const submitText = isRequestQuote
        ? 'Request for Quote'
        : `Transfer ${destinationCurrencyCode} ${campaignAmount}`

    useEffect(() => {
        const intervalId = pollExchanges(userBearerDid, setRelevantExchanges)
        const storedIntervals = localStorage.getItem(INTERVALS_LOCAL_STORAGE_KEY)
        
        if (storedIntervals){
            const existingIntervals = JSON.parse(storedIntervals)
            const newIntervals = [...existingIntervals, intervalId]
            localStorage.setItem(INTERVALS_LOCAL_STORAGE_KEY, JSON.stringify(newIntervals))
        } else {
            localStorage.setItem(INTERVALS_LOCAL_STORAGE_KEY, JSON.stringify([intervalId]))
        }
    }, [])

    useEffect(() => {

        // const exchangeOfferingId = relevantExchange?.rfq?.offeringId
        // const isRelevant = exchangeOfferingId === offeringId

        // if (isRelevant) {
        //     setIsLoading(false)
        //     setPaymentState(PaymentStage.MAKE_TRANSFER)
        // }

        console.log("relevantExchange:iiisndie", { relevantExchange })
        // console.log("relevantExchange:iiisndie", { relevantExchange, isRelevant, requiredPaymentDetails })
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
                isRecommended={Boolean(pfiName)}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
            />
        </List.Item>

    )
}


export default OfferingDetails
