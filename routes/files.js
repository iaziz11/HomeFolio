const express = require("express");
const router = express.Router({ mergeParams: true });
const files = require("../controllers/files");
const { isLoggedIn, hasPermission } = require("../utils");
const { validateFile, wrapAsync } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(isLoggedIn, hasPermission, wrapAsync(files.getFiles))
  .post(
    isLoggedIn,
    hasPermission,
    upload.single("uploadFile"),
    validateFile,
    wrapAsync(files.addFile)
  );

router
  .route("/:id")
  .get(isLoggedIn, hasPermission, wrapAsync(files.getFile))
  .put(isLoggedIn, hasPermission, validateFile, wrapAsync(files.editFile))
  .delete(isLoggedIn, hasPermission, wrapAsync(files.deleteFile));

module.exports = router;
