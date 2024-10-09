// src/tests/mockData.ts
export const mockUser = [
    {
        user_name: "admin user",
        email: "admin@example.com",
        password: "password123",
        roles: ["ADMIN"],
        phone_number: "1234567890",
    },
    {
        user_name: "bo user",
        email: "bouser1@example.com",
        password: "password123",
        roles: ["BO"],
        phone_number: "1234567890",
    },
    {
        user_name: "po user",
        email: "po@example.com",
        password: "password123",
        roles: ["PO", "TO"],
        phone_number: "1234567890",
    },
    {
        user_name: "To user",
        email: "touser@example.com",
        password: "password123",
        roles: ["TO"],
        phone_number: "1234567890",
    },
];

export const mockBrand = [
    {
        brand_name: "Brand1",
        revenue: 10000,
        deal_closed_value: 5022,
        contact_person_name: "Vishal",
        contact_person_phone: "1234567890",
        contact_person_email: "vishal@example.com",
        ownerIds: [2],
    },
    {
        brand_name: "Brand2",
        revenue: 10001,
        deal_closed_value: 5021,
        contact_person_name: "brand2",
        contact_person_phone: "1234567890",
        contact_person_email: "brand2@example.com",
    },
    {
        brand_name: "Brand3",
        revenue: 10002,
        deal_closed_value: 5003,
        contact_person_name: "Brand3",
        contact_person_phone: "1234567890",
        contact_person_email: "brand3@example.com",
    },
];

export const mockAssignRole = [
    {
        userId: 1,
        roleIds: [1, 3],
    },
    {
        userId: 3,
        roleIds: [3],
    },
    {
        userId: 4,
        roleIds: [2, 4],
    },
];
