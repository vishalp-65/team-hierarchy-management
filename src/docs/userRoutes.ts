/**
 * @swagger
 * /api/v1/user/team:
 *   get:
 *     summary: List all teammates
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
 *
 * /api/v1/user/search:
 *   get:
 *     summary: Search for a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: q
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
 *
 * /api/v1/user:
 *   get:
 *     summary: Fetch all users with pagination
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *         description: page number you want
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *         description: Limit of user per page
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 * /api/info:
 *   get:
 *     summary: Check if API is live
 *     tags: [Info]
 *     responses:
 *       200:
 *         description: API is working fine
 */
