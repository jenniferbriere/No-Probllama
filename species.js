module.exports = function () {
    var express = require('express');
    var router = express.Router();

    /* get Sponsors to populate in dropdown */
    function getSpecies(res, mysql, context, complete) {
        mysql.pool.query("SELECT species_id, species_name FROM species", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.species = results;
            complete();
        });
    }
    /* Adds a new species, then reloads the animals page after adding */
    router.post('/', function (req, res) {
        console.log(req.body.species)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO species (species_name) VALUES (?)";
        var inserts = [req.body.species_name];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/animals');
            }
        });
    });

    return router;
}();
