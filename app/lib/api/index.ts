export interface FieldType {
    email?: string;
    country?: string;
    password?: string;
};

export type UserDetails = FieldType & {
    did: string
}

export type ExchangeRate = {
    source: string;
    destination: string;
}

export interface UserValue {
    label: string;
    value: string;
}

export const generateUltimateIdentifierVc = async (data: UserDetails) => {
    const response = await fetch('/api/credentials', {
        method: 'POST',
        body: JSON.stringify(data)
    })

    const vc = await response.json()

    return vc
}

export const getExchangeRate = async (data: ExchangeRate) => {
    const { source, destination } = data
    const response = await fetch(`/api/rates`,)

    const vc = await response.json()

    return vc
}

export async function fetchUserList(countryName: string): Promise<UserValue[]> {
    const response = await fetch('/countries.json')
    const data = await response.json()

    const similar = data.filter((country: any) => country?.countryName.toLowerCase().includes(countryName.toLowerCase()))

    return similar.map(({ countryName, flag, countryCode }: any) => ({
        label: `${countryName} ${flag}`,
        value: countryCode
    }))
}

export const getFixedRateConversion = async ({
    source,
    destination,
    amount
}: {
    source: string | number;
    destination: string | number;
    amount: string | number;
}) => {
    try {
        const response = await fetch('/api/conversions', {
            method: 'POST',
            body: JSON.stringify({
                source,
                destination,
                amount
            })
        })

        const newAmount = await response.json()

        return newAmount?.conversion_result
    } catch (error: any) {
        console.error("getFixedRateConversion: Conversion failed", error)
    }
}
