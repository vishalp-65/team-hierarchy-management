export interface brandTypes {
    brand_name?: string;
    revenue?: number;
    deal_closed_value?: number;
    contact_person_name?: string;
    contact_person_phone?: string;
    contact_person_email?: string;
    ownerIds?: number[];
}

enum roles {}

export interface usersTypes {
    user_name?: string;
    password?: string;
    phone_number?: string;
    email?: string;
    roles?: ("ADMIN" | "PO" | "BO" | "TO")[];
    managerId?: number;
}

export interface contactPerson {
    contact_person_name?: string;
    contact_person_email?: string;
    contact_person_phone?: string;
}
