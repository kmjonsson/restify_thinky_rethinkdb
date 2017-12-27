const Users = require('../models/users.js');
const Session = require('../models/sessions.js');

module.exports = (server,module) => {
  // Adds the session object to req object
  server.use((req, res, next) => {
    if(req.cookies['session'] !== undefined) {
      Session.run().filter((session) => {
        return session['id'] == req.cookies['session'];
      }).then((sessions) => {
        if(sessions.length) {
          req.session = sessions[0];
        } else {
          req.session = {"user":"guest"};
        }
        next();
      })
    } else {
      req.session = {"user":"guest"};
      next();
    }
  });

  // Login
  // Checks against the users table
  server.get('/auth/login', (req, res, next) => {
    Users.filter((user) => {
      return user['user'] == req.query.user && user['password'] == req.query.password
    }).run().then((users) => {
      if(users.length) {
        const newSession = new Session({ user: users[0].user });
        newSession.save().then((session) => {
          res.setCookie('session',session['id'],{path:'/'});
          res.send(session['id']);
          next();
        });
      } else {
        res.send("Failed :-(");
        next();
      }
    });
  });

  // Logout
  server.get('/auth/logout', (req, res, next) => {
    if(req.session !== undefined && req.session['id'] !== undefined) {
      Session.get(req.session['id']).run().delete();
    }
    res.clearCookie('session',{ path:'/'});
    res.send('OK');
    next();
  });
};
