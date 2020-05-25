module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* get Sponsors to populate in dropdown */
    function getSponsors(res, mysql, context, complete){
        mysql.pool.query("SELECT sponsor_id, first_name, last_name FROM sponsors", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.sponsors = results;
            complete();
        });
    }
    /* Adds a new sponsor, then reloads the page after adding */
    router.post('/', function(req, res){
        console.log(req.body.sponsors)
        console.log(req.body.animals)        
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sponsorships (sponsor_id, date_of_sponsorship, animal_id, amount) VALUES (?,?,?,?)";
        var inserts = [req.body.sid, req.body.date_of_sponsorship, req.body.aid, req.body.amount];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/sponsorships');
            }
        });
    });    

    return router;
}();
