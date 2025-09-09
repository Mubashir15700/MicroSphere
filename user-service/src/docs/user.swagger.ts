/**
 * @swagger
 * tags:
 *   name: User
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The full name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password for the user.
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique ID of the newly created user.
 *                 name:
 *                   type: string
 *                   description: The name of the newly created user.
 *                 email:
 *                   type: string
 *                   description: The email of the newly created user.
 *       400:
 *         description: Invalid input or email already in use
 *       500:
 *         description: Server error or internal processing failure
 */

/**
 * @swagger
 * /email/{email}:
 *   get:
 *     summary: Retrieve a user by email
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: The email address of the user to retrieve.
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: Successfully retrieved the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique ID of the user.
 *                 name:
 *                   type: string
 *                   description: The name of the user.
 *                 email:
 *                   type: string
 *                   description: The email of the user.
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error or internal processing failure
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique ID of the user.
 *                   name:
 *                     type: string
 *                     description: The name of the user.
 *                   email:
 *                     type: string
 *                     description: The email of the user.
 *       403:
 *         description: Access denied. Admins only.
 *       500:
 *         description: Server error or internal processing failure
 */

/**
 * @swagger
 * /userId/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the user to retrieve.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully retrieved the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique ID of the user.
 *                 name:
 *                   type: string
 *                   description: The name of the user.
 *                 email:
 *                   type: string
 *                   description: The email of the user.
 *       400:
 *         description: Invalid user ID
 *       403:
 *         description: Access denied. Admins only or the user themselves can access this endpoint.
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error or internal processing failure
 */

/**
 * @swagger
 * /userId/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the user to update.
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *     responses:
 *       200:
 *         description: Successfully updated the user
 *       400:
 *         description: Invalid user ID or bad input
 *       403:
 *         description: Access denied. Admins only or the user themselves can update their information.
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error or internal processing failure
 */

/**
 * @swagger
 * /:
 *   delete:
 *     summary: Delete a user or multiple users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: The unique ID of the user to delete. If not provided, deletes users based on filter.
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: includeAdmins
 *         required: false
 *         description: If true, deletes all users including admins. Defaults to false.
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           default: false
 *     responses:
 *       200:
 *         description: Successfully deleted users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The result message indicating the number of deleted users.
 *       400:
 *         description: Invalid user ID or bad input
 *       403:
 *         description: Access denied. Admins only can perform this action.
 *       404:
 *         description: User not found or no users were deleted
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
