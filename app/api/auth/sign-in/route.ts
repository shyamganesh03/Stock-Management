/**
 * @swagger
 * /api/auth/sign-in:
 *   post:
 *     tags:
 *       - Authentication
 *     description: Authenticates a user with email and password and returns valid user details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "secure password"
 *     responses:
 *       200:
 *         description: User authenticated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Unauthorized. Invalid email or password.
 *       500:
 *         description: Internal server error.
 */

import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import firebase_app from '@/config/firebase-config-data'
import { createSession } from '@/lib/session'

export async function POST(request: Request) {
  const auth = getAuth(firebase_app)

  try {
    // Parse the request body
    const { email, password } = await request.json()
    console.log({ body: request.body, email, password })

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Authenticate the user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    )
    const user = userCredential.user

    // Get the user's ID token
    const token = await user.getIdToken()
    const refreshToken = user.refreshToken

    // Set the token as a session cookie
    await createSession(token, refreshToken)

    // Return user details and set cookie in the response
    return new Response(JSON.stringify(user), {
      status: 200,
    })
  } catch (error: any) {
    console.error('Error during sign-in:', error)

    if (
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/user-not-found'
    ) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      )
    }

    return new Response(
      JSON.stringify({ error: 'An internal server error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
