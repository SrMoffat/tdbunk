type CountryType = string | null;

export type PartialCursor = {
    x: number;
    y: number;
    pointer: "mouse" | "touch";
};

export type Cursor = PartialCursor & {
    country: CountryType;
    lastUpdate: number;
};

export type CursorsMap = {
    [id: string]: Cursor;
};

