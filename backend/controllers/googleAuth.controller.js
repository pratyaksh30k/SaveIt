const passport = require("passport");
const jwt = require("jsonwebtoken");

const googleSignin = passport.authenticate("google", {
  scope: ["email", "profile"],
  session: false,
});

const googleCallback = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}`);
};

module.exports = { googleSignin, googleCallback };
