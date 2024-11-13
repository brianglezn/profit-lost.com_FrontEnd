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

// Movements
export interface Movements {
    _id: string;
    user_id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
}

// Category
export interface Category {
    _id: string;
    user_id: string;
    name: string;
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
export interface AccountRecord {
    year: number;
    month: string;
    value: number;
}
export interface AccountConfiguration {
    backgroundColor: string;
    color: string;
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