import { TdbunkProtocol } from "@/app/web5Protocols/tdbunk.protocol";
import { Web5PlatformAgent } from '@web5/agent';
import { Web5 as Web5Api } from "@web5/api";
import { VerifiableCredential, type VerifiableCredential as VC } from "@web5/credentials";
import { Jwk, LocalKeyManager } from "@web5/crypto";
import { DidDht, DidResolutionResult } from '@web5/dids';
import { CREDENTIAL_TYPES, VC_JWT_MIME_TYPE } from "../constants";

const DWN_SYNC_INTERVAL = '5s'

const localKeyManager = new LocalKeyManager();

export const checkIfProtocolIsInstalled = async (web5: Web5Api | null) => {
    try {
        const { protocols, status } = await web5!.dwn.protocols.query({
            message: {
                filter: {
                    protocol: TdbunkProtocol.protocol,
                }
            }
        });

        console.log("Checking here", {
            protocols,
            status
        })

        if (status.code !== 200) {
            // To Do: Better error handling
            alert('Error querying protocols');
            console.error('Error querying protocols', status);
            return false;
        }

        console.log('checkIfProtocolIsInstalled', protocols.length > 0);
        return protocols.length > 0
    } catch (error: any) {
        console.error("Error checkIfProtocolIsInstalled", error)
    }
}

export const createDwnCampaign = async (web5: Web5Api | null) => {
    const campaignDetails = {
        "@type": "campaign",
        "title": "Debunk Test Campaign",
        "description": "Debunk Test Campaign Descriptions Here Goes",
        "author": "did:dht:b3tits968u8rdoxiec3qpb9tizg57zbspgn1mattogi7n3bfmc4y",
        // "recipient": newTodo.value.recipientDID,
    }

    try {
        const { record } = await web5!.dwn.records.create({
            data: campaignDetails,
            message: {
                protocol: TdbunkProtocol.protocol,
                protocolPath: 'campaign',
                schema: TdbunkProtocol.types.campaign.schema,
                dataFormat: TdbunkProtocol.types.campaign.dataFormats[0],
                recipient: "did:dht:b3tits968u8rdoxiec3qpb9tizg57zbspgn1mattogi7n3bfmc4y"
            }
        });

        const data = await record?.data.json();
        const campaign = { record, data, id: record?.id };

        console.log("campaign =====+++-->", campaign)

        const response = await record?.send("did:dht:b3tits968u8rdoxiec3qpb9tizg57zbspgn1mattogi7n3bfmc4y");

        console.log("Data", response?.status)

        if (response?.status?.code !== 202) {
            console.log("Unable to send to target did:" + response?.status?.code);
            return;
        }
        else {
            console.log("Shared campaign sent to recipient");
        }

    } catch (error: any) {
        console.error("Error createDwnCampaign", error)
    }
}

export const fetchCampaigns = async (web5: Web5Api | null, did: string): Promise<any> => {
    try {
        const { records: campaigns } = await web5!.dwn.records.query({
            message: {
                filter: {
                    schema: TdbunkProtocol.types.campaign.schema,
                },

                // @ts-ignore
                dateSort: 'createdAscending'
            }
        });

        console.log("Reccors Returned fro DWN", campaigns)

        // CreatedAscending = 'createdAscending',
        //     CreatedDescending = 'createdDescending',
        //     PublishedAscending = 'publishedAscending',
        //     PublishedDescending = 'publishedDescending'

        return campaigns
    } catch (error: any) {
        console.log("Error fetching campaigns", error);
    }
}

export const setupTdbunkProtocol = async (web5: Web5Api | null, did: string) => {
    try {

        const isInstalled = await checkIfProtocolIsInstalled(web5)

        if (!isInstalled) {
            console.log('!isInstalled', !isInstalled);

            // configure protocol on local DWN
            const { status: configureStatus, protocol } = await web5!.dwn.protocols.configure({
                message: {
                    definition: TdbunkProtocol,
                }
            });

            // const isConfigured = configureStatus.detail === 'Accepted'
            if (protocol) {
                const { status: remoteStatus } = await protocol.send(did);
                const isInstalled = remoteStatus.detail === 'Accepted'

                console.log("Local Protocol Installation Status", {
                    status: remoteStatus.detail,
                    isInstalled
                })
            }

            console.log('Protocol configured', configureStatus, protocol);
        }
    } catch (error: any) {
        console.log("Error setting up campaign protocol", error);
    }
}

export const generateDid = async () => {
    const didDht = await DidDht.create({
        keyManager: localKeyManager,
        options: {
            publish: true
        }
    });

    const portableDid = await didDht.export()
    const privateKeys: Jwk[] = portableDid?.privateKeys ?? []
    const privateKeysUris = []

    for (let pk of privateKeys) {
        const keyUri = await localKeyManager.getKeyUri({
            key: pk
        });
        privateKeysUris.push(keyUri)
    }

    return {
        didDht,
        portableDid,
        privateKeysUris,
    }
}

export const resolveDid = async (didUri: string): Promise<DidResolutionResult | undefined> => {
    try {
        const resolvedDhtDid = await DidDht.resolve(didUri);
        // console.log("Resolved DID", resolvedDhtDid)
        return resolvedDhtDid
    } catch (error: any) {
        console.log("Resolution error", error)
    }
}

export const parseJwtToVc = (signedVcJwt: any): VC => {
    return VerifiableCredential.parseJwt({ vcJwt: signedVcJwt })
}

export const createWeb5Instance = () => {

}

export async function initWeb5({ password }: { password: string }) {
    const { web5, did, recoveryPhrase } = await Web5Api.connect({
        password,
        sync: DWN_SYNC_INTERVAL
    });
    const agent = web5.agent as Web5PlatformAgent
    const bearerDid = await agent.identity.get({ didUri: did });
    // const identites = await agent.identity.list();
    return {
        web5,
        did,
        bearerDid,
        recoveryPhrase,
    };
}

export async function getBearerDid(web5: Web5Api, did: string) {
    const agent = web5.agent as Web5PlatformAgent
    const bearerDid = await agent.identity.get({ didUri: did });
    // const identites = await agent.identity.list();
    return bearerDid;
}

export async function storeVcJwtInDwn(web5: Web5Api, vcJwt: string, did: string) {
    const { record } = await web5.dwn.records.create({
        data: vcJwt,
        message: {
            schema: CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL,
            dataFormat: VC_JWT_MIME_TYPE,
        },
    });

    return await record?.send(did);
}

export async function fetchVcJwtFromDwn(web5: Web5Api, did: string) {
    const response = await web5.dwn.records.query({
        from: did,
        message: {
            filter: {
                schema: CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL,
                dataFormat: VC_JWT_MIME_TYPE,
            },
        },
    });

    return await response?.records?.[0]?.data?.text()
}
