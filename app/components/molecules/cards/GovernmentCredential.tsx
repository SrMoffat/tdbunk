import { Card5, LogoIcon2 } from "@/app/components/atoms/Icon";
import { parseJwtToVc } from "@/app/lib/web5";
import { resolveDid } from "@tbdex/http-client";
import { Flex, Typography } from "antd";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CredentialParsedMetadata, extractVcDocumentDetails } from "./FinancialCredential";
import { CREDENTIAL_TYPES } from "@/app/lib/constants";

const GovernmentInstitutionCredential = (props: any) => {
    const {
        showDrawer,
        stateCredentials,
        localStorageCredentials
    } = props

    const [issuance, setIssuance] = useState<string | undefined>()
    const [expiration, setExpiration] = useState<string | undefined>()
    const [issuerServiceUrl, setIssuerServiceUrl] = useState<string | undefined>()
    const [vcSubject, setVcSubject] = useState<CredentialParsedMetadata>()

    const types = Object.keys(stateCredentials)[0]
    const [_, type] = types.split(":")

    const isGovernmentCred = type === CREDENTIAL_TYPES.GOVERNMENT_CREDENTIAL
    useEffect(() => {
        (async () => {

            console.log("EducationCredentials", {
                stateCredentials,
                isGovernmentCred,
                type
            })

            if (isGovernmentCred) {
                const vcJwt = stateCredentials[types][0];

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
    );
};

export default GovernmentInstitutionCredential;
