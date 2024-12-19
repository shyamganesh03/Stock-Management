/**
 * @swagger
 * /api/stock/category:
 *  post:
 *    tags:
 *      - Stock
 *    description: Insert the new stocks category.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *             type:
 *               type: string
 *               example: "grocery-foods"
 *             sub_type:
 *               type: string
 *               example: "Snacks"
 *    responses:
 *       201:
 *         description: The new category has been inserted successfully.
 *       500:
 *         description: Failed to fetch categories.
 *  get:
 *    tags:
 *      - Stock
 *    description: Fetch and display the all data from category.
 *    responses:
 *      200:
 *       content:
 *        application/json:
 *         schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "742001a3-3090-49b6-aa9b-3d76b3938413"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-12-19T10:57:28.833Z"
 *                   type:
 *                     type: string
 *                     example: "grocery-food"
 *                   sub_type:
 *                     type: string
 *                     example: "Snacks"
 *       500:
 *         description: Failed to fetch category data.
 */

import { sql } from '@vercel/postgres'

export async function POST(_request: Request) {
  try {
    const requestBody = await _request.json()

    if (!requestBody.type || !requestBody.sub_type) {
      return new Response(
        JSON.stringify({
          message: 'Please provide valid category type and sub_type',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Execute the SQL query

    await sql`INSERT INTO  category (id, created_at, type, sub_type) VALUES (DEFAULT, DEFAULT, ${requestBody.type}, ${requestBody.sub_type || ''});`

    // Return the rows as an array of objects
    return new Response(
      JSON.stringify({
        message: 'The new category has been inserted successfully.',
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    // Log the error
    console.error('Error executing SQL query:', error)

    // Return an error response
    return new Response(
      JSON.stringify({ message: 'Failed to Insert data category', error }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}

export async function GET(_request: Request) {
  try {
    const { rows } = await sql`SELECT * FROM category;`

    // Return the rows as an array of objects
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    // Return an error response
    return new Response(
      JSON.stringify({ message: 'Failed to fetch category', error }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
