"use client"
import { Card1, Evidence, TBDVCLogoYellow, ValidCredential } from "@/app/components/atoms/Icon";
import { parseJwtToVc, resolveDid } from "@/app/lib/web5";
import countries from '@/public/countries.json';
import { VerifiableCredential } from "@web5/credentials";
import { DidResolutionResult } from "@web5/dids";
import { Card, Drawer, Flex, Tag, Typography } from "antd";
import { formatDistanceToNow } from 'date-fns';
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export interface CredentialSubject {
    name: string;
    didUri: string;
    countryCode: string;
}

export interface CredentialMetadata {
    type: string[];
    issuerDidUri: any;
    issuanceDate: string;
    expirationDate: string | undefined;
    subject: CredentialSubject;
}

export interface CredentialCardProps {
    vcServiceUrl: string;
    name: string | undefined;
    countryCode: string | undefined;
    issuanceDate: string | undefined;
    expirationDate: string | undefined;
    handleCardClicked: () => void;

}

export const CredentialCard: React.FC<CredentialCardProps> = ({
    name,
    countryCode,
    vcServiceUrl,
    issuanceDate,
    expirationDate,
    handleCardClicked
}) => {
    const expiry = expirationDate ? expirationDate : ''
    const issuance = issuanceDate ? formatDistanceToNow(new Date(issuanceDate), { addSuffix: true }) : ''
    const expiration = expiry ? formatDistanceToNow(new Date(expiry), { addSuffix: true }) : ''

    const country = countries.filter(entry => entry?.countryCode === countryCode)[0]

    const nameParts = name?.split(":")

    const hasParts = nameParts?.length

    const renderName = hasParts
        ? `${nameParts[0]} ${nameParts[1]}`
        : name
    return (
        <Flex className="h-[200px]">
            <Flex onClick={handleCardClicked} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="card" src={Card1} width={300} height={300} />
                <Flex className="absolute left-4 top-4 flex-col">
                    <Image alt="LogoIcon" src={TBDVCLogoYellow} width={40} height={40} />
                    <Link target="_blank" href={vcServiceUrl} style={{ fontSize: 10, marginTop: 8 }}>Ultimate Identity</Link>
                </Flex>
                <Flex className="absolute left-4 top-20 flex-col">
                    <Typography.Text style={{ fontSize: 12 }}>{`${renderName}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 12 }}>{`${country?.countryName} ${country?.flag}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 9, marginTop: 10 }}>{`Issued: ${issuance}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 9 }}>{`Expires: ${expiration}`}</Typography.Text>
                </Flex>
            </Flex>
        </Flex>
    )
}

export interface DrawerHeaderProps {
    type: string[] | undefined;
}

const DrawerHeader: React.FC<DrawerHeaderProps> = ({
    type
}) => {
    return (<Flex className="justify-end">
        {type?.map(entry => (<Tag key={entry} color="gold">{entry}</Tag>))}
    </Flex>)
}

export interface CredentialParsedMetadata {
    id?: string;
    name?: string;
    countryOfResidence?: string;
    firstName?: string;
    lastName?: string;
    idNumber?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    nameOfProfessionalBody?: string;
    nameOfProfession?: string;
    startDate?: string;
    endDate?: string;
    nameOfInstituion?: string;
    nameOfCourse?: string;
    startedDate?: string;
    endedDate?: string;
}

export const extractVcDocumentDetails = (vc: VerifiableCredential) => {
    const vcModel = vc?.vcDataModel

    const credentialSubject = vcModel?.credentialSubject as CredentialParsedMetadata

    const credentialMetadata = {
        subject: {
            didUri: credentialSubject?.id,
            name: credentialSubject?.name,
            endDate: credentialSubject?.endDate,
            idNumber: credentialSubject?.idNumber,
            lastName: credentialSubject?.lastName,
            startDate: credentialSubject?.startDate,
            endedDate: credentialSubject?.endedDate,
            firstName: credentialSubject?.firstName,
            phoneNumber: credentialSubject?.phoneNumber,
            startedDate: credentialSubject?.startedDate,
            dateOfBirth: credentialSubject?.dateOfBirth,
            nameOfCourse: credentialSubject?.nameOfCourse,
            countryCode: credentialSubject?.countryOfResidence,
            nameOfProfession: credentialSubject?.nameOfProfession,
            nameOfInstituion: credentialSubject?.nameOfInstituion,
            nameOfProfessionalBody: credentialSubject?.nameOfProfessionalBody,
        },
        issuerDidUri: vcModel?.issuer,
        issuanceDate: vcModel?.issuanceDate,
        expirationDate: vcModel?.expirationDate,
        type: vcModel?.type,
    };

    const issuerUri = vcModel?.issuer as string

    return {
        issuerUri,
        data: credentialMetadata
    }
}

const FinancialInstitutionCredential = (props: any) => {
    const { stateCredentials, localStorageCredentials } = props;

    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false)
    const [vcMetadata, setVcMetadata] = useState<CredentialMetadata | undefined>()
    const [vcIssuerDidDocument, setVcIssuerDidDocument] = useState<DidResolutionResult | undefined>()
    const [credentialDidDocument, setCredentialDidDocument] = useState<VerifiableCredential | undefined>()

    const onClose = () => {
        setOpen(false);
    };

    const getDidDdocument = async (didUri: string) => {
        const did = await resolveDid?.(didUri)
        setVcIssuerDidDocument(did)

        console.log("getDidDdocument", {
            didUri,
            did
        })
        return did
    }

    const handleCardClicked = () => {
        setOpen(true)
    }

    const vcDidDoc = vcIssuerDidDocument?.didDocument
    const vcServiceUrl = `${vcDidDoc?.service?.[0]?.serviceEndpoint}`


    const commonCardProps = {
        vcServiceUrl,
        name: vcMetadata?.subject?.name,
        issuanceDate: vcMetadata?.issuanceDate,
        expirationDate: vcMetadata?.expirationDate,
        countryCode: vcMetadata?.subject?.countryCode,
        handleCardClicked,
    }

    useEffect(() => {
        let jwtCredentials: any = []
        let parsedCredentials: any = []

        if (localStorageCredentials) {
            const localCredentials = Object.values(localStorageCredentials)
            jwtCredentials = localCredentials.flat()
            console.log("Local Storage State", {
                stateCredentials,
                localStorageCredentials
            })

        } else if (stateCredentials) {
            const contextCredentials = Object.values(stateCredentials)
            jwtCredentials = contextCredentials.flat()
            console.log("Context State Storage State", {
                stateCredentials,
                localStorageCredentials
            })

        }

        for (const jwt of jwtCredentials) {
            const parsedCred = parseJwtToVc(jwt)
            const { issuerUri, data } = extractVcDocumentDetails(parsedCred)

            parsedCredentials = [...parsedCredentials, {
                rawCred: parsedCred,
                formattedCred: data,
                issuer: issuerUri
            }]
        }

        // To Do: Handle multiple credential case
        const cred = parsedCredentials[0]
        setVcMetadata(cred?.formattedCred)
        getDidDdocument(cred?.issuer)
        setCredentialDidDocument(cred?.rawCred)
    }, [])

    return (
        <Flex>
            <Drawer title={<DrawerHeader type={vcMetadata?.type} />} onClose={onClose} open={open} width={600}>
                <CredentialCard {...commonCardProps} />
                <Card className="flex-col mb-4">
                    <Flex className="mb-3 justify-between">
                        <Flex className="flex-col">
                            <Typography.Text style={{ fontSize: 18 }}>Issuer Name:</Typography.Text>
                            <Typography.Text style={{ fontSize: 14 }}>Ultimate Identity</Typography.Text>
                        </Flex>
                        <Image src={ValidCredential} width={50} height={50} alt="valid" />
                    </Flex>
                    <Flex className="flex-col mb-3">
                        <Typography.Text style={{ fontSize: 18 }}>Service Endpoint:</Typography.Text>
                        <Typography.Text style={{ fontSize: 14 }} copyable>{vcServiceUrl}</Typography.Text>
                    </Flex>
                    <Flex className="flex-col mb-3">
                        <Typography.Text style={{ fontSize: 18 }}>Issuer DID:</Typography.Text>
                        <Typography.Text style={{ fontSize: 14 }} copyable>{vcMetadata?.issuerDidUri}</Typography.Text>
                    </Flex>
                </Card>
                <Card className="flex-col mb-4">
                    <Flex className="mb-3 justify-between">
                        <Flex className="flex-col">
                            <Typography.Text style={{ fontSize: 18 }}>Credential Document:</Typography.Text>
                        </Flex>
                        <Image src={Evidence} width={40} height={40} alt="valid" />
                    </Flex>
                    <Flex className="flex-col mb-3">
                        <pre>{JSON.stringify(credentialDidDocument, null, 2)}</pre>
                    </Flex>
                </Card>
            </Drawer>
            <CredentialCard {...commonCardProps} />
        </Flex>
    );
};

export default FinancialInstitutionCredential;
