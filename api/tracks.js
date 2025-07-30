import express from "express";
const router = express.Router();
export default router;

import {
  getTracks,
  getTrackById,
  getPlaylistsWithTrackByUser,
} from "#db/queries/tracks";
import requireUser from "#middleware/requireUser";

router.route("/").get(async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.route("/:id").get(async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found");
  res.send(track);
});

router.get("/:id/playlists", requireUser, async (req, res) => {
  const playlists = await getPlaylistsWithTrackByUser(
    req.params.id,
    req.user.id
  );
  res.send(playlists);
});
