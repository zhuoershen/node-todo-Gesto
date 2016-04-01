var Food = require('./models/food');
var History = require('./models/history');

function getFoods(res) {
    Food.find(function (err, foods) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(foods); // return all foods in JSON format
    });
};

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all foods
    app.get('/api/foods', function (req, res) {
        // use mongoose to get all foods in the database
        getFoods(res);
    });
    
    // get total prices of the foods
    app.get('/api/total', function (req,res){
            Food.aggregate(
                {$group: {
                    "_id": null,
                    "sum": {$sum: "$number"}
                }}
                , function (err, results) {
                    if (err) {
                        console.error(err);
                    } else {
                        var sum = results[0].sum;
                        res.send(String(sum));
                    }
                }
            );
    });
    
    // create food and send back all foods after creation
    app.post('/api/foods', function (req, res) {
        // create a food, information comes from AJAX request from Angular
        Food.create({
            text: req.body.text,
            number: req.body.value,
            done: false
        }, function (err, food) {
            if (err)
                res.send(err);
            // get and return all the foods after you create another
            getFoods(res);
        });
    });

    // delete a food and add the deleted food to History
    app.delete('/api/foods/:food_id', function (req, res) {
        Food.find({
            _id: req.params.food_id //find the food with food_id   
            }, function(err,results){
                if (err)
                    res.send(err);
                var date = new Date();
                var date1 = date.setHours(0,0,0,0);
                
            History.create({//insert the food into history
                    text: results[0].text,
                    number: results[0].number,
                    created: date1,
                    done: false
                }, function (err, food) {
                    if (err)
                        res.send(err);
                    Food.remove({//delete the food
                        _id: req.params.food_id
                    }, function(err, food){
                        if (err)
                            res.send(err);
                        getFoods(res);
                })
                    
            })
        })
    });
        
    //get all the historyes and order them by created time
    app.get('/api/history', function(req,res){
        History.aggregate(
            {$group: {
                "_id": "$created",
                "food": {$push: "$text"},
                "sum": {$sum: "$number"}
            }}).sort('_id').exec(function(err,results){
                if (err)
                    res.send(err);
                res.json(results);
            });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};