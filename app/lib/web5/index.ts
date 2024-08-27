import { TdbunkProtocol } from "@/app/web5Protocols/tdbunk.protocol";
import { Web5 as Web5Api } from "@web5/api";
import { VerifiableCredential } from "@web5/credentials";
import { type VerifiableCredential as VC } from "@web5/credentials";
import { Jwk, LocalKeyManager } from "@web5/crypto";
import { DidDht } from '@web5/dids';

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

export const parseJwtToVc = (signedVcJwt: any): VC => {
    return VerifiableCredential.parseJwt({ vcJwt: signedVcJwt })
}