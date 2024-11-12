// User
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

// Category
export interface Category {
    _id: string;
    user_id: string;
    name: string;
    color: string;
}

// Account record
export interface AccountRecord {
    year: number;
    month: string;
    value: number;
}

// Account configuration
export interface AccountConfiguration {
    backgroundColor: string;
    color: string;
}

// Account
export interface Account {
    _id: string;
    user_id: string;
    accountName: string;
    records: AccountRecord[];
    configuration: AccountConfiguration;
}

// Notes
export default interface Note {
    _id: string;
    title: string;
    content: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}