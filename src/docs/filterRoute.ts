/**
 * @swagger
 * /api/v1/filter/brands:
 *   get:
 *     summary: List of all brands
 *     tags: [Filter]
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
 *         description: Limit of brands per page
 *     responses:
 *       200:
 *         description: List of brands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brand'
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/filter/team:
 *   get:
 *     summary: List of teams
 *     tags: [Filter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Team not found
 *
 * /api/v1/filter/users:
 *   get:
 *     summary: Fetch all users with pagination
 *     tags: [Filter]
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
 *         description: users fetched successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
