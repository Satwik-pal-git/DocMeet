const User = require("../models/User");
const axios = require("axios");
const fetch = require("node-fetch");

exports.getCalories = async (req, res) => {
    const foundUser = req.user;
    res.render("calorie", { meals: foundUser.meals, sum: sum });
}

var Food = [];
var Calories = [];
var food, times;
var sum = Number(0);

exports.setCalories = async (req, res) => {
    food = req.body.Item;
    times = Number(req.body.times);
    // console.log(food, times);
    const URL = `https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}&ingr=${food}`;
    var qty;
    fetch(URL)
        .then(response => response.json())
        .then(jsonData => {
            qty = jsonData.parsed[0].food.nutrients.ENERC_KCAL;
            const Founduser = req.user;
            const user = User.findById(Founduser.id);
            if (user) {
                console.log(user);
                console.log(calories);

                var d = {
                    food,
                    calories,
                    times,
                };
                sum = sum + calories;
                // user.meals.push(d);
                // await user.save();
                res.status(200).redirect("/calorie_tracker");
            }
        }).catch(err => {
            res.status(404).send("User not found");
        });

}