
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
    
    // UPDATE FUNCTIONS
    
    function getFeeding(res, mysql, context, animal_id, food_id, complete) {
        var sql = "SELECT animals.animal_id, foods.food_id, animals.name, foods.food_type, animals_foods.amount, animals_foods.x_per_day FROM animals INNER JOIN animals_foods on animals.animal_id = animals_foods.animal_id INNER JOIN foods on foods.food_id = animals_foods.food_id WHERE animals_foods.animal_id=? AND animals_foods.food_id=?";
        var inserts = [animal_id, food_id];
        mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.food = results[0];
            complete();
        });
    }
    
    /* Display one feeding for the specific purpose of updating */

    router.get('/animal/:animal_id/food/:food_id', function (req, res) {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatefeeding.js"];
        var mysql = req.app.get('mysql');
        getFeeding(res, mysql, context, req.params.animal_id, req.params.food_id, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('update-feeding', context);
            }

        }
    });
    
    /* The URI that update data is sent to in order to update a feeding */

    router.put('/animal/:animal_id/food/:food_id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.animal_id)        
        console.log(req.params.food_id)
        var sql = "UPDATE animals_foods SET amount=?, x_per_day=? WHERE animal_id=? AND food_id=?";
        var inserts = [req.body.amount, req.body.x_per_day, req.params.animal_id, req.params.food_id];
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
