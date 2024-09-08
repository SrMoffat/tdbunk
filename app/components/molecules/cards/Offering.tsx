import AssetExchangeOffer from "@/app/components/atoms/OfferDetails";
import AssetExchangePFIDetails from "@/app/components/molecules/cards/OfferingPFIDetails";
import CredentialsForm from '@/app/components/molecules/forms/Credentials';
import MakePayment from "@/app/components/molecules/forms/MakePayment";
import { Credentials } from "@/app/components/organisms/Credentials";
import { INTERVALS_LOCAL_STORAGE_KEY, MARKET_CONVERSION_RATE_LOCAL_STORAGE_KEY, PFIs, SETTLED_TRANSFER_AT_LOCAL_STORAGE_KEY, STARTED_TRANSFER_AT_LOCAL_STORAGE_KEY, TBDEX_MESSAGE_TYPES_TO_STATUS, TDBUNK_CANCEL_REASON } from "@/app/lib/constants";
import { pollExchanges, sendCloseMessage, sendOrderMessage } from "@/app/lib/tbdex";
import { displayTimeWithLabel, getCurrencyFlag, getEstimatedSettlementTime } from "@/app/lib/utils";
import { createOfferingReviewCredential } from "@/app/lib/web5";
import { useNotificationContext } from "@/app/providers/NotificationProvider";
import { Offering } from "@tbdex/http-client";
import { Button, List, Modal, Rate, Flex, Typography, Input, Tag, Card } from "antd";
import { formatDistanceToNow, differenceInSeconds } from 'date-fns';
import { SetStateAction, useEffect, useState } from "react";

const ReviewOffering = (props: any) => {
    const { offering, setOfferingReview } = props

    const { 1: toMethods } = offering.pair

    console.log("Offering ", offering)

    const { timeWithLabel: estimatedTime, timeInSeconds } = getEstimatedSettlementTime(toMethods.methods, true);

    const [value, setValue] = useState(0);
    const [comment, setComment] = useState('');
    const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

    const startTime = new Date() // localStorage?.getItem(STARTED_TRANSFER_AT_LOCAL_STORAGE_KEY)
    const end = new Date()
    const endTime = end.setHours(end.getHours() + 1) // localStorage?.getItem(SETTLED_TRANSFER_AT_LOCAL_STORAGE_KEY)

    const txnTime = differenceInSeconds(endTime, startTime)
    const txnTimeWithLabel = displayTimeWithLabel(txnTime)

    const marketRate = localStorage.getItem(MARKET_CONVERSION_RATE_LOCAL_STORAGE_KEY)

    useEffect(() => {
        const reviewSubmission = {
            offeringId: offering?.id,
            estimatedSettlement: timeInSeconds,
            actualSettlement: txnTime,
            marketRate,
            offeringRate: toMethods.unit,
            stars: value,
            comment
        };
        console.log("Review Subnission", reviewSubmission)
        setOfferingReview(reviewSubmission)

    }, [value, comment])

    return (
        <Flex gap="middle" vertical>
            <Flex className="gap-4">
                <Card>
                    <Flex className="flex-col gap-1 flex">
                        <Typography.Text className="font-extrabold">Settlement Time</Typography.Text>
                        <Flex className="gap-1">
                            <Typography.Text>Estimated:</Typography.Text>
                            <Tag>{estimatedTime}</Tag>
                        </Flex>
                        <Flex className="gap-1">
                            <Typography.Text>Actual:</Typography.Text>
                            <Tag>{txnTimeWithLabel}</Tag>
                        </Flex>
                    </Flex>
                </Card>
                <Card>
                    <Flex className="flex-col gap-1 flex">
                        <Typography.Text className="font-extrabold">Exchange Rate</Typography.Text>
                        <Flex className="gap-1">
                            <Typography.Text>Market Rate:</Typography.Text>
                            <Tag>{marketRate}</Tag>
                        </Flex>
                        <Flex className="gap-1">
                            <Typography.Text>Offering Rate:</Typography.Text>
                            <Tag>{toMethods.unit}</Tag>
                        </Flex>
                    </Flex>
                </Card>
            </Flex>
            <Typography.Text>How would you rate the experience with the transfer?</Typography.Text>
            <Flex>
                <Tag className="items-center p-2">
                    <Rate tooltips={desc} onChange={setValue} value={value} style={{ color: '#CC9933' }} />
                </Tag>
            </Flex>
            {
                value
                    ? (
                        <Input.TextArea
                            value={comment}
                            onChange={(e) => setComment(e?.target?.value)}
                            placeholder="Comment on the experience with the transfer."
                            autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                    )
                    : null
            }

        </Flex>
    )
}

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
        web5,
        money,
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
        selectedOffering,
        setSelectedOffering,
        unformattedOfferings,
    } = props

    console.log("<OfferingDetails />", {
        selectedOffering
    })

    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [isCancelled, setIsCancelled] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)
    const [activateButton, setActivateButton] = useState(false)
    const [offeringReview, setOfferingReview] = useState({})
    const [notifiedCompletion, setNotifiedCompletion] = useState(false)
    const [relevantExchange, setRelevantExchanges] = useState<any>()
    const [requiredPaymentDetails, setRequiredPaymentDetails] = useState<any>({
        payin: {},
        payout: {}
    })
    const { notify } = useNotificationContext()
    const [paymentStage, setPaymentStage] = useState<PaymentStage>(PaymentStage.REQUEST_QUOTE)

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

    const clearAllPollingTimers = () => {
        const storedIntervals = localStorage.getItem(INTERVALS_LOCAL_STORAGE_KEY)
        if (storedIntervals) {
            const existingIntervals = JSON.parse(storedIntervals)
            const newIntervals = [...existingIntervals]
            clearAllIntervals(newIntervals)
        }
    }

    const showPaymentModal = () => {
        const isReadyForQuote = hasRequiredCredentials && isSelected

        if (isReadyForQuote) {
            setShowModal(true)
        }

        setShowModal(true)
    }

    const handleOk = async () => {
        setIsLoading(true)

        if (isCancelled) return

        if (isCompleted) {
            // Create review VC
            const status = await createOfferingReviewCredential(
                web5,
                userBearerDid,
                {
                    ...offeringReview,
                    pfiDid
                }
            )

            if(status?.status.code === 202){
                setIsLoading(false)
                notify?.('success', {
                    message: 'Review Submitted!',
                    description: 'Your review of  the transaction has submitted!'
                })
            }

            setShowModal(false)
        } else if (isRequestQuote) {
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
            // Start timer for the transfer
            localStorage?.setItem(STARTED_TRANSFER_AT_LOCAL_STORAGE_KEY, JSON.stringify(new Date()))

            // To Do: Check if the offering allows cancellations also aler user after they request quote
            const orderMessage = await sendOrderMessage({
                pfiDid,
                userBearerDid,
                exchangeId: relevantExchange?.mostRecentMessage?.metadata?.exchangeId,
            })

            if (orderMessage) {
                console.log("Close modal and toast success txn complete", orderMessage)
                // setShowModal(false);
                // setIsCompleted(true)
            }

            clearAllPollingTimers()
        }
    };

    const handleCancel = async () => {
        if (isCompleted) {
            // Create a VC without user review?
            console.log("Canelled out of a review of PFI", offeringReview)
        } else if (isRequestQuote || isCancelled) {
            setShowModal(false);
        } else {
            setIsCancelling(true)
            // Start Timer for Cancelling

            // To Do: Check if the offering allows cancellations also aler user after they request quote
            const closeMessage = await sendCloseMessage({
                pfiDid,
                userBearerDid,
                reason: TDBUNK_CANCEL_REASON,
                exchangeId: relevantExchange?.mostRecentMessage?.metadata?.exchangeId,
            })

            if (closeMessage) {
                console.log("Cancel Message returned", closeMessage)
                // End Timer for Cancelling

                // To Do: Reset form and all relevant state

            }

            clearAllPollingTimers()
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
                money={money}
                pfiDid={pfiDid}
                pfiName={pfiName}
                offering={rawOffering}
                userBearerDid={userBearerDid}
                isRequestQuote={isRequestQuote}
                campaignAmount={campaignAmount}
                createExchange={createExchange}
                relevantExchange={relevantExchange}
                isLoading={isLoading || isCancelling}
                setActivateButton={setActivateButton}
                offeringCreatedAt={offeringCreatedAt}
                requiredPaymentDetails={requiredPaymentDetails}
                setPaymentDetails={setRequiredPaymentDetails}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
            />
            : <Credentials
                offering={values}
                isSelected={isSelected}
                credentials={credentials}
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
            }} isCreatingCredential={false} />

    const issuerDid = offeringRequiredClaims?.['vc.issuer'] || offeringRequiredClaims?.['issuer']
    const issuerVcSchema = offeringRequiredClaims?.['vc.credentialSchema.id'] || offeringRequiredClaims?.['credentialSchem[*].id']

    const isPaymentStep = hasRequiredCredentials && isSelected

    const destinationCurrencyCode = rawOffering?.data?.payout?.currencyCode


    const cancelText = isRequestQuote
        ? 'Cancel'
        : `${isCancelled ? 'Close' : 'Cancel Transfer'}`

    const submitText = isRequestQuote
        ? 'Request for Quote'
        : isCompleted
            ? 'Review Transfer'
            : `Transfer ${destinationCurrencyCode} ${campaignAmount}`

    useEffect(() => {
        const intervalId = pollExchanges(userBearerDid, setRelevantExchanges)
        const storedIntervals = localStorage.getItem(INTERVALS_LOCAL_STORAGE_KEY)

        if (storedIntervals) {
            const existingIntervals = JSON.parse(storedIntervals)
            const newIntervals = [...existingIntervals, intervalId]
            localStorage.setItem(INTERVALS_LOCAL_STORAGE_KEY, JSON.stringify(newIntervals))
        } else {
            localStorage.setItem(INTERVALS_LOCAL_STORAGE_KEY, JSON.stringify([intervalId]))
        }
    }, [])

    useEffect(() => {
        if (relevantExchange) {
            const paymentState = paymentStage === PaymentStage.MAKE_TRANSFER
            const receivedQuote = relevantExchange.status === TBDEX_MESSAGE_TYPES_TO_STATUS.QUOTE
            const cancelledTransfer = relevantExchange.status === TBDEX_MESSAGE_TYPES_TO_STATUS.CLOSE
            const completedTransfer = relevantExchange.status === TBDEX_MESSAGE_TYPES_TO_STATUS.CLOSE_SUCCESS

            if (receivedQuote && !paymentState) {
                setPaymentStage(PaymentStage.MAKE_TRANSFER)
                setIsLoading(false)
            }

            if (cancelledTransfer && paymentState) {
                setIsCancelling(false)
                setActivateButton(false)
                setIsCancelled(true)
            }

            if (completedTransfer) {
                setIsCompleted(true)
                setIsLoading(false)
                // setShowModal(false)
                console.log("Transfer complete")
            }
        }

        console.log("received message", relevantExchange)
    }, [relevantExchange])

    useEffect(() => {
        if (isCancelled) {
            notify?.('error', {
                message: 'Transaction Cancelled!',
                description: 'Your transaction has been cancelled!'
            })
            // setIsCancelled(false)
        }
    }, [isCancelled])

    useEffect(() => {
        if (isCompleted && !notifiedCompletion) {
            // End timer for the transfer
            localStorage?.setItem(SETTLED_TRANSFER_AT_LOCAL_STORAGE_KEY, JSON.stringify(new Date()))

            // To Do: Reset form and all relevant state
            notify?.('success', {
                message: 'Transaction Complete!',
                description: 'Your transaction has been completed succesfully!'
            })
            setNotifiedCompletion(true)
            // setIsCompleted(false)
        }
    }, [isCompleted])

    const isButtonDisabled = !activateButton

    console.log("Required Claims Exists", offering?.requiredClaimsExist)


    return (
        <List.Item className="flex flex-row gap-2">
            <Modal
                width={800}
                open={showModal}
                title={isCompleted ? 'Review Offering' : modalTitle}
                footer={isPaymentStep || isCompleted ? [
                    <Button danger key="back" onClick={handleCancel} loading={isCancelling}>
                        {cancelText}
                    </Button>,
                    <Button loading={isLoading} key="submit" type="primary" onClick={handleOk} disabled={isCompleted ? false : isButtonDisabled || isCancelling}>
                        {submitText}
                    </Button>
                ] : []}
            >
                {
                    isCompleted
                        ? <ReviewOffering offering={offering} setOfferingReview={setOfferingReview} />
                        : flow
                }
            </Modal>
            <AssetExchangePFIDetails
                cta={cta}
                fromUnit="1.0"
                pfiDid={pfiDid}
                pfiName={pfiName}
                offering={rawOffering}
                toUnit={offeringToCurrency?.unit}
                selectedOffering={selectedOffering}
                showPaymentModal={showPaymentModal}
                offeringCreatedAt={offeringCreatedAt}
                setSelectedOffering={setSelectedOffering}
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
                hasRequiredClaims={offering?.requiredClaimsExist}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
            />
        </List.Item>

    )
}


export default OfferingDetails
