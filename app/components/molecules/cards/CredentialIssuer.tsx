import useBrowserStorage from "@/app/hooks/useLocalStorage";
import { CREDENTIAL_TYPES, CREDENTIALS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY } from "@/app/lib/constants";
import { getCurrencyFromCountry, toCapitalizedWords } from "@/app/lib/utils";
import { createEducationalCredential, createFinancialCredential, createGovernmentCredential, createProfessionalCredential } from "@/app/lib/web5";
import countries from '@/public/countries.json';
import { useMutation } from '@tanstack/react-query';
import { Button, Card, Flex, Modal, Tag, Typography } from "antd";
import Image from "next/image";
import { useState } from "react";
import { CredentialStorage } from "../forms/Credentials";
import EducationalCredentialForm from "../forms/EducationalCredential";
import FinancialCredentialForm from "../forms/FinancialCredential";
import GovernmentCredentialForm from "../forms/GovernmentCredential";
import ProfessionalCredentialForm from "../forms/ProfessionalCredential";
import { useNotificationContext } from "@/app/providers/NotificationProvider";

const CredentialIssuerCard = (props: any) => {
    const {
        type,
        card,
        logo,
        issuerName,
        noCredentialsFound,
        stateCredentials,
        nextButtonDisabled,
        localStorageCredentials,

        setUserDid,
        setCredentials,
        setWeb5Instance,
        setUserBearerDid,
        setRecoveryPhrase,
        setNextButtonDisabled,
        setCreatedCredentialType
    } = props
    const { notify } = useNotificationContext()

    const [localStorageData, setLocalCredentials] = useBrowserStorage<CredentialStorage>(
        CREDENTIALS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )

    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        [CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL]: {},
        [CREDENTIAL_TYPES.GOVERNMENT_CREDENTIAL]: {},
        [CREDENTIAL_TYPES.PROFESSIONAL_CREDENTIAL]: {},
        [CREDENTIAL_TYPES.EDUCATIONAL_CREDENTIAL]: {},
    })

    const financialCredential = type === CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL
    const governmentCredential = type === CREDENTIAL_TYPES.GOVERNMENT_CREDENTIAL
    const professionalCredential = type === CREDENTIAL_TYPES.PROFESSIONAL_CREDENTIAL
    const educationalCredential = type === CREDENTIAL_TYPES.EDUCATIONAL_CREDENTIAL

    // TO DO: Clean this up 🤢
    const flow = financialCredential
        ? <FinancialCredentialForm setFormData={setFormData} />
        : governmentCredential
            ? <GovernmentCredentialForm setFormData={setFormData} />
            : professionalCredential
                ? <ProfessionalCredentialForm setFormData={setFormData} />
                : educationalCredential
                    ? <EducationalCredentialForm setFormData={setFormData} />
                    : 'Here'

    const successMessage = () => {
        notify?.('success', {
            message: 'Credential Created!',
            description: 'Your credential has been sucesfully created!'
        })
    }

    const { isPending: financialIsPending, mutateAsync: createFinancialCredentialMutation } = useMutation({
        mutationFn: createFinancialCredential,
        onSuccess: (result: any) => {
            const {
                did,
                web5,
                storedVc,
                bearerDid,
                recoveryPhrase
            } = result
            // const defaultCurrencyFromCredential = getCurrencyFromCountry(countries, details?.country?.value)

            console.log("Result", result)
            setUserDid?.(did)
            setWeb5Instance?.(web5)
            setUserBearerDid?.(bearerDid)
            setRecoveryPhrase?.(recoveryPhrase)
            setCredentials?.(storedVc)
            setLocalCredentials({
                did,
                credentials: storedVc,
                // defaultCurrency: defaultCurrencyFromCredential,
            })
            setNextButtonDisabled(false)
            successMessage()
            onClose()
        },
        onError: (error: any) => {
            console.log("Errpr", error)

            // setNextButtonDisabled(true)
            // notify?.('error', {
            //     message: 'Credential Creation Failed!',
            //     description: 'Something went wrong. Please try again.'
            // })
        }
    })
    const { isPending: governmentIsPending, mutateAsync: createGovernmentCredentialMutation } = useMutation({
        mutationFn: createGovernmentCredential,
        onSuccess: (result: any) => {
            const {
                did,
                web5,
                storedVc,
                bearerDid,
                recoveryPhrase
            } = result as any
            console.log("Result:governement", result)
            // const defaultCurrencyFromCredential = getCurrencyFromCountry(countries, details?.country?.value)

            setUserDid?.(did)
            setWeb5Instance?.(web5)
            setUserBearerDid?.(bearerDid)
            setRecoveryPhrase?.(recoveryPhrase)
            setCredentials?.(storedVc)
            setLocalCredentials({
                did,
                credentials: storedVc,
                // defaultCurrency: defaultCurrencyFromCredential,
            })
            // setNextButtonDisabled(false)
            successMessage()
            onClose()
        },
        onError: () => {
            // setNextButtonDisabled(true)
            // notify?.('error', {
            //     message: 'Credential Creation Failed!',
            //     description: 'Something went wrong. Please try again.'
            // })
        }
    })

    const { isPending: professionalIsPending, mutateAsync: createProfessionalCredentialMutation } = useMutation({
        mutationFn: createProfessionalCredential,
        onSuccess: (result: any) => {
            const {
                did,
                web5,
                storedVc,
                bearerDid,
                recoveryPhrase
            } = result as any
            console.log("Result:professional", result)
            // const defaultCurrencyFromCredential = getCurrencyFromCountry(countries, details?.country?.value)

            setUserDid?.(did)
            setWeb5Instance?.(web5)
            setUserBearerDid?.(bearerDid)
            setRecoveryPhrase?.(recoveryPhrase)
            setCredentials?.(storedVc)
            setLocalCredentials({
                did,
                credentials: storedVc,
                // defaultCurrency: defaultCurrencyFromCredential,
            })
            // setNextButtonDisabled(false)
            successMessage()
            onClose()
        },
        onError: () => {
            // setNextButtonDisabled(true)
            // notify?.('error', {
            //     message: 'Credential Creation Failed!',
            //     description: 'Something went wrong. Please try again.'
            // })
        }
    })

    const { isPending: educationalIsPending, mutateAsync: createEducationalCredentialMutation } = useMutation({
        mutationFn: createEducationalCredential,
        onSuccess: (result: any) => {
            const {
                did,
                web5,
                storedVc,
                bearerDid,
                recoveryPhrase
            } = result as any
            console.log("Result:educational", result)
            // const defaultCurrencyFromCredential = getCurrencyFromCountry(countries, details?.country?.value)

            setUserDid?.(did)
            setWeb5Instance?.(web5)
            setUserBearerDid?.(bearerDid)
            setRecoveryPhrase?.(recoveryPhrase)
            setCredentials?.(storedVc)
            setLocalCredentials({
                did,
                credentials: storedVc,
                // defaultCurrency: defaultCurrencyFromCredential,
            })
            // setNextButtonDisabled(false)
            successMessage()
            onClose()
        },
        onError: () => {
            // setNextButtonDisabled(true)
            // notify?.('error', {
            //     message: 'Credential Creation Failed!',
            //     description: 'Something went wrong. Please try again.'
            // })
        }
    })

    const isLoading = financialIsPending || governmentIsPending || professionalIsPending || educationalIsPending

    const handleOk = async () => {
        const keys = Object.keys(formData)

        for (const key of keys) {
            // @ts-ignore
            const details = formData[key]

            if (Object.keys(details).length) {
                const defaultCurrencyFromCredential = getCurrencyFromCountry(countries, details?.country?.value)

                // TO DO: Clean this up 🤢
                if (financialCredential) {
                    setCreatedCredentialType(CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL)
                    await createFinancialCredentialMutation(details)
                } else if (governmentCredential) {
                    setCreatedCredentialType(CREDENTIAL_TYPES.GOVERNMENT_CREDENTIAL)
                    await createGovernmentCredentialMutation(details)
                } else if (professionalCredential) {
                    setCreatedCredentialType(CREDENTIAL_TYPES.PROFESSIONAL_CREDENTIAL)
                    await createProfessionalCredentialMutation(details)
                } else if (educationalCredential) {
                    setCreatedCredentialType(CREDENTIAL_TYPES.EDUCATIONAL_CREDENTIAL)
                    await createEducationalCredentialMutation(details)
                }
            }
        }
        setShowModal(false);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const onClose = () => {
        setShowModal(false);
    };


    return (
        <>
            <Modal
                width={800}
                open={showModal}
                onClose={onClose}
                title={`Request ${toCapitalizedWords(type)}`}
                footer={[
                    <Button danger key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Request Credential
                    </Button>
                ]}
            >
                <Flex className="m-4">
                    {flow}
                </Flex>
            </Modal>
            <Card className="w-1/3">
                <Flex className="items-center justify-between">
                    <Flex className="gap-3">
                        <Image className="mr-3" alt={issuerName} width={50} height={50} src={logo} />
                        <Flex className="flex-col">
                            <Typography.Title level={5} style={{ marginTop: -4 }}>
                                {issuerName}
                            </Typography.Title>
                            <Tag color="gold">
                                {toCapitalizedWords(type)}
                            </Tag>
                            <Flex className="mt-3">
                                <Button onClick={() => setShowModal(true)} type="primary">Request Credential</Button>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex className="flex-col gap-2">
                        <Image alt="card" src={card} width={150} height={150} />
                    </Flex>
                </Flex>
            </Card>
        </>
    );
};

export default CredentialIssuerCard;
