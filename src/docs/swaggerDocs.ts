// src/docs/swaggerDocs.ts

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *          - user_name
 *          - email
 *          - phone_number
 *          - password
 *          - roles
 *        properties:
 *           user_name:
 *             type: string
 *           email:
 *              type: string
 *           password:
 *              type: string
 *           roles:
 *              type: array
 *              items:
 *                  type: string
 *                  enum: [ADMIN, PO, BO, TO]
 *           phone_number:
 *               type: string
 *           managerId:
 *               type: number
 */

// CREATE USER [ADMIN]

/**
 * @swagger
 * /api/v1/admin/user:
 *   post:
 *     summary: Create a new user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - email
 *               - phone_number
 *               - password
 *               - roles
 *             properties:
 *               user_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                    type: string
 *                    enum: [ADMIN, PO, BO, TO]
 *               phone_number:
 *                  type: string
 *               managerId:
 *                  type: number
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

// UPDATE USER [ADMIN]

/**
 * @swagger
 * /api/v1/admin/user:id:
 *   put:
 *     summary: Update existing user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - email
 *               - phone_number
 *               - password
 *               - roles
 *             properties:
 *               user_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                    type: string
 *                    enum: [ADMIN, PO, BO, TO]
 *               phone_number:
 *                  type: string
 *               managerId:
 *                  type: number
 *     responses:
 *       201:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

// CREATE BRAND BY [ADMIN]

/**
 * @swagger
 * /api/v1/admin/brand:
 *   post:
 *     summary: Create new brand
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brand_name
 *               - revenue
 *               - deal_closed_value
 *               - contact_person_name
 *               - contact_person_phone
 *               - contact_person_email
 *             properties:
 *               brand_name:
 *                 type: string
 *               revenue:
 *                 type: number
 *               deal_closed_value:
 *                 type: number
 *               ownerIds:
 *                 type: array
 *                 items:
 *                    type: number
 *               contact_person_name:
 *                  type: string
 *               contact_person_phone:
 *                  type: number
 *               contact_person_email:
 *                  type: string
 *     responses:
 *       201:
 *         description: Brand created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

// UPDATE BRAND DETAILS [ADMIN]

/**
 * @swagger
 * /api/v1/admin/brand:id:
 *   put:
 *     summary: Update existing brand
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brand_name
 *               - revenue
 *               - deal_closed_value
 *               - contact_person_name
 *               - contact_person_phone
 *               - contact_person_email
 *             properties:
 *               brand_name:
 *                 type: string
 *               revenue:
 *                 type: number
 *               deal_closed_value:
 *                 type: number
 *               ownerIds:
 *                 type: array
 *                 items:
 *                    type: number
 *               contact_person_name:
 *                  type: string
 *               contact_person_phone:
 *                  type: number
 *               contact_person_email:
 *                  type: string
 *     responses:
 *       201:
 *         description: Brand updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

// ASSIGN ROLE TO THE USER [ADMIN]

/**
 * @swagger
 * /api/v1/admin/assign-role:
 *   post:
 *     summary: Assign a new role to user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - roleIds
 *             properties:
 *               userId:
 *                 type: number
 *               roleIds:
 *                 type: array
 *                 items:
 *                    type: number
 *     responses:
 *       201:
 *         description: Role updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/user/team:
 *   get:
 *     summary: List teammates
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teammates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/user/search:
 *   get:
 *     summary: Search for a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
