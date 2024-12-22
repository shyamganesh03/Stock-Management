/**
 * @swagger
 * /api/stock/add-product:
 *   post:
 *     summary: Add a new item
 *     description: Adds a new item to the database. All fields are required except for `description` and `bar_code`.
 *     tags:
 *       - Stock
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the item.
 *                 example: "Laptop"
 *               description:
 *                 type: string
 *                 description: The describe something about product.
 *                 example: ""
 *               bar_code:
 *                 type: string
 *                 description: ""
 *                 example: ""
 *               category_id:
 *                 type: string
 *                 description: The category ID the item belongs to.
 *                 example: "742001a3-3090-49b6-aa9b-3d76b3938413"
 *               unit_price:
 *                 type: number
 *                 description: The price of the item.
 *                 example: 499.99
 *               unit_type:
 *                 type: string
 *                 description: The unit type of item.
 *                 example: "Nos"
 *               qty:
 *                 type: integer
 *                 description: The quantity of the item.
 *                 example: 10
 *             required:
 *               - name
 *               - category_id
 *               - unit_price
 *               - unit_type
 *               - qty
 *     responses:
 *       200:
 *         description: The item was added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The item has been added successfully."
 *                 success:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Error adding the item due to missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please check the following items are filled: name, category_id, unit_price, qty"
 *                 success:
 *                   type: boolean
 *                   example: false
 */

import { sql } from '@vercel/postgres'

export async function POST(_request: Request) {
  try {
    const requestBody = await _request.json()
    if (
      !requestBody?.name ||
      !requestBody?.category_id ||
      !requestBody?.unit_price ||
      !requestBody?.unit_type ||
      isNaN(requestBody?.qty)
    ) {
      return new Response(
        JSON.stringify({
          message:
            'Please check the following items are filled: name, category_id, unit_price, qty',
          success: false,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
    await sql`INSERT INTO items (id, name, description, category_id, bar_code, created_at, unit_price, qty, unit_type, updated_at) 
            VALUES (DEFAULT, ${requestBody?.name}, ${requestBody?.description}, 
            ${requestBody?.category_id}, '', DEFAULT, ${requestBody?.unit_price}, 
            ${requestBody?.qty}, ${requestBody?.unit_type}, DEFAULT);`

    return new Response(
      JSON.stringify({
        message: 'The item as been added successfully.',
        success: true,
      }),
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Failed to add item',
        error: error,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
