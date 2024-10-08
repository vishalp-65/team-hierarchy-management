/**
 * @swagger
 * /api/v1/brand/contact-person:
 *   post:
 *     summary: Create a contact person
 *     tags: [Brand]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactPerson'
 *     responses:
 *       201:
 *         description: Contact person created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/brand/contact-person/{id}:
 *   put:
 *     summary: Update contact person
 *     tags: [ Brand]
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
 *             $ref: '#/components/schemas/ContactPerson'
 *     responses:
 *       201:
 *         description: Contact person updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
