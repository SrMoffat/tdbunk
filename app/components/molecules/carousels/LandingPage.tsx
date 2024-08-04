import React from 'react';
import { Carousel } from 'antd';

const contentStyle: React.CSSProperties = {
    height: '560px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};

const LandingPageCarousel: React.FC = () => (
    <Carousel autoplay>
        <div>
            <h3 style={contentStyle}>
                Profitability
                How might your wallet application make a profit
                {/* {'faster transfers, not pinned to subscriptions and donate on-demand, follow up on your specific issues, avert the possibility of eco chambered opinions from fact checkers, verifiable credentials of the evidence that is portable and we make money from the transactions, similar to bug bounty only for mis/dis info for specific sponsors or sometimes free for a cause, how can we charge platform fees? Maybe for every closed campaing when all investigators are getting paid, we get paid too, maybe curated verified ads? real time data analytics on trends in mis/dis info'} */}
                {/* {'Cross-border crowd funding -> Access broader sponsor pool -> Transaction fees (Subscription?)'} */}
            </h3>
        </div>
        <div>
            <h3 style={contentStyle}>
                Optionality
                How will your application handle matching offerings from multiple PFIs
                { }
                {/* {'Verifiable debunking -> trust the investigative report'} */}
            </h3>
        </div>
        <div>
            <h3 style={contentStyle}>
                Customer Management
                How will your application manage customers’ decentralized identifiers and verifiable credential
                {/* {Credential wallet with cconfigurable selective discloure} */}
            </h3>
        </div>
        <div>
            <h3 style={contentStyle}>
                Customer Satisfaction
                How will your application track customer satisfaction with PFIs
                {/* { 'Rating and settlement speed' } */}
            </h3>
        </div>
    </Carousel>
);

export default LandingPageCarousel;