// User type
export interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    name: string;
    surname: string;
    resetToken?: string;
    resetTokenExpiry?: string;
    language?: string;
    profileImage?: string;
    profileImagePublicId?: string;
    accountsOrder?: string[];
}

// Category type
export interface Category {
    _id: string;
    user_id: string;
    name: string;
    color: string;
}

// Account record type
export interface AccountRecord {
    year: number;
    month: string;
    value: number;
}

// Account configuration type
export interface AccountConfiguration {
    backgroundColor: string;
    color: string;
}

// Account type
export interface Account {
    _id: string;
    user_id: string;
    accountName: string;
    records: AccountRecord[];
    configuration: AccountConfiguration;
}