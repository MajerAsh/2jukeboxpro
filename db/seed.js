import db from "#db/client";
import { createUser } from "#db/queries/users";
import { createPlaylist } from "#db/queries/playlists";
import { createTrack } from "#db/queries/tracks";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // for (let i = 1; i <= 20; i++) {
  //   await createPlaylist("Playlist " + i, "lorem ipsum playlist description");
  //   await createTrack("Track " + i, i * 50000);
  // }

  // for (let i = 1; i <= 15; i++) {
  //   const playlistId = 1 + Math.floor(i / 2);
  //   await createPlaylistTrack(playlistId, i);
  // }

  // Create two users
  const user1 = await createUser("alice", "password123");
  const user2 = await createUser("bob", "securepass");

  // Create 10 tracks
  const tracks = [];
  for (let i = 1; i <= 10; i++) {
    const track = await createTrack(`Track ${i}`, i * 50000);
    tracks.push(track);
  }

  // Each user gets a playlist with 5 tracks
  const playlist1 = await createPlaylist(
    "Alice's Playlist",
    "Alice's favorite songs",
    user1.id
  );
  const playlist2 = await createPlaylist(
    "Bob's Playlist",
    "Bob's jams",
    user2.id
  );

  for (let i = 0; i < 5; i++) {
    await createPlaylistTrack(playlist1.id, tracks[i].id);
    await createPlaylistTrack(playlist2.id, tracks[i + 5].id);
  }
}
