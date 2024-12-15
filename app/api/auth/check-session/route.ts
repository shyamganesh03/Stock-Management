/**
 * @swagger
 * /api/auth/check-session:
 *   get:
 *     tags:
 *       - Authentication
 *     description: Checks if the user session is valid by verifying the session cookie.
 *     responses:
 *       200:
 *         description: Session is valid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAuthenticated:
 *                   type: boolean
 *                   example: true
 *                 uid:
 *                   type: string
 *                   example: "user123"
 *       401:
 *         description: Session is invalid or expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAuthenticated:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired session token."
 */

import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'

export async function GET() {
  try {
    // Retrieve cookies from the request using Next.js headers
    const sessionCookie = cookies().get('session')?.value

    const decryptedCookie: any = await decrypt(sessionCookie)

    if (!decryptedCookie?.userToken) {
      return new Response(
        JSON.stringify({
          isAuthenticated: false,
          message: 'No session token found.',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Return success response
    return new Response(
      JSON.stringify({
        isAuthenticated: true,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error verifying session token:', error)
    return new Response(
      JSON.stringify({
        isAuthenticated: false,
        message: 'Invalid or expired session token.',
      }),
      { status: 401, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
