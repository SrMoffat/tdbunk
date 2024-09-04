import { Card4 } from "@/app/components/atoms/Icon";
import { CredentialParsedMetadata, extractVcDocumentDetails } from "@/app/components/molecules/cards/FinancialCredential";
import { CREDENTIAL_TYPES } from "@/app/lib/constants";
import { parseJwtToVc } from "@/app/lib/web5";
import { resolveDid } from "@tbdex/http-client";
import { Flex, Typography } from "antd";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";

const EducationalInstitutionCredential = (props: any) => {
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

    const isEducationalCred = type === CREDENTIAL_TYPES.EDUCATIONAL_CREDENTIAL

    useEffect(() => {
        (async () => {
            console.log("EducationCredentials", {
                stateCredentials,
                isEducationalCred,
                type
            })

            if (isEducationalCred) {
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

    const startedDate = new Date(vcSubject?.startedDate as string).toLocaleString('default', {
        dateStyle: 'short'
    })

    const endedDate = new Date(vcSubject?.endedDate as string).toLocaleString('default', {
        dateStyle: 'short'
    })
    return isEducationalCred && (
        <Flex className="h-[200px]">
            <Flex onClick={() => showDrawer()} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="Card4" src={Card4} width={300} height={300} />
                <Flex className="top-[70px] absolute w-full right-0">
                    <Flex className="w-full pl-2 flex-col mt-4">
                        <Typography.Text style={{ fontSize: 12 }}>{`${vcSubject?.nameOfInstituion}`}</Typography.Text>
                        <Typography.Text style={{ fontSize: 10 }}>{`${vcSubject?.nameOfCourse}`}</Typography.Text>
                        <Typography.Text style={{ fontSize: 10 }}>{`${startedDate} - ${endedDate}`}</Typography.Text>
                    </Flex>
                    <Flex className="w-full flex-col pr-2">
                        <Flex className="flex-col">
                            <Typography.Text style={{ fontSize: 12, textAlign: "right", fontWeight: 'bold' }}>{`Issued:`}</Typography.Text>
                            <Typography.Text style={{ fontSize: 10, textAlign: "right" }}>{`${issuance}`}</Typography.Text>
                        </Flex>
                        <Flex className="flex-col">
                            <Typography.Text style={{ fontSize: 12, textAlign: "right", fontWeight: 'bold' }}>{`Expires:`}</Typography.Text>
                            <Typography.Text style={{ fontSize: 10, textAlign: "right" }}>{`${expiration}`}</Typography.Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default EducationalInstitutionCredential;
