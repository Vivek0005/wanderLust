const User = require("../models/user");
const { sendWelcomeEmail } = require("../utils/nodeMailer");

module.exports.signUpForm = (req, res) => {
  res.render("users/signup");
};

module.exports.signUp = async (req, res, next) => {
  try {
    const { username, email, password, contact } = req.body;
    const user = new User({ username, email, contact });

    const registeredUser = await User.register(user, password);
    await sendWelcomeEmail(email, username);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User Registered Successfully");
      res.redirect("/listings");
    });
  } catch (err) {
    if (err.name === "UserExistsError") {
      req.flash("error", "Username or Email already exists. Please enter a different one.");
    } else {
      req.flash("error", err.message);
    }
    res.redirect("/signup");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  // console.log("Redirect URL in locals:", res.locals.redirectUrl);
  const redirectUrl = res.locals.redirectUrl || "/listings";
  req.flash("success", "Logged in Successfully");
  res.redirect(redirectUrl);
};


module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out Successfully");
    res.redirect("/listings");
  });
};

module.exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.render("users/userProfile", { user });
  } catch (err) {
    req.flash("error", "Failed to load profile.");
    res.redirect("/listings");
  }
};

module.exports.editProfileForm = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.render("users/editProfile", { user });
  } catch (err) {
    req.flash("error", "Failed to load profile.");
    res.redirect("/listings");
  }
}

module.exports.updateProfile=async (req, res) => {
    let id=req.params.id;
    
    let user = await User.findByIdAndUpdate(id, req.body.user, {
      new: true,
    });
    req.flash("success", "Profile updated successfully");
   
    // console.log(user);
   
    if (!user) {
      req.flash("error", "The Profile was not found");
      res.redirect(`/users/${id}`);
    }
    res.redirect(`/users/${id}`);
}