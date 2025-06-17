import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { NoteController } from "../controllers/note-controller";
import { BlockController } from "../controllers/block-controller";
import { upload } from "../middleware/upload-middleware";
import { UserController } from "../controllers/user-controller";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// User routes
apiRouter.get("/users/me", UserController.checkAuth);

// Note routes
apiRouter.post("/notes", NoteController.create);
apiRouter.get("/notes", NoteController.getAll);
apiRouter.get("/notes/:id", NoteController.getById);
apiRouter.put("/notes/:id", NoteController.update);
apiRouter.delete("/notes/:id", NoteController.remove);

// Block routes
apiRouter.post("/notes/:noteId/blocks", BlockController.create);
apiRouter.get("/notes/:noteId/blocks", BlockController.getAll);
apiRouter.put("/blocks/:id", upload.single("file"), BlockController.update);
apiRouter.delete("/blocks/:id", BlockController.remove);
apiRouter.patch("/blocks/order", BlockController.updateBlockOrders);



