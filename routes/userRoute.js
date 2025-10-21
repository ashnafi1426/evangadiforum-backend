const express = require("express");
const router = express.Router();
const { register, login, checkUser } = require("../controller/userController");
const auth = require("../middleware/authMiddleware");
router.get("/check", auth, checkUser);

router.post("/register", register);
router.post("/login", login);
module.exports = router;
