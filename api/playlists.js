import express from "express";
const router = express.Router();
export default router;

import {
  createPlaylist,
  getPlaylistById,
  getPlaylistsByUserId,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";

import requireUser from "#middleware/requireUser";
import getUserFromToken from "#middleware/getUserFromToken";

// 🔐 Apply auth to all routes in this router
router.use(getUserFromToken);
router.use(requireUser);

// GET /api/playlists - get all playlists for current user
// POST /api/playlists - create a new playlist
router
  .route("/")
  .get(async (req, res) => {
    const playlists = await getPlaylistsByUserId(req.user.id);
    res.send(playlists);
  })
  .post(async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description)
      return res.status(400).send("Missing: name, description");

    const playlist = await createPlaylist(name, description, req.user.id);
    res.status(201).send(playlist);
  });

// 🎯 Middleware to load playlist by ID & verify ownership
router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found");
  if (playlist.user_id !== req.user.id)
    return res.status(403).send("Forbidden — Not your playlist");

  req.playlist = playlist;
  next();
});

// GET /api/playlists/:id - get single playlist
router.route("/:id").get((req, res) => {
  res.send(req.playlist);
});

// GET /api/playlists/:id/tracks - get tracks for playlist
// POST /api/playlists/:id/tracks - add a track to playlist
router
  .route("/:id/tracks")
  .get(async (req, res) => {
    const tracks = await getTracksByPlaylistId(req.playlist.id);
    res.send(tracks);
  })
  .post(async (req, res) => {
    const { trackId } = req.body;
    if (!trackId) return res.status(400).send("Missing trackId");

    const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
    res.status(201).send(playlistTrack);
  });
