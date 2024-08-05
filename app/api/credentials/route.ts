
async function initKeyManagement(env, portableDid) {
    // Determine which key manager to use based on the environment
    let keyManager;
    if (env === "production") {
        keyManager = new AwsKeyManager();
    } else {
        keyManager = new LocalKeyManager();
    }

    // Initialize or load a DID
    if (portableDid == null) {
        // Create a new DID
        return await DidDht.create(keyManager);
    } else {
        // Load existing DID
        return await DidDht.import({ portableDid, keyManager });
    }
}

export async function POST(request: Request) {
    // TO DO: Might want to setup a custom VC since sandbox is limited to just name and country
    console.log("Generate Credentials", request.body)
    const body = await request.json()

    return Response.json({ msg: body })
}