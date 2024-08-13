"use client"
import {
    CredentialIssuerCard,
    EducationCredentialCard,
    // FinancialCredentialCard,
    GovernmentCredentialCard,
    MedicalCredentialCard,
    ProfessionalCredentialCard
} from '@/app/components/molecules/cards';
import { Collapse, CollapseProps, Flex, Typography } from 'antd';

const RequestCredential = (props: any) => {
    const { showDrawer } = props

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Financial Insitution',
            children:
                // <FinancialCredentialCard showDrawer={showDrawer} />
                <CredentialIssuerCard />
        },
        {
            key: '2',
            label: 'Government Institution',
            children:
                // <GovernmentCredentialCard showDrawer={showDrawer} />
                <CredentialIssuerCard />
        },
        {
            key: '3',
            label: 'Professional Institution',
            children:
                // <ProfessionalCredentialCard showDrawer={showDrawer} />
                <CredentialIssuerCard />
        },
        {
            key: '4',
            label: 'Educational Institution',
            children:
                // <EducationCredentialCard showDrawer={showDrawer} />
                <CredentialIssuerCard />
        },
        {
            key: '5',
            label: 'Medical Institution',
            children:
                // <MedicalCredentialCard showDrawer={showDrawer} />
                <CredentialIssuerCard />
        },
    ];

    return (
        <Flex className="flex-col">
            <Typography.Text className="font-bold mb-4">Verifiable Credential Issuers</Typography.Text>
            <Collapse accordion items={items} />
        </Flex>
    );
};

export default RequestCredential;
