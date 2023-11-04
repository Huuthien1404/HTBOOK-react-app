const bcrypt = require("bcrypt");
const client = require("../config/api");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "sign_in_username",
      passwordField: "sign_in_password",
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      client.query(
        `select * from public."Users" where "Username" = '${username}';`,
        (err, results) => {
          if (err) throw err;
          if (results.rows.length === 0) {
            req.authInfo = "Tên đăng nhập không tồn tại";
            return done(null, false);
          }
          const user = results.rows[0];
          bcrypt.compare(password, user.Password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch === false) {
              req.authInfo = "Mật khẩu không đúng";
              return done(null, false);
            }
            if (user.Role !== req.body.role) {
              req.authInfo = "Đăng nhập không đúng vai trò";
              return done(null, false);
            }
            return done(null, {
              username: `${user.Username}`,
            });
          });
        }
      );
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  client.query(
    `select * from public."Users" where "Username" = '${username}';`,
    (err, results) => {
      if (err) throw err;
      return done(null, results.rows[0]);
    }
  );
});

const authController = {
  signInController: (req, res) => {
    passport.authenticate("local", { session: true }, (err, user) => {
      if (err) throw err;
      if (req.authInfo) {
        return res.json({
          message_login: req.authInfo,
        });
      } else {
        req.session.username = user.username;
        req.session.role = req.body.role;
        return res.json({
          message_login: `Đăng nhập thành công với vai trò: ${req.body.role}`,
        });
      }
    })(req, res);
  },
  signUpController: async (req, res) => {
    let username = req.body.sign_up_name;
    let email = req.body.sign_up_email;
    let password = req.body.sign_up_password;
    let role = req.body.role;
    let hashPassword = await bcrypt.hash(password, 10);
    client.query(
      `select "Username", "Email" from public."Users" where "Username" = '${username}' or "Email" = '${email}'`,
      (err, results) => {
        if (err) throw err;
        if (results.rows.length > 0) {
          return res.json({
            message: "Tên đăng nhập hoặc email đã được sử dụng",
          });
        } else {
          client.query(
            `insert into public."Users"("Username", "Password", "Email", "Role") values('${username}', '${hashPassword}', '${email}', '${role}')`,
            (err, results) => {
              if (err) throw err;
              return res.json({
                message: "Đăng ký thành công",
              });
            }
          );
        }
      }
    );
  },
  loggedInController: (req, res) => {
    if (req.session.username) {
      return res.json({
        message_logged_in: "Đã đăng nhập",
        message_username: `${req.session.username}`,
      });
    } else {
      return res.json({
        message_logged_in:
          "Phiên đăng nhập của bạn đã hết hạn. Bạn sẽ được điều hướng về trang đăng nhập ngay bây giờ",
      });
    }
  },
  logOutController: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      } else {
        res.clearCookie("connect.sid");
        return res.json({
          message_log_out: "Session cleared",
        });
      }
    });
  },
  changePassword: (req, res) => {
    client.query(
      `select "Password" from public."Users" where "Username" = '${req.body.username}';`,
      (err, results) => {
        if (err) throw err;
        bcrypt.compare(
          req.body.current_password,
          results.rows[0].Password,
          async (err, isMatch) => {
            if (err) throw err;
            if (isMatch === true) {
              const hash = await bcrypt.hash(req.body.new_password, 10);
              client.query(
                `UPDATE public."Users"
              SET "Password"='${hash}'
              WHERE "Username" = '${req.body.username}'`,
                (err, results) => {
                  if (err) throw err;
                  return res.json({
                    data: "Thay đổi mật khẩu thành công",
                  });
                }
              );
            } else {
              return res.json({
                data: "Mật khẩu cũ không đúng",
              });
            }
          }
        );
      }
    );
  },
};

module.exports = authController;
