
module.exports = function () {
    var express = require('express');
    var router = express.Router();

    /* get animals to populate in dropdown */
    function getAnimals(res, mysql, context, complete) {
        mysql.pool.query("SELECT animals.animal_id, animals.name, species.species_name FROM animals JOIN species ON animals.species_id = species.species_id", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.animals = results;
            complete();
        });
    }

    /* get foods to populate in dropdown */
    function getFoods(res, mysql, context, complete) {
        mysql.pool.query("SELECT food_id, food_type FROM foods", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.foods = results;
            complete();
        });
    }

    /* get animals with their foods */
    /* TODO: get multiple foods in a single column and group on
     * name or id column
     */
    function getAnimalsWithFoods(res, mysql, context, complete) {
        sql =
            'SELECT animals.animal_id, foods.food_id, animals.name, foods.food_type, animals_foods.amount, animals_foods.x_per_day FROM animals INNER JOIN animals_foods on animals.animal_id = animals_foods.animal_id INNER JOIN foods on foods.food_id = animals_foods.food_id ORDER BY name ASC';
        mysql.pool.query(sql, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.feedings = results;
            complete();
        });
    }

    /* List animals with foods along with 
     * displaying a form to associate an animal with multiple foods
     */
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ['deletefoods.js'];
        var mysql = req.app.get('mysql');
        var handlebars_file = 'feedings';

        getAnimals(res, mysql, context, complete);
        getFoods(res, mysql, context, complete);
        getAnimalsWithFoods(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 3) {
                res.render(handlebars_file, context);
            }
        }
    });

    /* Associate food or foods with an animal and 
    * then redirect to the foods page after adding 
    */
    router.post('/', function (req, res) {
        //console.log("We get the multi-select foods dropdown as ", req.body.foods)
        var mysql = req.app.get('mysql');
        // let's get out the foods from the array that was submitted by the form 
        //var foods = req.body.foods
        //var animal = req.body.animal_id
        //for (let food of foods) {
        //console.log("Processing food id " + food)
        var sql = "INSERT INTO animals_foods (animal_id, food_id, amount, x_per_day) VALUES (?,?,?,?)";
        var inserts = [req.body.animal_id, req.body.food_id, req.body.amount, req.body.x_per_day];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                //TODO: send error messages to frontend as the following doesn't work
                /* 
                res.write(JSON.stringify(error));
                res.end();
                */
                console.log(error)
            }
        });
        //} //for loop ends here 
        res.redirect('/feedings');
    });

    /* Adds a new feeding, then reloads the page after adding */

    //router.post('/', function (req, res) {
    //   console.log(req.body.animals);
    //   console.log(req.body.foods);
    //   console.log(req.body);
    //   var mysql = req.app.get('mysql');
    //   var sql = 'INSERT INTO animals_foods (animal_id, food_id, amount, x_per_day) VALUES (?,?,?,?)';
    //   var inserts = [req.body.animal_id, req.body.food_id, req.body.amount, req.body.x_per_day];
    //   sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
    //       if (error) {
    //           console.log(JSON.stringify(error));
    //           res.write(JSON.stringify(error));
    //           res.end();
    //       } else {
    //           res.redirect('/feedings');
    //       }
    //   });
    //    });


    /* Delete an animal's feeding record */
    /* This route will accept a HTTP DELETE request in the form
     * /animal/{{animal_id}}/food/{{food_id}} -- which is sent by the AJAX form 
     */
    router.delete('/animal/:animal_id/food/:food_id', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM animals_foods WHERE animal_id = ? AND food_id = ?";
        var inserts = [req.params.animal_id, req.params.food_id];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            } else {
                res.status(202).end();
            }
        })
    })

    return router;
}();
