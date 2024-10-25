/**
 * @swagger
 * /api/v1/inventory:
 *   get:
 *     summary: Get all inventories
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventories fetched successfully
 *       401:
 *         description: Unauthorized
 *
 *   post:
 *     summary: Create a new Inventory
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventory'
 *       description: Date should be formatted like - 2024-10-18T12:00:00Z and status - available, out_of_stock, reserved
 *
 *     responses:
 *       201:
 *         description: Inventory created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/inventory/{id}:
 *   get:
 *     summary: Get Inventory by ID
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory fetched successfully
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update an Inventory
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventory'
 *       description: Date should be formatted like - 2024-10-18T12:00:00Z
 *     responses:
 *       200:
 *         description: Inventory updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 *   delete:
 *     summary: Delete an Inventory
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory deleted successfully
 *       401:
 *         description: Unauthorized
 */
