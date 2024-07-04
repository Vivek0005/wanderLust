const User = require("../models/user");

module.exports.signUpForm = (req, res) => {
  res.render("users/signup");
};

module.exports.signUp = async (req, res) => {
  try {
    const { username, email, password, contact } = req.body;
    const user = new User({ username, email, contact });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User Registered Successful");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = async (req, res) => {
  // console.log(res.locals.redirectUrl);
  req.flash("success", "Logged in Successfully");
  res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out Successfully");
    res.redirect("/listings");
  });
};
