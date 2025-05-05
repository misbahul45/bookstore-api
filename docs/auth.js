/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication operations (login, register, OTP, password reset)
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     AuthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             accessToken:
 *               type: string
 *             refreshToken:
 *               type: string
 *             user:
 *               $ref: '#/components/schemas/User'
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: ['admin', 'user', 'seller']
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *   examples:
 *     AuthSuccess:
 *       value:
 *         status: 200
 *         message: "Login successful"
 *         data:
 *           accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx"
 *           refreshToken: "refreshToken123"
 *           user:
 *             id: "uuid-123"
 *             username: "john_doe"
 *             email: "john@example.com"
 *             role: "user"
 *             isActive: true
 *     AuthError:
 *       value:
 *         status: 401
 *         message: "Invalid credentials"
 */

// --- ENDPOINTS ---

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Sign in a user
 *     description: Authenticate a user and generate access and refresh tokens.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully signed in
 *         content:
 *           application/json:
 *             example:
 *               $ref: '#/components/examples/AuthSuccess'
 *       401:
 *         description: Invalid credentials or inactive user
 *         content:
 *           application/json:
 *             example:
 *               $ref: '#/components/examples/AuthError'
 */
class AuthController {
  async signin(req, res, next) { /* ... */ }

  /**
   * @swagger
   * /auth/signup:
   *   post:
   *     summary: Sign up a new user
   *     description: Create a new user and generate OTP for verification.
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 example: password123
   *               name:
   *                 type: string
   *                 example: John Doe
   *     responses:
   *       201:
   *         description: Successfully signed up and OTP generated
   *       409:
   *         description: User already exists
   */
  async signup(req, res, next) { /* ... */ }

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh authentication tokens
 *     description: Generate a new access and refresh token using the refresh token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               refreshToken:
 *                 type: string
 *                 example: <your-refresh-token>
 *     responses:
 *       200:
 *         description: Successfully refreshed tokens
 *       401:
 *         description: Invalid refresh token or user not found
 */
async refreshToken(req, res, next) { /* ... */ }

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP sent to the user
 *     description: Verify the OTP entered by the user during sign-up.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       401:
 *         description: Invalid or expired OTP
 */
async verifyOtp(req, res, next) { /* ... */ }

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the user's profile details.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
async profile(req, res, next) { /* ... */ }

/**
 * @swagger
 * /auth/logout:
 *   delete:
 *     summary: Logout a user
 *     description: Logs out the user and clears their refresh token.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
async logout(req, res, next) { /* ... */ }

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Generates an OTP for the user to reset their password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Successfully sent OTP
 *       404:
 *         description: User not found
 */
async forgotPassword(req, res, next) { /* ... */ }

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Allows a user to reset their password using a valid OTP.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Successfully reset password
 *       401:
 *         description: OTP expired or not verified
 *       404:
 *         description: User not found
  // Removed duplicate resetPassword method
}

module.exports = new AuthController();
async resetPassword(req, res, next) { /* ... */ }