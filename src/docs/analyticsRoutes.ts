/**
 * @swagger
 * /api/v1/analytics/:
 *   get:
 *     summary: Fetch task completion analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: timeframe
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: timeFrame should be - today, last3days, last7days, last15days, lastmonth, thismonth, alltime,
 *     responses:
 *       200:
 *         description: Task completion analytics fetched successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 */
