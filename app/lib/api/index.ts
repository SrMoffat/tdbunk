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

export const generateVc = async (data: UserDetails) => {
    const response = await fetch('/api/credentials', {
        method: 'POST',
        body: JSON.stringify(data)
    })

    const vc = await response.json()

    return vc
}

export const getExchangeRate = async (data: ExchangeRate) => {
    const { source, destination } = data
    const response = await fetch(`/api/rates`, )

    const vc = await response.json()

    return vc
}