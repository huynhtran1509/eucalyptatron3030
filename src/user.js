export interface IUser {
    id: string;
    zip?: number;
}

export function getMockUserWithLocation(): IUser {
    return {
        id: '123abc',
        zip: 22902
    };
}

export function getMockUserWithoutLocation(): IUser {
    return {
        id: '123abc'
    };
}
