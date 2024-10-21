// Mock data used across different test cases

export const mockTask = {};

export const mockEvent = {
    name: "Sample Event",
    description: "This is sample event description",
    event_date: "2025-10-18T12:00:00Z",
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

// Change token before running test cases according to the user type
export const token = {
    admin: "7fe06329-4428-401d-9387-635d21b988a5",
    bo: "b2cc33a8-2c69-4ced-a442-bb86bbc271f5",
};

export const fakeUserIDs = ["7fe06329-4428-401d-9387-635d12b988a5"];
