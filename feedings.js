
module.exports = function () {
    var express = require('express');
    var router = express.Router();

    /* get people to populate in dropdown */
    function getAnimals(res, mysql, context, complete) {
        mysql.pool.query('SELECT animal_id, name FROM animals', function (error, results, fields) {
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
        sql = 'SELECT food_id, food_type FROM foods';
        mysql.pool.query(sql, function (error, results, fields) {
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
            'SELECT animals.animal_id, foods.food_id, animals.name, foods.food_type FROM animals INNER JOIN animals_foods on animals.animal_id = animals_foods.animal_id INNER JOIN foods on foods.food_id = animals_foods.food_id ORDER BY name ASC';
        mysql.pool.query(sql, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.animals_foods = results;
            complete();
        });
    }

    /* List animals with foods along with 
     * displaying a form to associate an animal with multiple foods
     */
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ['deleteanimal.js'];
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

    /* Adds a new feeding, then reloads the page after adding */

    router.post('/', function (req, res) {
        console.log(req.body.animals);
        console.log(req.body.foods);
        console.log(req.body);
        var mysql = req.app.get('mysql');
        var sql = 'INSERT INTO animals_foods (animal_id, food_id, amount, x_per_day) VALUES (?,?,?,?)';
        var inserts = [req.body.animal_id, req.body.food_id, req.body.amount, req.body.x_per_day];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/feedings');
            }
        });
    });

    return router;
}();
