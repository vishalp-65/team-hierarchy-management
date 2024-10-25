const taskStatus = ["open", "in-progress", "completed", "overdue"];
const taskType = ["general", "brand", "event", "inventory"];
const inventoryStatus = ["available", "out_of_stock", "reserved"];
const defaultRoles = ["ADMIN", "MG", "PO", "BO", "TO"];

const adminUserMock = {
    user_name: "admin user",
    email: "admin@gmail.com",
    password: "12345678",
    phone_number: "1234567890",
    roles: ["ADMIN"],
};

export { taskStatus, taskType, inventoryStatus, adminUserMock, defaultRoles };
