
module.exports = function () {
    var express = require('express');
    var router = express.Router();

    function getFoods(res, mysql, context, complete) {
        mysql.pool.query("SELECT food_type, inventory FROM foods", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.foods = results;
            complete();
        });
    }


    /*Display all foods in the inventory. Requires web based javascript to delete users with AJAX*/

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletefoods.js"];
        var mysql = req.app.get('mysql');
        getFoods(res, mysql, context, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('foods', context);
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


    return router;
}();