var router = require('express').Router();
var pg = require('pg');

var config = {
  database: 'rho'
};

var pool = new pg.Pool(config);

// routes to get and add todo items
router.route('/')
  .get(getToDos)
  .post(postToDos);

// routes to update and delete todo items
router.route('/:id')
  .put(updateToDos)
  .delete(deleteToDos);

// gets the current list of to dos from the database
function getToDos(req, res) {
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        res.sendStatus(500);
        return;
      }

      client.query('SELECT * FROM todo ORDER BY id;',
            function (err, result) {
              if (err) {
                console.log('Issue querying the DB', err);
                res.sendStatus(500);
                return;
              }

              res.send(result.rows);
            });
    } finally {
      done();
    }
  });
};

// posts a new todo to the database
function postToDos(req, res) {
  pool.connect(function (err, client, done) {
    console.log('req: ', req.body);
    try {
      if (err) {
        res.sendStatus(500);
        return;
      }

      client.query('INSERT INTO todo (item, complete) VALUES ($1, $2) RETURNING *;',
        [req.body.item, false],
        function (err, result) {
          if (err) {
            console.log('Issue querying the DB', err);
            res.sendStatus(500);
            return;
          }

          res.sendStatus(200);
        });
    } finally {
      done();
    }
  });
};

// deletes an item from the database
function deleteToDos(req, res) {
  var id = req.params.id;

  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error connecting to the DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('DELETE FROM todo WHERE id=$1;',
        [id],
        function (err, result) {
          if (err) {
            console.log('Error querying the database', err);
            res.SendStatus(500);
            return;
          }

          res.send(204);
        });
    } finally {
      done();
    }
  });
};

// updates an item in the database
function updateToDos(req, res) {
  var id = req.params.id;
  var complete = (req.body.complete);

  pool.connect(function (err, client, done) {
    try {
      if (err) {
        res.sendStatus(500);
        return;
      }

      client.query('UPDATE todo SET complete = $1 WHERE id = $2;',
        [complete, id],
        function (err, result) {
          if (err) {
            console.log('Issue querying the DB', err);
            res.sendStatus(500);
            return;
          }

          res.sendStatus(200);
        });
    } finally {
      done();
    }
  });
};

module.exports = router;
