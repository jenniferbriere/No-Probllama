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

    /* get Animals to populate in dropdown */
    function getAnimals(res, mysql, context, complete){
        mysql.pool.query("SELECT animals.animal_id, CONCAT(animals.name,' - ',species.species_name) AS sponsee FROM animals JOIN species ON animals.species_id = species.species_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.animals = results;
            complete();
        });
    }    

    /* get top sponsorships with sponsor and animal info */
    
    function getTopSponsorships(res, mysql, context, complete){
        sql = "SELECT CONCAT(s.first_name,' ',s.last_name) AS sponsor_name, animals.name, species.species_name, sponsorships.amount FROM sponsors s INNER JOIN sponsorships ON s.sponsor_id = sponsorships.sponsor_id INNER JOIN animals ON  sponsorships.animal_id = animals.animal_id INNER JOIN species ON animals.species_id = species.species_id  ORDER BY sponsorships.amount, sponsor_name DESC LIMIT 15"
         mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.top_sponsorships = results
            complete();
        });
    }

    
    /* List people with top sponsorships along with 
     * displaying forms to add sponsors and sponsorships
        ** again, not sure if context.jsscripts is necessary,
            will not be deleting anything on this page,
            don't know what else would go there or how it
            would affect render if removed **
     */
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = [""];
        var mysql = req.app.get('mysql');
        var handlebars_file = 'sponsorships'

        getSponsors(res, mysql, context, complete);
        getAnimals(res, mysql, context, complete);
        getTopSponsorships(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render(handlebars_file, context);
            }
        }
    });

    /* Adds a new sponsorship, then reloads the page after adding */
    // TODO: how to make date auto-populate? 
    //       update front end to include date field for now
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