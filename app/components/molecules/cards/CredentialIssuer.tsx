import { CREDENTIAL_TYPES } from "@/app/lib/constants";
import { toCapitalizedWords } from "@/app/lib/utils";
import { Button, Card, Flex, Tag, Typography, Modal } from "antd";
import Image from "next/image";
import { SetStateAction, useState } from "react"
import FinancialCredentialForm from "../forms/FinancialCredential";
import GovernmentCredentialForm from "../forms/GovernmentCredential";
import ProfessionalCredentialForm from "../forms/ProfessionalCredential";
import EducationalCredentialForm from "../forms/EducationalCredential";
import MedicalCredentialForm from "../forms/MedicalCredential";

const CredentialIssuerCard = (props: any) => {
    const {
        type,
        card,
        logo,
        issuerName
    } = props
    const [showModal, setShowModal] = useState(false)

    const financialCredential = type === CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL
    const governmentCredential = type === CREDENTIAL_TYPES.GOVERNMENT_CREDENTIAL
    const professionalCredential = type === CREDENTIAL_TYPES.PROFESSIONAL_CREDENTIAL
    const educationalCredential = type === CREDENTIAL_TYPES.EDUCATIONAL_CREDENTIAL
    const medicalCredential = type === CREDENTIAL_TYPES.MEDICAL_CREDENTIAL

    // TO DO: Clean this up
    const flow = financialCredential
        ? <FinancialCredentialForm />
        : governmentCredential
            ? <GovernmentCredentialForm />
            : professionalCredential
                ? <ProfessionalCredentialForm />
                : educationalCredential
                    ? <EducationalCredentialForm />
                    : medicalCredential
                        ? <MedicalCredentialForm />
                        : 'Here'

    const handleOk = () => {
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
