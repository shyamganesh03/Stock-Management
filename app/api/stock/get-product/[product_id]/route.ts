/**
 * @swagger
 * /api/stock/get-product/{product_id}:
 *   get:
 *     summary: Fetch stock details by ID
 *     description: Retrieves detailed information about a specific stock item, including its category type and sub-type.
 *     tags:
 *      - Stock
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the stock item to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved stock details.
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
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "123"
 *                       name:
 *                         type: string
 *                         example: "Item Name"
 *                       category_id:
 *                         type: string
 *                         example: "456"
 *                       type:
 *                         type: string
 *                         example: "Electronics"
 *                       sub_type:
 *                         type: string
 *                         example: "Mobile"
 *       500:
 *         description: Failed to fetch stock details.
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
 *                   example: "Failed to fetch stock details of id: {product_id}"
 *                 error:
 *                   type: object
 *                   description: The error details.
 */

import { QueryResultRow, sql } from '@vercel/postgres'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ product_id: string }> },
) {
  const product_id = (await params).product_id
  try {
    const { rows } =
      await sql`SELECT items.*, category.type, category.sub_type FROM items 
                INNER JOIN category ON items.category_id = category.id where items.id = ${product_id}`

    let finalData: QueryResultRow[] = []

    rows.map((row: any) => {
      let { type, sub_type, ...products } = row
      finalData.push({ ...products, category: { type, sub_type } })
    })

    return new Response(
      JSON.stringify({
        success: true,
        rows: finalData,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: `Failed to fetch stock details of id: ${product_id}`,
        error,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
