import express from "express";
const router = express.Router();
export default router;

import {
  getTracks,
  getTrackById,
  getPlaylistsWithTrackByUser,
} from "#db/queries/tracks";

import getUserFromToken from "#middleware/getUserFromToken";

// Attach user if token exists (non-blocking)
router.use(getUserFromToken);

router.route("/").get(async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.route("/:id").get(async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found");
  res.send(track);
});

// Fix: Check if track exists BEFORE trying to access user
router.get("/:id/playlists", async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found");

  // Optionally use user ID if authenticated
  if (!req.user) return res.status(401).send("Unauthorized");

  const playlists = await getPlaylistsWithTrackByUser(
    req.params.id,
    req.user.id
  );
  res.send(playlists);
});
