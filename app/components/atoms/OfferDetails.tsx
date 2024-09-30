import OfferCard from "@/app/components/molecules/cards/Offer";
import { Badge } from "antd";

export interface AssetExchangeOfferProps {
    issuerDid: string;
    selectedCard: any;
    isSpecial: boolean;
    offeringId: string;
    isSelected: boolean;
    isRecommended: boolean;
    issuerVcSchema: string;
    selectedPayinMethod: any;
    selectedPayoutMethod: any;
    hasRequiredClaims: boolean;
    offeringToCurrencyMethods: any[];
    offeringFromCurrencyMethods: any[];
    setSelectedPayinMethod: React.Dispatch<React.SetStateAction<any>>;
    setSelectedPayoutMethod: React.Dispatch<React.SetStateAction<any>>;
}

const AssetExchangeOffer = ({
    isSpecial,
    issuerDid,
    isSelected,
    offeringId,
    selectedCard,
    isRecommended,
    issuerVcSchema,
    hasRequiredClaims,
    selectedPayinMethod,
    selectedPayoutMethod,
    setSelectedPayinMethod,
    setSelectedPayoutMethod,
    offeringToCurrencyMethods,
    offeringFromCurrencyMethods,
}: AssetExchangeOfferProps) => {
    return isRecommended
        ? <Badge.Ribbon text="Recommended">
            <OfferCard
                isSpecial={isSpecial}
                issuerDid={issuerDid}
                offeringId={offeringId}
                isSelected={isSelected}
                selectedCard={selectedCard}
                isRecommended={isRecommended}
                issuerVcSchema={issuerVcSchema}
                hasRequiredClaims={hasRequiredClaims}
                selectedPayinMethod={selectedPayinMethod}
                selectedPayoutMethod={selectedPayoutMethod}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
                offeringFromCurrencyMethods={offeringFromCurrencyMethods}

                setSelectedPayinMethod={setSelectedPayinMethod}
                setSelectedPayoutMethod={setSelectedPayoutMethod}
            />
        </Badge.Ribbon>
        : <OfferCard
            issuerDid={issuerDid}
            isSpecial={isSpecial}
            offeringId={offeringId}
            isSelected={isSelected}
            selectedCard={selectedCard}
            isRecommended={isRecommended}
            issuerVcSchema={issuerVcSchema}
            hasRequiredClaims={hasRequiredClaims}
            selectedPayinMethod={selectedPayinMethod}
            selectedPayoutMethod={selectedPayoutMethod}
            offeringToCurrencyMethods={offeringToCurrencyMethods}
            offeringFromCurrencyMethods={offeringFromCurrencyMethods}

            setSelectedPayinMethod={setSelectedPayinMethod}
            setSelectedPayoutMethod={setSelectedPayoutMethod}
        />
}

export default AssetExchangeOffer
