// Mock data used across different test cases
export const mockUser = {
    user_name: "Admin user",
    password: "12345678",
    phone_number: "1234567890",
    email: "adminuser@gmail.com",
    roles: [
        {
            id: 1,
            role_name: "ADMIN",
        },
    ],
    id: "792c511d-aca7-4170-9d42-a94e676c28d7",
};

export const mockTask = {
    title: "Inventory task 1",
    description: "This is testing task",
    task_type: "inventory",
    due_date: "2024-10-18T12:00:00.000Z",
    creator: {
        id: "b2cc33a8-2c69-4ced-a442-bb86bbc271f5",
        user_name: "Team owner",
        password: "12345678",
        phone_number: "1234567890",
        email: "to@gmail.com",
        roles: [
            {
                id: 5,
                role_name: "TO",
            },
        ],
    },
    assignee: {
        id: "573bdff9-c0d6-4736-8d10-928193d1c8ce",
        user_name: "Team owner1",
        password: "12345678",
        phone_number: "1234567890",
        email: "to1@gmail.com",
    },

    id: "63df4322-10f8-4d00-b0b0-3691b6c26000",
    status: "open",
    created_at: "2024-10-17T23:09:48.773Z",
    updated_at: "2024-10-17T23:09:48.773Z",
};

export const mockEvent = {
    id: 1,
    name: "Sample Event",
    date: "2024-10-18T12:00:00Z",
};

export const inventoryData = {
    id: "d533f97e-4360-4b17-819e-5c2af2c79c56",
    name: "First inventory 1",
    description: "this is demo inventory",
    quantity: 10,
    status: "available",
    created_at: "2024-10-16T04:37:06.855Z",
    updated_at: "2024-10-16T04:37:06.855Z",
};

export const token = {
    admin: "7fe06329-4428-401d-9387-635d21b988a5",
    bo: "b2cc33a8-2c69-4ced-a442-bb86bbc271f5",
};
