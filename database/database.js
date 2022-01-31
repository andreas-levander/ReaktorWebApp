import { Pool } from "../deps.js";

const CONCURRENT_CONNECTIONS = 5;
const connectionPool = new Pool({
  // add your database configuration here
  hostname: "abul.db.elephantsql.com",
  database: "ccyvjkqw",
  user: "ccyvjkqw",
  password: "woIZJQwMEJ9Bh5nciajFYimQysey5G3m",
  port: 5432,
}, CONCURRENT_CONNECTIONS);

const executeQuery = async (query, ...args) => {
  const response = {};
  let client;

  try {
    client = await connectionPool.connect();
    const result = await client.queryObject(query, ...args);
    if (result.rows) {
      response.rows = result.rows;
    }
  } catch (e) {
    console.log(e);
    response.error = e;
  } finally {
    try {
      await client.release();
    } catch (e) {
      console.log(e);
    }
  }

  return response;
};

export { executeQuery };
