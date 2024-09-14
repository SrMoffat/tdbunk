export const DEFAULT_BASE_CURRENCY = 'USD'
export const DEFAULT_BASE_CURRENCY_STABLE_COIN = 'USDC'

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
    OFFERING_REVIEW_CREDENTIAL = 'TDBunkOfferingReviewCredential',
}

export const TDBUNK_ISSUER_NAME = 'TDBunk Identity'
export const ULTIMATE_IDENTITY_ISSUER_NAME = 'Ultimate Identity'

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
            ["GHS", "USDC"], // No
            ["NGN", "KES"], // No
            ["KES", "USD"], // No
            ["USD", "KES"], // No
        ]
    },
    {
        name: "Flowback Financial",
        did: "did:dht:zkp5gbsqgzn69b3y5dtt5nnpjtdq6sxyukpzo68npsf79bmtb9zy",
        currencyPairs: [
            ["USD", "EUR"], // Yes
            ["EUR", "USD"], // yes
            ["USD", "GBP"], // Yes
            ["USD", "BTC"], // Yes
        ]
    },
    {
        name: "Vertex Liquid Assets",
        did: "did:dht:enwguxo8uzqexq14xupe4o9ymxw3nzeb9uug5ijkj9rhfbf1oy5y",
        currencyPairs: [
            ["EUR", "USD"], // Yes
            ["EUR", "USDC"], // Yes
            ["USD", "EUR"], // Yes
            ["EUR", "GBP"], // Yes
        ]
    },
    {
        name: "Titanium Trust",
        did: "did:dht:ozn5c51ruo7z63u1h748ug7rw5p1mq3853ytrd5gatu9a8mm8f1o",
        currencyPairs: [
            ["USD", "AUD"], // Yes
            ["USD", "GBP"], // Yes
            ["USD", "KES"], // No
            ["USD", "MXN"], // Yes
        ]
    }
]

export enum TBDEX_MESSAGE_TYPES_TO_STATUS {
    RFQ = 'Quote Requested',
    QUOTE = 'Quote Received',
    ORDER = 'Transfer Started',
    ORDER_STATUS = 'Transaction Processing',
    CLOSE = 'Transfer Cancelled',

    CLOSE_SUCCESS = 'Transfer Complete',
    IN_PROGRESS = 'Transfer Processing',
    TRANSFERING_FUNDS = 'Transfering Funds',
    SUCCESS = 'Transfering Complete',
}

export enum TBDEX_MESSAGE_TYPES {
    RFQ = 'rfq',
    QUOTE = 'quote',
    ORDER = 'order',
    ORDER_STATUS = 'orderstatus',
    CLOSE = 'close',
}

export const IN_PROGRESS = 'IN_PROGRESS'
export const TDBUNK_SUCCESS_REASON = 'SUCCESS'
export const TRANSFERING_FUNDS = 'TRANSFERING_FUNDS'
export const TDBUNK_CANCEL_REASON = 'User cancelled transaction.'
export const TDBUNK_SUCCESS_TEXT = 'Transaction completed successfully.'

export const LOCAL_STORAGE_KEY = 'local'
export const SESSION_STORAGE_KEY = 'session'
export const WALLET_LOCAL_STORAGE_KEY = 'TDBunk:Wallet'
export const INTERVALS_LOCAL_STORAGE_KEY = 'TDBunk:Intervals'
export const OFFERINGS_LOCAL_STORAGE_KEY = 'TDBunk:Offerings'
// To Do: Look into key managers and how to use them to store the bearer did
export const BEARER_DID_LOCAL_STORAGE_KEY = 'TDBunk:BearerDid'
export const CREDENTIALS_LOCAL_STORAGE_KEY = 'TDBunk:Credentials'
export const OFFERINGS_LAST_UPDATED = 'TDBunk:OfferingsLastUpdatedAt'
export const CREDENTIALS_TYPE_LOCAL_STORAGE_KEY = 'TDBunk:CredentialsType'
export const SPECIAL_OFFERINGS_LOCAL_STORAGE_KEY = 'TDBunk:SpecialOfferings'
export const TDBUNK_WALLET_BALANCE_LOCAL_STORAGE_KEY = 'TDBunk:WalletBalance'
export const STARTED_TRANSFER_AT_LOCAL_STORAGE_KEY = 'TDBunk:StartedTransferAt'
export const SETTLED_TRANSFER_AT_LOCAL_STORAGE_KEY = 'TDBunk:SettledTransferAt'
export const CREDENTIALS_STAREGY_LOCAL_STORAGE_KEY = 'TDBunk:CredentialsStrategy'
export const MARKET_CONVERSION_RATE_LOCAL_STORAGE_KEY = 'TDBunk:MarketConversionRate'
export const MARKET_CONVERSION_API_EXCEEDED_QOUTA_LOCAL_STORAGE_KEY = 'TDBunk:MarketConversionAPIDeleted'

export const FEATURE_FLAG_USE_PAID_EXCHAGE_RATE_API = false

export const TDBUNK_PLATFORM_FEE_STRATEGY = {
    displayText: '2.9% + $0.50',
    percentage: 0.029, // 2.9%
    fixed: {
        currency: DEFAULT_BASE_CURRENCY,
        value: 0.50 // $0.50
    }
}

