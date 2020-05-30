module.exports = function () {
    var express = require('express');
    var router = express.Router();

    /* get Sponsors to populate in dropdown */
    function getSponsors(res, mysql, context, complete) {
        mysql.pool.query("SELECT sponsor_id, first_name, last_name FROM sponsors", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.sponsors = results;
            complete();
        });
    }
    /* Adds a new sponsor, then reloads the sponsorships page after adding */
    router.post('/', function (req, res) {
        console.log(req.body.sponsors)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sponsors (first_name, last_name, phone_number, email) VALUES (?,?,?,?)";
        var inserts = [req.body.first_name, req.body.last_name, req.body.phone_number, req.body.email];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/sponsorships');
            }
        });
    });

    return router;
}();
