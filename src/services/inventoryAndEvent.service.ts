import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { Inventory } from "../entities/Inventory";
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";
import { Event } from "../entities/Event";
import {
    clearCache,
    generateCacheKey,
    getFromCache,
    invalidateAllPrefixCache,
    setCache,
} from "../utils/cacheHandler";

class InventoryAndEvent {
    private inventoryRepo: Repository<Inventory>;
    private eventRepo: Repository<Event>;

    constructor() {
        this.inventoryRepo = AppDataSource.getRepository(Inventory);
        this.eventRepo = AppDataSource.getRepository(Event);
    }

    // Create Inventory
    async createInventory(data: any, userId: string) {
        const inventory = this.inventoryRepo.create(data);

        const inventoryData = await this.inventoryRepo.save(inventory);

        // Invalidate cache
        await invalidateAllPrefixCache("inventories", userId);

        return inventoryData;
    }

    // Update Inventory
    async updateInventory(id: string, data: any, userId: string) {
        const inventory = await this.inventoryRepo.findOneBy({ id });
        if (!inventory)
            throw new ApiError(httpStatus.NOT_FOUND, "Inventory not found");
        Object.assign(inventory, data);

        // Invalidate cache
        await invalidateAllPrefixCache("inventoryByID", id);
        await invalidateAllPrefixCache("inventories", userId);

        return await this.inventoryRepo.save(inventory);
    }

    // delete existing inventory
    async deleteInventory(id: string, userId: string) {
        const inventory = await this.inventoryRepo.findOneBy({ id });
        if (!inventory)
            throw new ApiError(httpStatus.NOT_FOUND, "Inventory not found");
        await this.inventoryRepo.remove(inventory);

        // Invalidate cache
        await invalidateAllPrefixCache("inventoryByID", id);
        await invalidateAllPrefixCache("inventories", userId);
    }

    // Get Inventory by ID
    async getInventoryById(id: string) {
        // Validate cache
        const cacheKey = generateCacheKey("inventoryByID", id, {});

        // Check cache
        let inventoryCache = await getFromCache<Inventory>(cacheKey);
        if (inventoryCache) return inventoryCache;

        const inventory = await this.inventoryRepo.findOneBy({ id });
        if (!inventory)
            throw new ApiError(httpStatus.NOT_FOUND, "Inventory not found");

        // Cache the result
        await setCache(cacheKey, inventory);

        return inventory;
    }

    // Get All Inventories
    async getInventories(userId: string) {
        // Validate cache
        const cacheKey = generateCacheKey("inventories", userId, {});

        // Check cache
        let inventoryCache = await getFromCache<Inventory>(cacheKey);
        if (inventoryCache) return inventoryCache;

        const inventories = await this.inventoryRepo.find();

        // Cache the result
        await setCache(cacheKey, inventories);

        return inventories;
    }

    // Create New Event
    async createEvent(data: any, userId: string) {
        const event = this.eventRepo.create(data);

        // Invalidate cache
        await invalidateAllPrefixCache("events", userId);

        return await this.eventRepo.save(event);
    }

    // Update existing Event
    async updateEvent(id: string, data: any, userId: string) {
        const event = await this.eventRepo.findOneBy({ id });
        if (!event) throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
        Object.assign(event, data);

        // Invalidate cache
        await invalidateAllPrefixCache("eventByID", id);
        await invalidateAllPrefixCache("events", userId);

        return await this.eventRepo.save(event);
    }

    // Delete an Event
    async deleteEvent(id: string, userId: string) {
        const event = await this.eventRepo.findOneBy({ id });
        if (!event) throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
        await this.eventRepo.remove(event);

        // Invalidate cache
        await invalidateAllPrefixCache("eventByID", id);
        await invalidateAllPrefixCache("events", userId);
    }

    // Get Event by ID
    async getEventById(id: string) {
        // Validate cache
        const cacheKey = generateCacheKey("eventByID", id, {});

        // Check cache
        let eventCache = await getFromCache<Event>(cacheKey);
        if (eventCache) return eventCache;

        const event = await this.eventRepo.findOneBy({ id });
        if (!event) throw new ApiError(httpStatus.NOT_FOUND, "Event not found");

        // Cache the result
        await setCache(cacheKey, event);

        return event;
    }

    // Get All Events
    async getEvents(userId: string) {
        // Validate cache
        const cacheKey = generateCacheKey("events", userId, {});

        // Check cache
        let eventCache = await getFromCache<Event>(cacheKey);
        if (eventCache) return eventCache;

        const events = await this.eventRepo.find();

        // Cache the result
        await setCache(cacheKey, events);

        return events;
    }
}

export const InventoryAndEventInstance = new InventoryAndEvent();
