export enum LANDING_PAGE_TABS {
    DEBUNKS = 'Debunks',
    CAMPAIGNS = 'Campaigns',
    SPONSORSHIPS = 'Sponsorships'
};

export enum DEBUNK_SOURCE {
    X = 'X',
    TIKTOK = 'TikTok',
    YOUTUBE = 'Youtube',
    FACEBOOK = 'Facebook',
    INSTAGRAM = 'Instagram',
};

export enum DEBUNK_CAMPAIGN_TYPE {
    COMMUNITY = 'Community',
    SPONSORED = 'Sponsored'
}

export enum CREDENTIAL_TYPES {
    VERIFIABLE_CREDENTIAL = 'VerifiableCredential',
    MEDICAL_CREDENTIAL = 'TDBunkMedicalCredential',
    FINANCIAL_CREDENTIAL = 'TDBunkFinancialCredential',
    GOVERNMENT_CREDENTIAL = 'TDBunkGovernmentCredential',
    KNOWN_CUSTOMER_CREDENTIAL = 'KnownCustomerCredential',
    EDUCATIONAL_CREDENTIAL = 'TDBunkEducationalCredential',
    PROFESSIONAL_CREDENTIAL = 'TDBunkProfessionalCredential',
}

export const VC_JWT_MIME_TYPE = 'application/vc+jwt'

export const SPECIAL_PFI = {
    name: "Silver Star v2",
    did: "did:dht:bu9r4zeaes9krexj9rconthxkupomo7paporsfeth86a6d1cpz4y",
    currencyPairs: []
}

export const PFIs = [
    {
        name: "AquaFinance Capital",
        did: "did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y",
        currencyPairs: [
            ["GHS", "USDC"],
            ["NGN", "KES"],
            ["KES", "USD"],
            ["USD", "KES"],
        ]
    },
    {
        name: "Flowback Financial",
        did: "did:dht:zkp5gbsqgzn69b3y5dtt5nnpjtdq6sxyukpzo68npsf79bmtb9zy",
        currencyPairs: [
            ["USD", "EUR"],
            ["EUR", "USD"],
            ["USD", "GBP"],
            ["USD", "BTC"],
        ]
    },
    {
        name: "Vertex Liquid Assets",
        did: "did:dht:enwguxo8uzqexq14xupe4o9ymxw3nzeb9uug5ijkj9rhfbf1oy5y",
        currencyPairs: [
            ["EUR", "USD"],
            ["EUR", "USDC"],
            ["USD", "EUR"],
            ["EUR", "GBP"],
        ]
    },
    {
        name: "Titanium Trust",
        did: "did:dht:ozn5c51ruo7z63u1h748ug7rw5p1mq3853ytrd5gatu9a8mm8f1o",
        currencyPairs: [
            ["USD", "AUD"],
            ["USD", "GBP"],
            ["USD", "KES"],
            ["USD", "MXN"],
        ]
    }
]

export enum TBDEX_MESSAGE_TYPES_TO_STATUS {
    RFQ = 'Quote Requested',
    QUOTE = 'Quote Received',
    ORDER = 'Transfer Started',
    ORDER_STATUS = 'Transfer Processing',
    CLOSE = 'Transfer Cancelled',
    CLOSE_SUCCESS = 'Transfer Complete',
}

export enum TBDEX_MESSAGE_TYPES {
    RFQ = 'rfq',
    QUOTE = 'quote',
    ORDER = 'order',
    ORDER_STATUS = 'orderstatus',
    CLOSE = 'close',
}

export const TDBUNK_CANCEL_REASON = 'User cancelled transaction.'

export const LOCAL_STORAGE_KEY = 'local'
export const SESSION_STORAGE_KEY = 'session'
export const WALLET_LOCAL_STORAGE_KEY = 'TDBunk:Wallet'
export const INTERVALS_LOCAL_STORAGE_KEY = 'TDBunk:Intervals'
export const OFFERINGS_LOCAL_STORAGE_KEY = 'TDBunk:Offerings'
export const CREDENTIALS_LOCAL_STORAGE_KEY = 'TDBunk:Credentials'
export const OFFERINGS_LAST_UPDATED = 'TDBunk:OfferingsLastUpdatedAt'
export const SPECIAL_OFFERINGS_LOCAL_STORAGE_KEY = 'TDBunk:SpecialOfferings'
