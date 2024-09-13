import { Card5, Evidence, LogoIcon2, ValidCredential } from "@/app/components/atoms/Icon";
import { CredentialParsedMetadata, DrawerHeader, extractVcDocumentDetails } from "@/app/components/molecules/cards/FinancialCredential";
import { CREDENTIAL_TYPES } from "@/app/lib/constants";
import { parseJwtToVc } from "@/app/lib/web5";
import { resolveDid } from "@tbdex/http-client";
import { Flex, Typography, Drawer, Card } from "antd";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";


const GovernmentCredentialCard = (props: any) => {
    const {
        showDrawer,
        vcSubject,
        issuance,
        expiration
    } = props

    return (
        <Flex className="h-[200px]">
            <Flex onClick={() => showDrawer()} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="Card2" src={Card5} width={300} height={300} />
                <Flex className="absolute left-2 top-2 flex-col justify-end items-end">
                    <Image alt="LogoIcon" src={LogoIcon2} width={40} height={40} />
                </Flex>
                <Flex className="absolute right-0 top-[88px] flex-col w-full">
                    <Flex className="w-full">
                        <Flex className="w-full flex-col pl-3">
                            <Flex className="flex-col">
                                <Typography.Text style={{ fontSize: 11, fontWeight: 'bold' }}>Name</Typography.Text>
                                <Typography.Text style={{ fontSize: 10 }}>{`${vcSubject?.firstName} ${vcSubject?.lastName}`}</Typography.Text>
                            </Flex>
                            <Flex className="flex-col">
                                <Typography.Text style={{ fontSize: 11, fontWeight: 'bold' }}>ID Number</Typography.Text>
                                <Typography.Text style={{ fontSize: 10 }}>{`${vcSubject?.idNumber}`}</Typography.Text>
                            </Flex>
                        </Flex>
                        <Flex className="w-full flex-col justify-end">
                            <Flex className="flex-col">
                                <Typography.Text style={{ fontSize: 11, fontWeight: 'bold' }}>Issued:</Typography.Text>
                                <Typography.Text style={{ fontSize: 10 }}>{`${issuance}`}</Typography.Text>
                            </Flex>
                            <Flex className="flex-col">
                                <Typography.Text style={{ fontSize: 11, fontWeight: 'bold' }}>Expires:</Typography.Text>
                                <Typography.Text style={{ fontSize: 10 }}>{`${expiration}`}</Typography.Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

const GovernmentInstitutionCredential = (props: any) => {
    const {
        stateCredentials,
        localStorageCredentials
    } = props

    const [open, setOpen] = useState(false);
    const [issuance, setIssuance] = useState<string | undefined>()
    const [expiration, setExpiration] = useState<string | undefined>()
    const [issuerServiceUrl, setIssuerServiceUrl] = useState<string | undefined>()
    const [vcSubject, setVcSubject] = useState<CredentialParsedMetadata>()


    useEffect(() => {
        (async () => {
            const isState = Object.keys(stateCredentials)?.length
            
            const credentialTypes = isState
                ? Object.keys(stateCredentials)[0]
                : Object.keys(localStorageCredentials)[0]

            const credentialType = credentialTypes?.split(":")[1]

            const isGovernmentCred = credentialType === CREDENTIAL_TYPES.GOVERNMENT_CREDENTIAL

            if (isGovernmentCred) {
                const vcJwt = isState
                    ? stateCredentials[credentialTypes][0]
                    : localStorageCredentials[credentialTypes][0]

                // Parse VC to get metadata
                const parsedVc = parseJwtToVc(vcJwt);

                const { data } = extractVcDocumentDetails(parsedVc)

                const vcSubject = data?.subject
                const issuanceDate = data?.issuanceDate
                const expirationDate = data?.expirationDate

                const issuance = issuanceDate ? formatDistanceToNow(new Date(issuanceDate), { addSuffix: true }) : ''
                const expiration = expirationDate ? formatDistanceToNow(new Date(expirationDate), { addSuffix: true }) : ''

                // @ts-ignore
                const issuerDidDocument = await resolveDid(data.issuerDidUri)

                const issuerServiceUrls = issuerDidDocument?.service?.[0]?.serviceEndpoint as any
                const issuerServiceUrl = issuerServiceUrls[0] as string

                // setCountry(country)
                setIssuance(issuance)
                setVcSubject(vcSubject)
                setExpiration(expiration)
                setIssuerServiceUrl(issuerServiceUrl)

            }
        })()
    }, [stateCredentials, localStorageCredentials])

    const showDrawer = () => {
        setOpen(true)
    }

    const onClose = () => {
        setOpen(false)
    }

    const commonProps = {
        showDrawer,
        vcSubject,
        issuance,
        expiration
    }

    return (
        <Flex>
            <Flex className="h-[200px]">
                <GovernmentCredentialCard {...commonProps} />
            </Flex>
            <Drawer title={<DrawerHeader type={[CREDENTIAL_TYPES.VERIFIABLE_CREDENTIAL, CREDENTIAL_TYPES.GOVERNMENT_CREDENTIAL]} />} onClose={onClose} open={open} width={600}>
                <Flex className="h-[200px]">
                    <GovernmentCredentialCard {...commonProps} />
                </Flex>
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
                        {/* <Typography.Text style={{ fontSize: 14 }} copyable>{vcServiceUrl}</Typography.Text> */}
                    </Flex>
                    <Flex className="flex-col mb-3">
                        <Typography.Text style={{ fontSize: 18 }}>Issuer DID:</Typography.Text>
                        {/* <Typography.Text style={{ fontSize: 14 }} copyable>{vcMetadata?.issuerDidUri}</Typography.Text> */}
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
                        Here
                        {/* <pre>{JSON.stringify(credentialDidDocument, null, 2)}</pre> */}
                    </Flex>
                </Card>
            </Drawer>
        </Flex>
    );
};

export default GovernmentInstitutionCredential;
