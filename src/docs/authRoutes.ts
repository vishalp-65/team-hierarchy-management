/**
 * @swagger
 * /api/v1/auth/changePassword:
 *   post:
 *     summary: Change default password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password change successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
