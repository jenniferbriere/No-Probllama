  
module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getSpecies(res, mysql, context, complete){
        mysql.pool.query("SELECT species_id as id, species_name FROM species", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.species  = results;
            complete();
        });
    }

    function getAnimals(res, mysql, context, complete){
        mysql.pool.query("SELECT animals.animal_id, animals.name, species.species_name, animals.birthdate, animals.active FROM animals INNER JOIN species ON animals.species_id = species.species_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.animals = results;
            complete();
        });
    }

    function getAnimalsbySpecies(req, res, mysql, context, complete){
      var query = "SELECT animals.animal_id, animals.name, species.species_name AS species, birthdate, active FROM animals INNER JOIN species ON animals.species_id = species.species_id WHERE animals.species_id = ?";
      console.log(req.params)
      var inserts = [req.params.species]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.animals = results;
            complete();
        });
    }

    /* Find animals whose names start with a given string in the req */
    function getAnimalsWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT animals.animal_id, animals.name, species.species_name, birthdate, active FROM animals INNER JOIN species ON animals.species_id = species.species_id WHERE animals.name LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.animals = results;
            complete();
        });
    }

    function getAnimal(res, mysql, context, id, complete){
        var sql = "SELECT animals.animal_id, name, species.species_name, birthdate, active FROM animals WHERE animal_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.animal = results[0];
            complete();
        });
    }

    /*Display all animals. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteanimal.js","filteranimals.js","searchanimals.js"];
        var mysql = req.app.get('mysql');
        getAnimals(res, mysql, context, complete);
        getSpecies(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('animals', context);
            }

        }
    });

    /*Display all animals of a given species. Requires web based javascript to delete users with AJAX*/

    router.get('/filter/:species', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteanimal.js","filteranimals.js","searchanimals.js"];
        var mysql = req.app.get('mysql');
        getAnimalsbySpecies(req,res, mysql, context, complete);
        getSpecies(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('animals', context);
            }

        }
    });

    /*Display all animals whose name starts with a given string. Requires web based javascript to delete users with AJAX */

    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteanimal.js","filteranimals.js","searchanimals.js"];
        var mysql = req.app.get('mysql');
        getAnimalsWithNameLike(req, res, mysql, context, complete);
        getSpecies(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('animals', context);
            }
        }
    });


    /* Adds an animal, redirects to the animals page after adding */

    router.post('/', function(req, res){
        console.log(req.body.species_id)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO animals (name, species_id, birthdate) VALUES (?,?,?)";
        var inserts = [req.body.name, req.body.id, req.body.birthdate];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/animals');
            }
        });
    });

    /* Adds a species, redirects to the animals page after adding */
    // need to figure out how to do a second post for same '/' on same page
/*     router.post('/', function(req, res){
        console.log(req.body.species_name)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO species (species_name) VALUES (?)";
        var inserts = [req.body.species_name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{s
                res.redirect('/animals');
            }
        });
    }); */

  // UPDATE FUNCTIONS BELOW
  /* Display one animal for the specific purpose of updating animals */
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateanimal.js"];
        var mysql = req.app.get('mysql');
        getAnimal(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-animal', context);
            }
        }
    });
  
  /* The URI that update data is sent to in order to update an animal */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE animals SET active=? WHERE animal_id=?";
        var inserts = [req.body.active, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    return router;
}();
