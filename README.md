### TDBunk

This is a decentralised web application where users can setup misinformation and disinformation debunking campaigns and other users participate in it as fact checkers. The campaign sponsors can send their sponsorships for a campaign to any fact-checker across the globe and investigators receive their funds as soon as thier evidence have been submitted. 

### Short Demo Video



### Tools and Technologies

The web application uses a decentralised web nodes ([Web5 SDK DWN](https://www.npmjs.com/package/@web5/api)) as the data store, the [Web5 Credentials](https://www.npmjs.com/package/@web5/credentials) to generate Verifiable Credentials (VCs) for each evidence occurrence along as setting the minimum required credentials for fact-checkers. The app also uses the [tbDEX Client SDK](https://www.npmjs.com/package/@tbdex/http-client) to enlist Participating Financial Institutions and handle all the payments settlements. The app is build on [NextJS](https://www.npmjs.com/package/next) using Typesctipt.

Core dependencies were:
```javascript
"@tbdex/http-client": "1.1.0",
"@web5/api": "0.10.0",
"@web5/credentials": "1.1.0",
"@web5/crypto": "1.0.1",
"@web5/dids": "1.1.2",
```

### Local Setup
1. Clone this repository
```javascript
git clone
```
2. Switch into the newly cloned repository
```javascript
cd tdbunk/
```
3. Install all project dependencies
```javascript
yarn install
```
4. Start the development server
```javascript
yarn dev
```
5. Play with the app
```javascript
Visit http://localhost:3000/
```

### Project Design Considerations
## 1. Profitability: How might your wallet application make a profit?

Transaction fee and platform fee. 

`Transaction Fee`: Each sponsorship transaction (funding a debunk campaign) will have a `2.9% + $0.50` applied to it. These figures were inspired by then general case for payment processing platforms. 

`Platform Fee`: When fact-checkers are done with a campaign and submit their evidence, they will receive the payment. As they do so, a `1.4%` platform fee will be applied. This is figure is random and based on absolutely nothing.


## 2. Optionality: How will your application handle matching offerings from multiple PFIs?

Market rate comparison and reputation.

`Market Rate`: We compare the exchange rate of the offering to the current market rate. The one with the better rate will be recommended.

`Reputation`: User rate each transaction with a PFI that generates a Verifiable Credential (VC). The reputation can be factored to recommend to a user. The reputation VC will include; estimated vs actual settlement time, market vs offering rates at the time, 5 star rating, and a comment.

## 3. Customer Management: How will your application manage customers’ decentralized identifiers and verifiable credentials?

`Decentralised Web Node`: A DWN is used as data store for all the users VCs; self issued and requested from other issuers. The user DID is handled by the Web5 agent provided by the DWN. However, I did struggle with managing the Bearer DID which has the cryptographic keys so I am currently serializing them to string and storing in client browser (bad practice but I have a knowledge gap here please).


## 4. Customer Satisfaction: How will your application track customer satisfaction with PFIs?

After each successful transaction (not cancelled), a user rates their experience using a 5-star rating. They are presented with a summary of their transaction including estimated vs actual settlement time, and market vs offering rates at the time. They can add 5-star rating and a comment that will be linked to the PFI.


#### AOB
I am curretly unemployed and would appreciate any recommendations or potential positions I could apply for. Please see my portfolio here:

`Portfolio`: [Moffat Gitau Portfolio](https://portfolio-ngigemoffat.vercel.app/)

`Email`: `ngigemoffat@gmail.com`

