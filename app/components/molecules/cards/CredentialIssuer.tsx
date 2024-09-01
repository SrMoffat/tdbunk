import { CREDENTIAL_TYPES, CREDENTIALS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY } from "@/app/lib/constants";
import { getCurrencyFromCountry, toCapitalizedWords } from "@/app/lib/utils";
import { Button, Card, Flex, Tag, Typography, Modal } from "antd";
import Image from "next/image";
import { SetStateAction, useState, useEffect } from "react"
import FinancialCredentialForm from "../forms/FinancialCredential";
import GovernmentCredentialForm from "../forms/GovernmentCredential";
import ProfessionalCredentialForm from "../forms/ProfessionalCredential";
import EducationalCredentialForm from "../forms/EducationalCredential";
import { createEducationalCredential, createFinancialCredential, createGovernmentCredential, createProfessionalCredential } from "@/app/lib/web5";
import useBrowserStorage from "@/app/hooks/useLocalStorage";
import { CredentialStorage } from "../forms/Credentials";
import countries from '@/public/countries.json';
import FinancialInstitutionCredential from '@/app/components/molecules/cards/FinancialCredential';


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
        setNextButtonDisabled
    } = props

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

    const handleOk = async () => {
        const keys = Object.keys(formData)

        for (const key of keys) {
            // @ts-ignore
            const details = formData[key]

            if (Object.keys(details).length) {
                const defaultCurrencyFromCredential = getCurrencyFromCountry(countries, details?.country?.value)

                // TO DO: Clean this up 🤢
                if (financialCredential) {
                    const result = await createFinancialCredential(details)
                    const {
                        did,
                        web5,
                        storedVc,
                        bearerDid,
                        recoveryPhrase
                    } = result as any
                    console.log("Result", result)
                    setUserDid?.(did)
                    setWeb5Instance?.(web5)
                    setUserBearerDid?.(bearerDid)
                    setRecoveryPhrase?.(recoveryPhrase)
                    setCredentials?.(storedVc)
                    setLocalCredentials({
                        did,
                        credentials: storedVc,
                        defaultCurrency: defaultCurrencyFromCredential,
                    })
                    setNextButtonDisabled(false)

                } else if (governmentCredential) {
                    const result = await createGovernmentCredential(details)
                    const {
                        did,
                        web5,
                        storedVc,
                        bearerDid,
                        recoveryPhrase
                    } = result as any
                    console.log("Result", result)
                    setUserDid?.(did)
                    setWeb5Instance?.(web5)
                    setUserBearerDid?.(bearerDid)
                    setRecoveryPhrase?.(recoveryPhrase)
                    setCredentials?.(storedVc)
                    setLocalCredentials({
                        did,
                        credentials: storedVc,
                        defaultCurrency: defaultCurrencyFromCredential,
                    })
                    // setNextButtonDisabled(false)

                } else if (professionalCredential) {
                    await createProfessionalCredential(details)

                } else if (educationalCredential) {
                    await createEducationalCredential(details)

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
