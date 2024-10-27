//show logout at the top id user is logged in , if not login/register

const express = require('express');
const router = express.Router();


const restaurants = [
    {
      "id": 1,
      "title": "Hungry Howies",
      "link": "/restaurants/hungry-howies",
      "image": "hungry_howies.png"
    },
    {
      "id": 2,
      "title": "Don's at Walb",
      "link": "/restaurants/dons-at-walb",
      "image": "dons_at_walb.png"
    },
    {
      "id": 3,
      "title": "Starbucks - Java Spot",
      "link": "/restaurants/starbucks-java-spot",
      "image": "starbucks_java_spot.png"
    },
    {
      "id": 4,
      "title": "Einstein Bros. Bagels",
      "link": "/restaurants/einstein-bros-bagels",
      "image": "einstein_bros_bagels.png"
    },
    {
      "id": 5,
      "title": "Don Taco's",
      "link": "/restaurants/don-tacos",
      "image": "don_tacos.png"
    },
    {
      "id": 6,
      "title": "Jimmy Johns",
      "link": "/restaurants/jimmy-johns",
      "image": "jimmy_johns.png"
    }
  ];

 // Define a route to get restaurant data
 router.get('/restaurants', (req, res) => {
    res.json({
        "restaurants": restaurants,
    });
  });
  

// router.get('/test', (req, res) => {
//     res.send('Backend working!');
//   });
  
  module.exports = router;
