const Item = require('../../models/items.js');
const r = require('../../db.js').r;
const path = require('path');

module.exports = (server,module) => {
  let base = '/api/' + module;

  server.get(base + '/:id', (req, res) => {
    Item.get(req.params.id)
    .update({
      views: r.row("views").add(1).default(0),
    })
    .run()
    .then((data) => {
      res.sendFile(path.resolve(`${__dirname}/../../images/i.jpg`));      
    });
  });

};
