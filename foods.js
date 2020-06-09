module.exports = function () {
    var express = require('express');
    var router = express.Router();

    function getFoods(res, mysql, context, complete) {
        mysql.pool.query("SELECT food_id, food_type, inventory FROM foods", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.foods = results;
            complete();
        });
    }

    function getFood(res, mysql, context, food_id, complete) {
        var sql = "SELECT food_id, food_type, inventory FROM foods WHERE food_id = ?";
        var inserts = [food_id];
        mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.food = results[0];
            complete();
        });
    }

    /*Display all foods in the inventory. */
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletefoods.js", "updatefood.js"];
        var mysql = req.app.get('mysql');
        getFoods(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('foods', context);
            }

        }
    });


    /* Display one food type for the specific purpose of updating the inventory */

    router.get('/:food_id', function (req, res) {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatefood.js"];
        var mysql = req.app.get('mysql');
        getFood(res, mysql, context, req.params.food_id, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('update-food', context);
            }

        }
    });

    /* Adds a food type, redirects to the foods page after adding */
    router.post('/', function (req, res) {
        // console.log(req.body.species_id)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO foods (food_type, inventory) VALUES (?,?)";
        var inserts = [req.body.food_type, req.body.inventory];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/foods');
            }
        });
    });

    /* The URI that update data is sent to in order to update a food */

    router.put('/:food_id', function (req, res) {
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.food_id)
        var sql = "UPDATE foods SET inventory=? WHERE food_id=?";
        var inserts = [req.body.inventory, req.params.food_id];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a food, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:food_id', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM foods WHERE food_id = ?";
        var inserts = [req.params.food_id];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(error)
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