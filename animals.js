  
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
        mysql.pool.query("SELECT animals.animal_id as id, name, species.species_name, birthdate, active FROM animals INNER JOIN species ON animals.species_id = species.species_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.animals = results;
            complete();
        });
    }

    function getAnimalsbySpecies(req, res, mysql, context, complete){
      var query = "SELECT animals.animal_id as id, name, species.species_name, birthdate, active FROM animals INNER JOIN species ON animal.species_id = species.species_id WHERE animal.species_id = ?";
      console.log(req.params)
      var inserts = [req.params.species_id]
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
       var query = "SELECT animals.animal_id as id, name, species.species_name, birthdate, active FROM animals INNER JOIN species ON animal.species_id = species.species_id WHERE animal.name LIKE " + mysql.pool.escape(req.params.s + '%');
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
        var sql = "SELECT animals.animal_id as id, name, species.species_name, birthdate, active FROM animals WHERE animal_id = ?";
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
        var sql = "INSERT INTO animals (name, species_id, birthdate, active) VALUES (?,?,?,?)";
        var inserts = [req.body.name, req.body.species_id, req.body.birthdate, req.body.active];
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

    router.post('/', function(req, res){
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
    });


    return router;
}();