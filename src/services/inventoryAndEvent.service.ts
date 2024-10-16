import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { Inventory } from "../entities/Inventory";
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";
import { Event } from "../entities/Event";

class InventoryAndEvent {
    private inventoryRepo: Repository<Inventory>;
    private eventRepo: Repository<Event>;

    constructor() {
        this.inventoryRepo = AppDataSource.getRepository(Inventory);
        this.eventRepo = AppDataSource.getRepository(Event);
    }

    // Create Inventory
    async createInventory(data: any) {
        const inventory = this.inventoryRepo.create(data);
        return await this.inventoryRepo.save(inventory);
    }

    // Update Inventory
    async updateInventory(id: string, data: any) {
        const inventory = await this.inventoryRepo.findOneBy({ id });
        if (!inventory)
            throw new ApiError(httpStatus.NOT_FOUND, "Inventory not found");
        Object.assign(inventory, data);
        return await this.inventoryRepo.save(inventory);
    }

    // delete existing inventory
    async deleteInventory(id: string) {
        const inventory = await this.inventoryRepo.findOneBy({ id });
        if (!inventory)
            throw new ApiError(httpStatus.NOT_FOUND, "Inventory not found");
        await this.inventoryRepo.remove(inventory);
    }

    // Get Inventory by ID
    async getInventoryById(id: string) {
        const inventory = await this.inventoryRepo.findOneBy({ id });
        if (!inventory)
            throw new ApiError(httpStatus.NOT_FOUND, "Inventory not found");
        return inventory;
    }

    // Get All Inventories
    async getInventories() {
        return await this.inventoryRepo.find();
    }

    // Create New Event
    async createEvent(data: any) {
        const event = this.eventRepo.create(data);
        return await this.eventRepo.save(event);
    }

    // Update existing Event
    async updateEvent(id: string, data: any) {
        const event = await this.eventRepo.findOneBy({ id });
        if (!event) throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
        Object.assign(event, data);
        return await this.eventRepo.save(event);
    }

    // Delete an Event
    async deleteEvent(id: string) {
        const event = await this.eventRepo.findOneBy({ id });
        if (!event) throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
        await this.eventRepo.remove(event);
    }

    // Get Event by ID
    async getEventById(id: string) {
        const event = await this.eventRepo.findOneBy({ id });
        if (!event) throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
        return event;
    }

    // Get All Events
    async getEvents() {
        return await this.eventRepo.find();
    }
}

export const InventoryAndEventInstance = new InventoryAndEvent();
