import db from "#db/client";

// CREATE a new user (with hashed password)
export async function createUser(username, hashedPassword) {
  const sql = `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING id, username
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

// GET user by username (used during login)
export async function getUserByUsername(username) {
  const sql = `
    SELECT * FROM users
    WHERE username = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username]);
  return user;
}

// GET user by ID (used to attach user to req.user from JWT)
export async function getUserById(id) {
  const sql = `
    SELECT id, username
    FROM users
    WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}
