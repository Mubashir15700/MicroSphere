/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: API endpoints for managing notifications
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve all notifications
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique ID of the notification.
 *                   title:
 *                     type: string
 *                     description: The title of the notification.
 *                   description:
 *                     type: string
 *                     description: A detailed description of the notification.
 *                   assigneeId:
 *                     type: string
 *                     description: The ID of the user assigned to the notification (if any).
 *       500:
 *         description: Server error or internal processing failure
 */

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a notification by its ID
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the notification to update.
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
 *                 description: The title of the notification.
 *               description:
 *                 type: string
 *                 description: The description of the notification.
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: The due date of the notification (optional).
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 description: The status of the notification.
 *               assigneeId:
 *                 type: string
 *                 description: The ID of the user to assign to the notification (only for admins).
 *     responses:
 *       200:
 *         description: Successfully updated the notification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 notification:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique ID of the notification.
 *                     title:
 *                       type: string
 *                       description: The title of the notification.
 *                     description:
 *                       type: string
 *                       description: The description of the notification.
 *                     assigneeId:
 *                       type: string
 *                       description: The ID of the user assigned to the notification.
 *       400:
 *         description: Invalid notification ID or invalid field in request body
 *       403:
 *         description: Access denied. You are not the assignee or an admin.
 *       404:
 *         description: notification not found or assignee not found (if updating assignee)
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
