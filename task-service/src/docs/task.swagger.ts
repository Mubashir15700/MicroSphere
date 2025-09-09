/**
 * @swagger
 * tags:
 *   name: Task
 *   description: API endpoints for managing tasks
 */

/**
 * @swagger
 * /:
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
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task.
 *               description:
 *                 type: string
 *                 description: A detailed description of the task.
 *               assigneeId:
 *                 type: string
 *                 description: The ID of the user assigned to the task (optional).
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the newly created task.
 *                 title:
 *                   type: string
 *                   description: The title of the newly created task.
 *                 description:
 *                   type: string
 *                   description: The description of the newly created task.
 *                 assigneeId:
 *                   type: string
 *                   description: The ID of the user assigned to the task (if provided).
 *       400:
 *         description: Invalid or missing task data (e.g., duplicate task title).
 *       404:
 *         description: User not found for the provided assigneeId (if assigneeId is provided).
 *       500:
 *         description: Server error or internal processing failure
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve all tasks
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique ID of the task.
 *                   title:
 *                     type: string
 *                     description: The title of the task.
 *                   description:
 *                     type: string
 *                     description: A detailed description of the task.
 *                   assigneeId:
 *                     type: string
 *                     description: The ID of the user assigned to the task (if any).
 *       500:
 *         description: Server error or internal processing failure
 */

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Retrieve tasks assigned to a specific user
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The unique ID of the user whose tasks are being retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved tasks assigned to the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique ID of the task.
 *                   title:
 *                     type: string
 *                     description: The title of the task.
 *                   description:
 *                     type: string
 *                     description: A detailed description of the task.
 *                   assigneeId:
 *                     type: string
 *                     description: The ID of the user assigned to the task.
 *       400:
 *         description: Invalid user ID
 *       403:
 *         description: Access denied. Admins only.
 *       404:
 *         description: User not found or no tasks found for the user
 *       500:
 *         description: Server error or internal processing failure
 */

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Retrieve a specific task by its ID
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the task to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique ID of the task.
 *                 title:
 *                   type: string
 *                   description: The title of the task.
 *                 description:
 *                   type: string
 *                   description: A detailed description of the task.
 *                 assigneeId:
 *                   type: string
 *                   description: The ID of the user assigned to the task (if any).
 *       400:
 *         description: Invalid task ID
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error or internal processing failure
 */

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a task by its ID
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the task to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task.
 *               description:
 *                 type: string
 *                 description: The description of the task.
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: The due date of the task (optional).
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 description: The status of the task.
 *               assigneeId:
 *                 type: string
 *                 description: The ID of the user to assign to the task (only for admins).
 *     responses:
 *       200:
 *         description: Successfully updated the task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 task:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique ID of the task.
 *                     title:
 *                       type: string
 *                       description: The title of the task.
 *                     description:
 *                       type: string
 *                       description: The description of the task.
 *                     assigneeId:
 *                       type: string
 *                       description: The ID of the user assigned to the task.
 *       400:
 *         description: Invalid task ID or invalid field in request body
 *       403:
 *         description: Access denied. You are not the assignee or an admin.
 *       404:
 *         description: Task not found or assignee not found (if updating assignee)
 *       500:
 *         description: Server error or internal processing failure
 */

/**
 * @swagger
 * /:
 *   delete:
 *     summary: Delete one or more tasks
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: The unique ID of the task to delete (optional). If not provided, all tasks will be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the task(s)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 deletedCount:
 *                   type: integer
 *                   description: The number of tasks deleted (only present when deleting multiple tasks).
 *       400:
 *         description: Invalid task ID
 *       404:
 *         description: Task not found or no tasks to delete
 *       500:
 *         description: Server error or internal processing failure
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       in: header
 *       description: Use a bearer token to authenticate requests.
 */
