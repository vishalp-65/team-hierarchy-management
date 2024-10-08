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
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *             enum: [ADMIN, PO, BO, TO]
 *         phone_number:
 *           type: string
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
 *             type: number
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
 */
