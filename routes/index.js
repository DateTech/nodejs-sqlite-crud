var express = require('express');
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var router = express.Router();

let db;
const dbPath = path.resolve(__dirname, 'db/details.db');

// function to open database connection
function openDB(path){
  db = new sqlite3.Database(path, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
}

// function to close database connection
function closeDB(){
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}

// function to insert new data into database
function insertDB(name, no, height, position, point){
  var sql = "INSERT INTO record (name,no,height,position,point) VALUES(?,?,?,?,?)";
  db.run(sql, [name,no,height,position,point], function(err, res){
    if(err){
      throw err;
    }
  });
}

// funtion to view all record
function viewAll(){
  var sql = 'SELECT * FROM record';
  db.each(sql, function(err, row){
    if (err) {
      throw err;
    }
    console.log(row);
  });
}

// function to view a single record
function viewSingle(id){
  var response;
  var sql = "SELECT * FROM record WHERE id='"+id+"'";
  db.each(sql, function(err, row){
    if (err) {
      throw err;
    }
    response = row;
    console.log(response);
  });
}

// function to update a record in database
function updateDB(id, name, no, height, position, point){
  var sql = "UPDATE record SET name=?,no=?,height=?,position=?,point=? WHERE id=?";

  db.run(sql, [name,no,height,position,point,id], function(err){
    if(err){
      throw err;
    }
    console.log("Record Updated");
  });
} 

// function to delete a record from database
function rmDB(id){
  sql = 'DELETE FROM record WHERE id=?';

  db.run(sql, id, function(err){
    if(err){
      throw err;
    }

    console.log("Deleted");
  });
}

// function to list the tables in database
function listTable(){
  db.serialize(function () {
    db.each("SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%'", function (err, table) {
      if(err){
        throw err;
      }
      console.log(table);
    });
  });
}

openDB(dbPath);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Test' });
});

router.post('/add', function(req, res, next){
  var values = req.body;
  insertDB(values.name, values.no, values.height, values.position, values.point);
  res.redirect('/');
});

module.exports = router;