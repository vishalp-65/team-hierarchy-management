/**
 * @swagger
 * /api/v1/brand:
 *   get:
 *     summary: Get all brands related to current user
 *     tags: [Brand]
 *     security:
 *       - bearerAuth: []
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
 */

/**
 * @swagger
 * /api/v1/brand/{brandId}:
 *   get:
 *     summary: Get brand details
 *     tags: [Brand]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: brandId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the brand to retrieve
 *     responses:
 *       200:
 *         description: Brand details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       401:
 *         description: Unauthorized
 *
 */
/**
 * @swagger
 * /api/v1/brand:
 *   post:
 *     summary: Create a new brand
 *     tags: [Brand]
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
 */
