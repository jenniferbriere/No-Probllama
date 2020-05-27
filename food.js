module.exports = function () {
    var express = require('express');
    var router = express.Router();

    /* -- gets all the foods currently in the db -- */
    function getFoods(res, mysql, context, complete) {
        mysql.pool.query('SELECT food_type, inventory FROM foods', function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.foods = results;
            complete();
        });
    }

    /*Displays all Foods in current inventory. -- not sure aobut context.jsscripts */

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = [''];
        var mysql = req.app.get('mysql');
        var handlebars_file = 'food';

        getFoods(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('foods', context);
            }
        }
    });

    /* Adds a new food type, reloads food inventory page after adding -- pretty sure this one is correct */

    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = 'INSERT INTO foods (food_type, inventory) VALUES (?,?)';
        var inserts = [req.body.food_type, req.body.inventory];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/food');
            }
        });
    });

    /* The URI that update data is sent to in order to update a food quantity */
    /* UPDATE is next week
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE foods SET inventory=? WHERE food_id=?";
        var inserts = [req.body.inventory, req.params.id];
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
    }); */

    /* Route to delete a food type, simply returns a 202 upon success. Ajax will handle this. */

    /*     UPDATE is next week
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM foods WHERE food_id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    }) */

    return router;
}();
