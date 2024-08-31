"use client"
import {
    CredentialIssuerCard,
    EducationCredentialCard,
    // FinancialCredentialCard,
    GovernmentCredentialCard,
    MedicalCredentialCard,
    ProfessionalCredentialCard
} from '@/app/components/molecules/cards';
import { toCapitalizedWords } from "@/app/lib/utils";
import { Collapse, CollapseProps, Flex, Typography, Modal } from 'antd';
import { useState } from 'react';
import { CREDENTIAL_TYPES } from '@/app/lib/constants';
import { Card1, Card2, Card3, Card4, Card5, LogoIcon2, TBDVCLogoYellow } from '@/app/components/atoms/Icon';

const RequestCredential = (props: any) => {
    const { showDrawer } = props
    const [showModal, setShowModal] = useState(false)


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
            card: Card2
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
        {
            type: CREDENTIAL_TYPES.MEDICAL_CREDENTIAL,
            issuerName: "TDBunk Identity",
            logo: LogoIcon2,
            card: Card5
        }
    ]


    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Financial Insitution',
            children:
                // <FinancialCredentialCard showDrawer={showDrawer} />
                <CredentialIssuerCard {...credentialsTypes[0]} />
        },
        {
            key: '2',
            label: 'Government Institution',
            children:
                // <GovernmentCredentialCard showDrawer={showDrawer} />
                <CredentialIssuerCard {...credentialsTypes[1]} />
        },
        {
            key: '3',
            label: 'Professional Institution',
            children:
                // <ProfessionalCredentialCard showDrawer={showDrawer} />
                <CredentialIssuerCard {...credentialsTypes[2]} />
        },
        {
            key: '4',
            label: 'Educational Institution',
            children:
                // <EducationCredentialCard showDrawer={showDrawer} />
                <CredentialIssuerCard {...credentialsTypes[3]} />
        },
        {
            key: '5',
            label: 'Medical Institution',
            children:
                // <MedicalCredentialCard showDrawer={showDrawer} />
                <CredentialIssuerCard {...credentialsTypes[4]} />
        },
    ];

    // const financialCredential = type === CREDENTIAL_TYPES.FINANCIAL_CREDENTIAL

    // const flow = financialCredential
    //     ? 'FinancialCredential'
    //     : 'Here'

    return (
        <Flex className="flex-col">
            <Typography.Text className="font-bold mb-4">Verifiable Credential Issuers</Typography.Text>
            {/* <CredentialIssuerCard /> */}
            <Collapse accordion items={items} />
        </Flex>
    );
};

export default RequestCredential;
