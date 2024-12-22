/**
 * @swagger
 * /api/stock/delete-product:
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
 *             required:
 *               - item_id
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
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    await sql`DELETE FROM items WHERE id = ${requestBody?.item_id}`

    return new Response(
      JSON.stringify({
        success: true,
        message: `item of id: ${requestBody?.item_id} has been deleted successfully`,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Failed to Delete item', error }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
