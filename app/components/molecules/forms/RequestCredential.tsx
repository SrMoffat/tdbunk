"use client"
import { Card1, Card3, Card4, Card5, LogoIcon2, TBDVCLogoWhite, TBDVCLogoYellow } from '@/app/components/atoms/Icon';
import {
    CredentialIssuerCard,
    EducationCredentialCard,
    // FinancialCredentialCard,
    GovernmentCredentialCard,
    ProfessionalCredentialCard
} from '@/app/components/molecules/cards';
import FinancialInstitutionCredential from '@/app/components/molecules/cards/FinancialCredential';
import { CredentialStorage } from '@/app/components/molecules/forms/Credentials';
import FinancialCredentialForm from "@/app/components/molecules/forms/FinancialCredential";
import useBrowserStorage from '@/app/hooks/useLocalStorage';
import { CREDENTIAL_TYPES, CREDENTIALS_LOCAL_STORAGE_KEY, CREDENTIALS_TYPE_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY, TDBUNK_ISSUER_NAME, ULTIMATE_IDENTITY_ISSUER_NAME } from '@/app/lib/constants';
import { getCurrencyFromCountry } from '@/app/lib/utils';
import { createRequiredCredential } from '@/app/lib/web5';
import countries from '@/public/countries.json';
import { Alert, Button, Collapse, CollapseProps, Flex, Modal, Typography } from 'antd';
import { useState } from 'react';

const getSelectedCredentialType = () => {
    const storedValue = localStorage.getItem(CREDENTIALS_TYPE_LOCAL_STORAGE_KEY)

    const financialCredential = storedValue === CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL
    const governmentCredential = storedValue === CREDENTIAL_TYPES.GOVERNMENT_CREDENTIAL
    const professionalCredential = storedValue === CREDENTIAL_TYPES.PROFESSIONAL_CREDENTIAL
    const educationalCredential = storedValue === CREDENTIAL_TYPES.EDUCATIONAL_CREDENTIAL

    return financialCredential
        ? CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL
        : governmentCredential
            ? CREDENTIAL_TYPES.GOVERNMENT_CREDENTIAL
            : professionalCredential
                ? CREDENTIAL_TYPES.PROFESSIONAL_CREDENTIAL
                : educationalCredential
                    ? CREDENTIAL_TYPES.EDUCATIONAL_CREDENTIAL
                    : CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL

}

const RequestCredential = (props: any) => {
    const {
        web5,
        userDid,

        stateCredentials,
        noCredentialsFound,
        nextButtonDisabled,
        hasRequiredCredentials,
        localStorageCredentials,

        setUserDid,
        setCredentials,
        setWeb5Instance,
        setUserBearerDid,
        setRecoveryPhrase,
        setNextButtonDisabled,
        setHasRequiredCredentials
    } = props

    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [createdCredentialType, setCreatedCredentialType] = useState<CREDENTIAL_TYPES>(getSelectedCredentialType())


    const commonProps = {
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
        setCreatedCredentialType,
    }

    const credentialsTypes = [
        {
            type: CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL,
            issuerName: ULTIMATE_IDENTITY_ISSUER_NAME,
            logo: TBDVCLogoWhite,
            card: Card1
        },
        {
            type: CREDENTIAL_TYPES.GOVERNMENT_CREDENTIAL,
            issuerName: TDBUNK_ISSUER_NAME,
            logo: LogoIcon2,
            card: Card5
        },
        {
            type: CREDENTIAL_TYPES.PROFESSIONAL_CREDENTIAL,
            issuerName: TDBUNK_ISSUER_NAME,
            logo: LogoIcon2,
            card: Card3
        },
        {
            type: CREDENTIAL_TYPES.EDUCATIONAL_CREDENTIAL,
            issuerName: TDBUNK_ISSUER_NAME,
            logo: LogoIcon2,
            card: Card4
        },
    ]

    const financialProps = {
        ...credentialsTypes[0],
        ...commonProps
    }

    const governmentProps = {
        ...credentialsTypes[1],
        ...commonProps
    }

    const professionalProps = {
        ...credentialsTypes[2],
        ...commonProps
    }

    const educationalProps = {
        ...credentialsTypes[3],
        ...commonProps
    }

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Financial Insitution',
            children:
                <CredentialIssuerCard {...financialProps} />
        },
        {
            key: '2',
            label: 'Government Institution',
            children:
                <CredentialIssuerCard {...governmentProps} />
        },
        {
            key: '3',
            label: 'Professional Institution',
            children:
                <CredentialIssuerCard {...professionalProps} />
        },
        {
            key: '4',
            label: 'Educational Institution',
            children:
                <CredentialIssuerCard {...educationalProps} />
        },
    ];

    const [formData, setFormData] = useState({})
    const [showCombinedCredentials, setCombinedCredentials] = useState(false)

    const [_, setLocalCredentials] = useBrowserStorage<CredentialStorage>(
        CREDENTIALS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )

    const hasCredentials = !noCredentialsFound

    const onClose = () => {
        setShowModal(false);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const handleOk = async () => {
        setIsLoading(true)
        // @ts-ignore
        const details = formData[CREDENTIAL_TYPES.FINANCIAL_CREDENTIAL]

        const result = await createRequiredCredential(web5, userDid, details)
        const {
            did,
            storedVc,
        } = result as any

        const defaultCurrencyFromCredential = getCurrencyFromCountry(countries, details?.country?.value)

        const combinedCreds = {
            ...stateCredentials,
            ...localStorageCredentials,
            ...storedVc
        }

        setCredentials?.(combinedCreds)
        setLocalCredentials({
            did,
            credentials: combinedCreds,
            defaultCurrency: defaultCurrencyFromCredential,
        })
        setNextButtonDisabled(false)
        setShowModal(false)
        setCombinedCredentials(true)
        setIsLoading(false)
        // setHasRequiredCredentials?.(true)
    };

    const financialCredential = createdCredentialType === CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL
    const governmentCredential = createdCredentialType === CREDENTIAL_TYPES.GOVERNMENT_CREDENTIAL
    const professionalCredential = createdCredentialType === CREDENTIAL_TYPES.PROFESSIONAL_CREDENTIAL
    const educationalCredential = createdCredentialType === CREDENTIAL_TYPES.EDUCATIONAL_CREDENTIAL

    // TO DO: Clean this up 🤢
    const credentialCard = financialCredential
        ? <FinancialInstitutionCredential
            stateCredentials={stateCredentials}
            localStorageCredentials={localStorageCredentials}
        />
        : governmentCredential
            ? <GovernmentCredentialCard
                stateCredentials={stateCredentials}
                localStorageCredentials={localStorageCredentials}
            />
            : professionalCredential
                ? <ProfessionalCredentialCard
                    stateCredentials={stateCredentials}
                    localStorageCredentials={localStorageCredentials}
                />
                : educationalCredential
                    ? <EducationCredentialCard
                        stateCredentials={stateCredentials}
                        localStorageCredentials={localStorageCredentials}
                    />
                    : 'Here'


    const credentialTypes = Object.keys(stateCredentials)
    const financialCredType = CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL
    const financialCred = credentialTypes.filter((entry: any) => entry?.includes(financialCredType))
    const isFinancialCred = financialCred?.length
    const finCred = isFinancialCred ? stateCredentials[financialCred[0]][0] : ''

    const checkIfUserHasCredentialInLocal = (credentials: any) => {
        let result = false

        if (credentials) {
            const storedCredentials = Object.keys(credentials)
            const hasRequiredCredInLocalStorage = storedCredentials.find((entry: any) => {
                const credentialType = entry?.split(":")[1]
                return credentialType === CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL
            })


            result = Boolean(hasRequiredCredInLocalStorage)
        }

        return result
    }

    const hasRequiredCredInLocalStorage = checkIfUserHasCredentialInLocal(localStorageCredentials)

    return (
        <Flex className="flex-col">
            <Modal
                width={800}
                open={showModal}
                onClose={onClose}
                title="Request Credential"
                footer={[
                    <Button danger key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={isLoading} onClick={handleOk}>
                        Request Credential
                    </Button>
                ]}
            >
                <FinancialCredentialForm setFormData={setFormData} />
            </Modal>
            {!hasCredentials && <Typography.Text className="font-bold mb-4">Verifiable Credential Issuers</Typography.Text>}
            {
                hasCredentials
                    ? showCombinedCredentials || hasRequiredCredInLocalStorage
                        ? <Flex className="w-1/2 self-center items-center justify-center gap-4">
                            <Flex className="w-1/2 items-end">
                                <FinancialInstitutionCredential
                                    credential={finCred}
                                    stateCredentials={stateCredentials}
                                    localStorageCredentials={localStorageCredentials}
                                />
                            </Flex>
                            <Flex className="w-1/2">
                                {credentialCard}
                            </Flex>
                        </Flex>
                        : <Flex className="flex-col gap-4 items-center">
                            <Flex>
                                <Alert
                                    message="Missing Credentials"
                                    showIcon
                                    description="You have created a credential but you are yet to create a required one."
                                    type="warning"
                                    action={
                                        <Button onClick={() => setShowModal(true)} className="ml-3" type="primary">
                                            Request Credential
                                        </Button>
                                    }
                                />
                            </Flex>
                            <Flex className="w-full justify-center">
                                <Flex className="w-1/6">
                                    {credentialCard}
                                </Flex>
                            </Flex>
                        </Flex>
                    : <Collapse accordion items={items} />
            }
        </Flex>
    );
};

export default RequestCredential;
