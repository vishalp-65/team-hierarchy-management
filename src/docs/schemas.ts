/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - user_name
 *         - email
 *         - phone_number
 *         - password
 *         - roles
 *       properties:
 *         user_name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         phone_number:
 *           type: string
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *             enum: [ADMIN, PO, BO, TO]
 *         managerId:
 *           type: number
 *
 *     Brand:
 *       type: object
 *       required:
 *         - brand_name
 *         - revenue
 *         - deal_closed_value
 *         - contact_person_name
 *         - contact_person_phone
 *         - contact_person_email
 *       properties:
 *         brand_name:
 *           type: string
 *         revenue:
 *           type: number
 *         deal_closed_value:
 *           type: number
 *         ownerIds:
 *           type: array
 *           items:
 *             type: uuid
 *         contact_person_name:
 *           type: string
 *         contact_person_phone:
 *           type: string
 *         contact_person_email:
 *           type: string
 *
 *     ContactPerson:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *         - email
 *       properties:
 *         contact_person_name:
 *           type: string
 *         contact_person_phone:
 *           type: string
 *         contact_person_email:
 *           type: string
 *
 *     Event:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - event_date
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         event_date:
 *           type: Date
 *           description: date should look like - 2024-10-18T12:00:00Z
 *
 *     Inventory:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - quantity
 *         - status
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         quantity:
 *           type: number
 *         status:
 *           type: string
 *           description: status - available, out_of_stock, reserved
 *
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - task_type
 *         - due_date
 *         - assigneeId
 *         - brandId
 *         - inventoryId
 *         - eventId
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         task_type:
 *           type: number
 *           description: task_type - general, brand, event, inventory
 *         due_date:
 *           type: Date
 *           description: date should look like - 2024-10-18T12:00:00Z
 *         assigneeId:
 *           type: string
 *         brandId:
 *           type: string
 *         inventoryId:
 *           type: string
 *         eventId:
 *           type: string
 */
