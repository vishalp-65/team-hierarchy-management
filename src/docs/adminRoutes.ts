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
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/admin/user/{id}:
 *   put:
 *     summary: Update existing user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/admin/brand:
 *   post:
 *     summary: Create a new brand
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       201:
 *         description: Brand created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/admin/brand/{id}:
 *   put:
 *     summary: Update existing brand
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       201:
 *         description: Brand updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/admin/assign-role:
 *   post:
 *     summary: Assign role to user
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
 *                   type: number
 *     responses:
 *       201:
 *         description: Role assigned successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 *
 * /api/v1/admin/users/hierarchy/{userId}:
 *   get:
 *     summary: Fetch user hierarchy
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: ID of the user to retrieve
 *     responses:
 *       201:
 *         description: User hierarchy fetched successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
