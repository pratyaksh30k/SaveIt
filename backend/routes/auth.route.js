const express = require("express");
const router = express.Router();
const passport = require("passport");

const authController = require("../controllers/auth.controller.js");
const googleAuthController = require("../controllers/googleAuth.controller.js");
const protect = require("../middlewares/protect.middleware.js");

router.post("/signup", authController.signup);
router.post("/verify-email", authController.verifyEmail);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/me", protect, (req, res) => res.json(req.user));

router.get("/google", googleAuthController.googleSignin);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth`,
  }),
  googleAuthController.googleCallback,
);

module.exports = router;
