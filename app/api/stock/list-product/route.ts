/**
 * @swagger
 * /api/stock/list-product:
 *   post:
 *     summary: Fetch items with pagination.
 *     description: Retrieve a paginated list of items from the database. The `limit` specifies the number of items to fetch, and the `offset` specifies the offset for pagination.
 *     tags:
 *       - Stock
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               limit:
 *                 type: integer
 *                 description: The number of items to retrieve. Defaults to 10.
 *                 example: 10
 *               offset:
 *                 type: integer
 *                 description: The starting index for pagination. Defaults to 0.
 *                 example: 0
 *     responses:
 *       200:
 *         description: A list of items.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: The structure of the items in the database.
 *       400:
 *         description: Bad request, e.g., invalid input data.
 *       500:
 *         description: Internal server error.
 */

import { sql } from '@vercel/postgres'

export async function POST(_request: Request) {
  try {
    const requestBody = await _request.json()

    const { rows } =
      await sql`SELECT items.*, category.type, category.sub_type FROM items 
                          INNER JOIN category ON items.category_id = category.id LIMIT ${requestBody?.limit || 10} OFFSET ${requestBody?.offset || 0};`
    const { rows: totalRows } = await sql`SELECT COUNT(*) FROM items;`

    const total = Number(totalRows[0].count)

    return new Response(JSON.stringify({ items: rows, total: total }), {
      status: 200,
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Failed to Fetch stocks detail',
        error: error,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
