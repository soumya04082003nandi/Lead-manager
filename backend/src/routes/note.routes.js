const express=require("express");
const noteRouter = express.Router();

const noteController = require("../controllers/note.controller");
const {isLoggedIn} = require("../middleware/auth");


noteRouter.post(
    "/:id/create-notes",
    isLoggedIn,
    noteController.handleCreateNote
)

noteRouter.get("/:id/notes", isLoggedIn, noteController.handleGetLeadNotes)


module.exports=noteRouter;