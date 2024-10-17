/**
 * @swagger
 * /api/v1/task:
 *   post:
 *     summary: Create a new task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *       description: Due_date should be formatted like - 2024-10-18T12:00:00Z and task_type - general, brand, event, inventory and Only one field is required from BrandID, InventoryId and EventId
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/task/{id}:
 *   patch:
 *     summary: Update existing task
 *     tags: [Task]
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
 *             $ref: '#/components/schemas/Task'
 *       description: Due_date should be formatted like - 2024-10-18T12:00:00Z and task_type - general, brand, event, inventory and Only one field is required from BrandID, InventoryId and EventId
 *     responses:
 *       201:
 *         description: Task updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 *   delete:
 *     summary: Delete existing task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Task Deleted successfully
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/task/{id}/comments:
 *   post:
 *     summary: Add comment to a task
 *     tags: [Task]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/task/{id}/history:
 *   get:
 *     summary: Fetch task history
 *     tags: [Task]
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
 *         description: Task history fetched successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/task/{id}/status:
 *   patch:
 *     summary: Update existing task status
 *     tags: [Task]
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
 *             properties:
 *               status:
 *                 type: string
 *       description: status should be - open, in-progress, completed, overdue
 *     responses:
 *       201:
 *         description: Task status updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/tasks:
 *   get:
 *     summary: Fetch tasks by filter
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: taskType
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum : [all, your, team, delegated]
 *         description: Filter tasks by type (all, your, team, delegated)
 *       - name: assignedBy
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter tasks assigned by a specific user (UUID)
 *       - name: assignedTo
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter tasks assigned to a specific user (UUID)
 *       - name: teamOwner
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter tasks by team owner (UUID)
 *       - name: dueDatePassed
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *           enum: [0, 1]
 *         description: Filter tasks where the due date has passed (1 for true, 0 for false)
 *       - name: brandName
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter tasks by brand name
 *       - name: inventoryName
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter tasks by inventory name
 *       - name: eventName
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter tasks by event name
 *       - name: sortBy
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [status, due_date, title]
 *         description: Sort tasks by a specific field (status, due_date, title)
 *       - name: order
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Order the sorted tasks in ascending (asc) or descending (desc) order
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
