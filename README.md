### TDBunk

Debunking misinformation and disinformation

1. Provide secure encypted storage of VCs
2. PFI discovery and crawling idenity hubs
3. Receiving, offering, and presenting VCs (End user consent will be required to offer VCs)
4. Applying digital signatures
5. Storing transaction history


To provide clarity on how KCCs function, many of the examples in this guide will refer to a user named Alice transacting via a fictional mobile application called Mobile Wallet. Mobile Wallet is a mobile application that individuals use to:


Purchase digital assets using fiat currency from PFIs on tbDEX.

Sell digital assets for fiat currency to a PFI on tbDEX.

Manage and secure their digital identity information. Mobile Wallet also acts as a self-custodial digital wallet for Identity information.

It creates a DID for the user and securely stores the private keys for that DID directly on-device.

It stores Verifiable Credentials issued to the user directly on-device.



⚠️ Note: While our example focuses on a Mobile Wallet capable of purchasing, storing, and selling digital assets, KCCs may generally be used for any type of financial transaction.


To transact with PFIs on tbDEX, Alice first opens Mobile Wallet and searches for PFIs offering services of interest to her. Alice sees a handful of PFIs offering the service she wants in her region, each of which requires Alice present a Verifiable Credential to access the service. Alice settles on one PFI, which has positive reviews and offers competitively priced services.


Mobile Wallet is a mobile application that individuals use to:

Purchase digital assets using fiat currency from PFIs on tbDEX. (Mobile Wallet is a self custodial wallet for digital assets)

Sell digital assets for fiat currency through a PFI on tbDEX.

Manage their digital identity information. Mobile Wallet also acts as a self-custodial digital wallet for Identity information.

It creates a DID for the user and securely stores the private keys for that DID directly on-device.

It stores Verifiable Credentials issued to the user directly on-device.

Key Management
Document Management
Credential Management
Financial Management


logo
name
service url
did


"@tbdex/http-client": "1.1.0",
"@web5/credentials": "1.1.0",
"@web5/dids": "1.1.1",
"@web5/common": "1.0.0",
"@web5/crypto": "1.0.0"

https://stackoverflow.com/questions/6843201/how-to-clearinterval-with-unknown-id


Sending money across borders is unnecessarily slow and painful. tbDEX, an open source protocol, enables payment applications, such as digital wallets, to communicate with liquidity providers to move money in a fast and compliant way.

tbDEX utilizes innovative open technologies such as Decentralized Identifiers and Verifiable Credentials to securely validate counterparty identity and trust, ensuring compliance with relevant laws and regulations.


Your task is to develop a wallet application that leverages the tbDEX SDK.  

You can design your application for web, iOS, or Android. 

Your application must connect to one or more of the liquidity providers in our sandbox of PFIs (participating financial institutions):

Every PFI in the sandbox will require your customers present a Verifiable Credential from trusted issuer:

🪪 Issuer: Ultimate Identity
You can obtain a credential token for your customer by making a GET HTTP request to:
https://mock-idv.tbddev.org/kcc?name=${customerName}&country=${countryCode}&did=${customerDID}



Consider the following when designing your application:

1. Profitability: how might your wallet application make a profit (charging fees per transaction, platform fees when article is debunked and fact checkers are being paid, we get paid too)

2. Optionality: how will your application handle matching offerings from multiple PFIs (compare settlement time, compare user rating, compare availability status, user discretion, user transaction history, AI?, compare to market rate?)

3. Customer Management: how will your application manage customers’ decentralized identifiers and verifiable credentials (Bearer Did stored in local storage with key uris and keys in key manager, vcs stored in dwn)

4. Customer Satisfaction: how will your application track customer satisfaction with PFIs (5-star rating on, speed of settlement i.e. actual vs estimated, comparison to market rate, )
A set of Verifiable Credentials issued to the PFI that can be consumed by any interested party in order to assess the reputability of the respective PFI.


You must host your project in a public GitHub repository and provide that link as your submission. The project’s README.md file should provide an overview of your application and how you’ve addressed the design considerations above.



You may work individually or within a team (max of 2 people per team). 

12 teams of semi-finalists will be chosen. Semi-finalists will prepare a video presentation explaining their project.

6 teams of finalists will be chosen. Finalists will be flown to Nairobi, Kenya to attend the Africa Bitcoin Conference and pitch what they’ve built to our panel of judges. Conference tickets and travel accommodations will be provided.


https://github.com/TBD54566975/tbdex/tree/main/specs/protocol#reserved-paymentmethod-kinds