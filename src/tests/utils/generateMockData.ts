import { faker } from "@faker-js/faker/.";

type TaskType = "general" | "brand" | "event" | "inventory";

interface BrandData {
    brand_name: string;
    revenue: number;
    deal_closed_value: number;
    contact_person_name: string;
    contact_person_phone: string;
    contact_person_email: string;
    ownerIds: string[];
}

interface TaskData {
    title: string;
    description: string;
    task_type: TaskType;
    due_date: string;
    assigneeId: string;
    brandId?: string; // Optional, only for brand tasks
    eventId?: string; // Optional, only for event tasks
    inventoryId?: string; // Optional, only for inventory tasks
}

// Function to generate random user mock data
export const generateRandomUserData = (
    roles: string[] = ["ADMIN"],
    managerId?: string
) => {
    return {
        user_name: faker.person.firstName(),
        email: faker.internet.email(),
        password: "12345678",
        phone_number: "1234567890",
        roles: roles.length ? roles : ["ADMIN"],
        ...(managerId ? { managerId } : {}),
    };
};

// Function to generate random brand data
export const generateBrandData = (ownerIds: string[]): BrandData => {
    return {
        brand_name: faker.company.name(),
        revenue: Math.floor(Math.random() * 10000) + 1000,
        deal_closed_value: Math.floor(Math.random() * 5000) + 500,
        contact_person_name: faker.person.fullName(),
        contact_person_phone: "1234567890",
        contact_person_email: faker.internet.email(),
        ownerIds: ownerIds,
    };
};

// Generate random task mock data
export const generateTaskData = (
    task_type: TaskType,
    assigneeId?: string,
    id?: string
): TaskData => {
    const baseTaskData: TaskData = {
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        task_type: task_type,
        due_date: "2025-10-18T12:00:00Z",
        assigneeId: assigneeId,
    };

    // Add conditional properties based on task_type
    if (task_type === "brand") {
        baseTaskData.brandId = id;
    } else if (task_type === "event") {
        baseTaskData.eventId = id;
    } else if (task_type === "inventory") {
        baseTaskData.inventoryId = id;
    }

    return baseTaskData;
};
