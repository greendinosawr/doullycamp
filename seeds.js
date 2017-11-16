var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

//TODO: update data with prices
var data =[
    {
        name: "Tundra Tuna Tent",
        image:"https://farm1.staticflickr.com/112/316612921_f23683ca9d.jpg",
        description: "A lot of effort was put into thinking up this wintery name. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "The Turd",
        image:"https://farm7.staticflickr.com/6186/6090714876_44d269ed7e.jpg",
        description: "I used to have a sleeping bag called the turd. I miss it. Cat ipsum dolor sit amet, chase dog then run away and swat turds around the house. Mice munch on tasty moths. Sleep nap hiss at vacuum cleaner. Ask for petting woops poop hanging from butt must get rid run run around house drag poop on floor maybe it comes off woops left brown marks on floor human slave clean lick butt now yet then cats take over the world meow meow and chew foot, for fooled again thinking the dog likes me and need to chase tail. Under the bed meow or leave fur on owners clothes spread kitty litter all over house for eat a plant, kill a hand, and dont wait for the storm to pass, dance in the rain. Poop in the plant pot wack the mini furry mouse lies down ."
    },
    {
        name: "Strawberry Fields for Five Minutes",
        image:"https://farm2.staticflickr.com/1173/1132900522_aa2d6a12ca.jpg",
        description: "Wish it could be for a little longer, but go figure. Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring."
    }
];

function seedDB() {
    Campground.remove({}, function(error) {
       if (error) {
           console.log(error);
       } else {
           console.log("Removed all current campgrounds.");
        //   Campground creation was put inside callback function of remove 
        //   make sure creation happens AFTER removal is finished;
        //   in JS, computer won't necessarily wait for process to finish otherwise
           data.forEach(function(seed) {
                Campground.create(seed, function(error, campground){
                    if (error) console.log("error");
                    else {
                        Comment.create(
                            {
                                text: "lol, this place sucks.",
                                author: "Eboy456"
                            },
                            function(error, comment) {
                                if (error) console.log(error);
                                else {
                                    campground.comments.push(comment);
                                    campground.save();
                                }
                            }
                        );
                    }
                });
            });
            console.log("Default data seeded.");
        }
    });
}

module.exports = seedDB;

