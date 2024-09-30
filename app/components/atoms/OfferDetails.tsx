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
    hasRequiredClaims: boolean;
    offeringToCurrencyMethods: any[];
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
    offeringToCurrencyMethods
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
                offeringToCurrencyMethods={offeringToCurrencyMethods}
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
            offeringToCurrencyMethods={offeringToCurrencyMethods}
        />
}

export default AssetExchangeOffer
