import db from "#db/client";

// Create a new playlist
export async function createPlaylist(name, description, userId) {
  const sql = `
    INSERT INTO playlists (name, description, user_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [name, description, userId]);
  return playlist;
}

// Get all playlists by a specific user
export async function getPlaylistsByUserId(userId) {
  const sql = `
    SELECT * FROM playlists WHERE user_id = $1
  `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
}

// Get a playlist by its ID
export async function getPlaylistById(id) {
  const sql = `
    SELECT * FROM playlists WHERE id = $1
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [id]);
  return playlist;
}
