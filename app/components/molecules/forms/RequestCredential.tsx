"use client"
import {
    CredentialIssuerCard,
    EducationCredentialCard,
    // FinancialCredentialCard,
    GovernmentCredentialCard,
    ProfessionalCredentialCard
} from '@/app/components/molecules/cards';
import { Collapse, CollapseProps, Flex, Typography, Modal, Alert, Button } from 'antd';
import { CREDENTIAL_TYPES, CREDENTIALS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY } from '@/app/lib/constants';
import { Card1, Card3, Card4, Card5, LogoIcon2, TBDVCLogoYellow } from '@/app/components/atoms/Icon';
import FinancialInstitutionCredential from '../cards/FinancialCredential';
import { useState } from 'react';
import FinancialCredentialForm from "../forms/FinancialCredential";
import { createFinancialCredential } from '@/app/lib/web5';
import { getCurrencyFromCountry } from '@/app/lib/utils';
import useBrowserStorage from '@/app/hooks/useLocalStorage';
import { CredentialStorage } from './Credentials';
import countries from '@/public/countries.json';


const RequestCredential = (props: any) => {
    const {
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
    } = props

    const [showModal, setShowModal] = useState(false)
    const [createdCredentialType, setCreatedCredentialType] = useState<CREDENTIAL_TYPES>()


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
        setCreatedCredentialType
    }

    const credentialsTypes = [
        {
            type: CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL,
            issuerName: "Ultimate Identity",
            logo: TBDVCLogoYellow,
            card: Card1
        },
        {
            type: CREDENTIAL_TYPES.GOVERNMENT_CREDENTIAL,
            issuerName: "TDBunk Identity",
            logo: LogoIcon2,
            card: Card5
        },
        {
            type: CREDENTIAL_TYPES.PROFESSIONAL_CREDENTIAL,
            issuerName: "TDBunk Identity",
            logo: LogoIcon2,
            card: Card3
        },
        {
            type: CREDENTIAL_TYPES.EDUCATIONAL_CREDENTIAL,
            issuerName: "TDBunk Identity",
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
                // <FinancialCredentialCard showDrawer={showDrawer} />
                <CredentialIssuerCard {...financialProps} />
        },
        {
            key: '2',
            label: 'Government Institution',
            children:
                // <GovernmentCredentialCard showDrawer={showDrawer} />
                <CredentialIssuerCard {...governmentProps} />
        },
        {
            key: '3',
            label: 'Professional Institution',
            children:
                // <ProfessionalCredentialCard showDrawer={showDrawer} />
                <CredentialIssuerCard {...professionalProps} />
        },
        {
            key: '4',
            label: 'Educational Institution',
            children:
                // <EducationCredentialCard showDrawer={showDrawer} />
                <CredentialIssuerCard {...educationalProps} />
        },
    ];

    const [formData, setFormData] = useState({})

    const [localStorageData, setLocalCredentials] = useBrowserStorage<CredentialStorage>(
        CREDENTIALS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )

    // const hasCredentials = true
    const hasCredentials = !noCredentialsFound
    const hasRequiredCredential = hasRequiredCredentials

    const onClose = () => {
        setShowModal(false);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const handleOk = async () => {
        // @ts-ignore
        const details = formData[CREDENTIAL_TYPES.FINANCIAL_CREDENTIAL]
        console.log("Request credential", details)

        // const result = await createFinancialCredential(details)
        // const {
        //     did,
        //     web5,
        //     storedVc,
        //     bearerDid,
        //     recoveryPhrase
        // } = result as any
        // console.log("Result", result)
        // const defaultCurrencyFromCredential = getCurrencyFromCountry(countries, details?.country?.value)

        // setUserDid?.(did)
        // setWeb5Instance?.(web5)
        // setUserBearerDid?.(bearerDid)
        // setRecoveryPhrase?.(recoveryPhrase)
        // setCredentials?.(storedVc)
        // setLocalCredentials({
        //     did,
        //     credentials: storedVc,
        //     defaultCurrency: defaultCurrencyFromCredential,
        // })
        // setNextButtonDisabled(false)
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


    return (
        <Flex className="flex-col">
            <Modal
                width={800}
                open={showModal}
                onClose={onClose}
                title={`Request Credential`}
                footer={[
                    <Button danger key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Request Credential
                    </Button>
                ]}
            >
                <FinancialCredentialForm setFormData={setFormData} />
            </Modal>
            {!hasCredentials && <Typography.Text className="font-bold mb-4">Verifiable Credential Issuers</Typography.Text>}
            {
                hasCredentials
                    ? hasRequiredCredential
                        ? 'All Good'
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
