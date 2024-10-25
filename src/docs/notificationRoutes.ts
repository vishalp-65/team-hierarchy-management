/**
 * @swagger
 * /api/v1/notification:
 *   get:
 *     summary: Fetch user notifications
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/notification/{id}:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: uuid
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: delete notification
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: uuid
 *     responses:
 *       200:
 *         description: Notification deleted
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/notification/readAll:
 *   patch:
 *     summary: Mark all notification as read
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
