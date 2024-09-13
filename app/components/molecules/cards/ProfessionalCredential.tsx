import { Card3 } from "@/app/components/atoms/Icon";
import { CredentialParsedMetadata, extractVcDocumentDetails } from "@/app/components/molecules/cards/FinancialCredential";
import { CREDENTIAL_TYPES } from "@/app/lib/constants";
import { parseJwtToVc } from "@/app/lib/web5";
import { resolveDid } from "@tbdex/http-client";
import { Flex, Typography, Drawer } from "antd";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";

const ProfessionalCredentialCard = (props: any) => {
    const {
        showDrawer,
        vcSubject,
        startDate,
        endDate,
        issuance,
        expiration
    } = props
    return (
        <Flex onClick={() => showDrawer()} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
            <Image alt="Card3" src={Card3} width={300} height={300} />
            <Flex className="w-full absolute right-0 top-3 flex-col items-center">
                <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>{`${vcSubject?.nameOfProfessionalBody}`}</Typography.Text>
            </Flex>
            <Flex className="w-full absolute right-0 top-[90px] flex-col items-center">
                <Flex className="w-full">
                    <Flex className="w-full flex-col pl-2 mt-3">
                        <Typography.Text style={{ fontSize: 12 }}> {`${vcSubject?.nameOfProfession}`}</Typography.Text>
                        <Typography.Text style={{ fontSize: 12 }}> {`${startDate} - ${endDate}`}</Typography.Text>
                    </Flex>
                    <Flex className="w-full flex-col pr-2">
                        <Flex className="flex-col">
                            <Typography.Text style={{ fontSize: 12, textAlign: "right" }}> {`Issued:`}</Typography.Text>
                            <Typography.Text style={{ fontSize: 10, textAlign: "right" }}> {`${issuance}`}</Typography.Text>
                        </Flex>
                        <Flex className="flex-col">
                            <Typography.Text style={{ fontSize: 12, textAlign: "right" }}> {`Expires:`}</Typography.Text>
                            <Typography.Text style={{ fontSize: 10, textAlign: "right" }}> {`${expiration}`}</Typography.Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

const ProfessionalInstitutionCredential = (props: any) => {
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

            const isProfessionalCred = credentialType === CREDENTIAL_TYPES.PROFESSIONAL_CREDENTIAL

            if (isProfessionalCred) {
                const vcJwt = isState
                    ? stateCredentials[credentialTypes][0]
                    : localStorageCredentials[credentialTypes][0]

                // Parse VC to get metadata
                const parsedVc = parseJwtToVc(vcJwt);

                const { data } = extractVcDocumentDetails(parsedVc)

                console.log("parsedVc", {
                    parsedVc,
                    data
                })

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

    const startDate = new Date(vcSubject?.startDate as string).toLocaleString('default', {
        dateStyle: 'short'
    })

    const endDate = new Date(vcSubject?.endDate as string).toLocaleString('default', {
        dateStyle: 'short'
    })

    console.log("ProfessionalCredentials ==>", {
        vcSubject
    })

    const showDrawer = () => {
        setOpen(true)
    }

    const onClose = () => {
        setOpen(false)
    }

    const commonProps = {
        showDrawer,
        vcSubject,
        startDate,
        endDate,
        issuance,
        expiration
    }

    return (
        <Flex>
            <Flex className="h-[200px]">
                <ProfessionalCredentialCard {...commonProps} />
            </Flex>
            <Drawer title={'Title'} onClose={onClose} open={open} width={600}>
                <Flex className="h-[200px]">
                    <ProfessionalCredentialCard {...commonProps} />
                </Flex>
            </Drawer>
        </Flex>
    );
};

export default ProfessionalInstitutionCredential
