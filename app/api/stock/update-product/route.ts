/**
 * @swagger
 * /api/stock/update-product:
 *   post:
 *     summary: Update an item in the database
 *     description: Updates the specified fields of an item identified by `item_id` and sets the `updated_at` timestamp.
 *     tags:
 *       - Stock
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item_id:
 *                 type: string
 *                 description: The unique ID of the item to update.
 *                 example: "12345"
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
 *                 example: 10
 *               unit_type:
 *                 type: string
 *                 description: The unit type of item.
 *                 example: "Nos"
 *               qty:
 *                 type: integer
 *                 description: The quantity of the item.
 *                 example: 10
 *             required:
 *               - item_id
 *               - name
 *               - category_id
 *               - unit_price
 *               - unit_type
 *               - description
 *               - qty
 *     responses:
 *       200:
 *         description: The item was successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: Array of updated rows.
 *       500:
 *         description: Failed to update the item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to Update item"
 *                 error:
 *                   type: string
 *                   description: Error details.
 */

import { getCurrentTimestamp } from '@/utils/time-functions'
import { sql } from '@vercel/postgres'

export async function POST(_request: Request) {
  try {
    const requestBody = await _request.json()

    if (!requestBody?.item_id) {
      return new Response(
        JSON.stringify({
          message: 'Please check the following items are filled: item_id',
          success: false,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
    const updated_at = getCurrentTimestamp()

    const { rows } =
      await sql`UPDATE items SET name = ${requestBody.name}, description = ${requestBody.description}, category_id = ${requestBody.category_id}, 
      bar_code = ${requestBody.bar_code}, unit_price = ${requestBody.unit_price}, qty = ${requestBody.qty}, unit_type = ${requestBody.unit_type}, 
      updated_at = ${updated_at} where id=${requestBody.item_id}`

    // const { item_id, ...updateItems } = requestBody

    // // Validate and construct query dynamically
    // const updateFields = []
    // for (const [key, value] of Object.entries(updateItems)) {
    //   if (value !== undefined && value !== null) {
    //     if (typeof value === 'string') {
    //       updateFields.push(`${key} = '${value.replace(/'/g, "''")}'`)
    //     } else {
    //       updateFields.push(`${key} = ${value}`)
    //     }
    //   }
    // }

    // if (updateFields.length === 0) {
    //   return new Response(
    //     JSON.stringify({
    //       message: 'No valid data provided for update.',
    //       success: false,
    //     }),
    //     {
    //       status: 400,
    //       headers: { 'Content-Type': 'application/json' },
    //     },
    //   )
    // }

    // updateFields.push(`updated_at = '${updated_at}'`)

    // const finalSQLquery = `UPDATE items SET name='Diary Milk' WHERE id='eb82728f-4531-4714-8552-fd9bf88e4d90'`

    // console.log({ finalSQLquery })

    // const { rows } = await sql`${finalSQLquery}`

    return new Response(
      JSON.stringify({
        success: true,
        rows,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Failed to Update item',
        error: error,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
