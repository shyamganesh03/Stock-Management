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
 *               name:
 *                 type: string
 *                 description: The name of the item to search for.
 *               unit_type:
 *                 type: string
 *                 description: The unit type to filter items.
 *               limit:
 *                 type: integer
 *                 description: The number of items to fetch per page.
 *                 default: 10
 *               offset:
 *                 type: integer
 *                 description: The starting point for fetching items.
 *                 default: 0
 *               order_by:
 *                type: string
 *               description: The order of the items to fetch ( ascending - ASE or descending - DES).
 *     responses:
 *       200:
 *         description: Successfully retrieved items and their categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       unit:
 *                         type: string
 *                       category:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           sub_type:
 *                             type: string
 *                 total:
 *                   type: integer
 *                   description: The total number of items matching the query.
 *       400:
 *         description: Bad request due to invalid input or server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

import { db, QueryResultRow } from '@vercel/postgres'

function searchQuery(queryFields: any) {
  let finalQuery = ''
  if (queryFields?.name) {
    finalQuery += `items.name LIKE '%${queryFields.name}%' `
  }
  if (queryFields?.unit_type) {
    finalQuery += `items.name LIKE '%${queryFields.unit_type}%' `
  }
  return finalQuery
}

export async function POST(_request: Request) {
  const postgresDb = await db.connect()

  try {
    const requestBody = await _request.json()

    const searchQueryString = searchQuery(requestBody)
    const whereClause = searchQueryString ? `WHERE ${searchQueryString}` : ''

    const sqlQuery = whereClause
      ? `SELECT items.*, category.type, category.sub_type FROM items INNER JOIN category ON items.category_id = category.id ${whereClause} LIMIT ${requestBody?.limit || 10} OFFSET ${requestBody?.offset || 0} ORDER BY items.created_at ${requestBody?.order_by || 'DEC'};`
      : `SELECT items.*, category.type, category.sub_type FROM items INNER JOIN category ON items.category_id = category.id LIMIT ${requestBody?.limit || 10} OFFSET ${requestBody?.offset || 0} ORDER BY ${requestBody?.order_by || 'DEC'};`

    const totalItemQuery = whereClause
      ? `SELECT COUNT(*) FROM items ${whereClause};`
      : `SELECT COUNT(*) FROM items;`

    const { rows } = await postgresDb.query(sqlQuery)
    const { rows: totalRows } = await postgresDb.query(totalItemQuery)

    const total = Number(totalRows[0].count)

    let finalData: QueryResultRow[] = []

    rows.map((row: any) => {
      let { type, sub_type, ...products } = row
      finalData.push({ ...products, category: { type, sub_type } })
    })

    postgresDb.release()

    return new Response(JSON.stringify({ items: finalData, total }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    postgresDb.release()

    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
