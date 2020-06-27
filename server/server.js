'use strict'

const express = require('express');

const PORT = 3001;

const app = new express();

// Process body content
app.use(express.json());

const carDao = require('./car_dao');
const userDao = require('./user_dao');
const pricingDao = require('./pricing_dao');
const rentalDao = require('./rental_dao');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 300; //seconds
// Authorization error
const authErrorObj = { errors: [{  'param': 'Server', 'msg': 'Authorization error' }] };


// Authentication endpoint
app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    userDao.getUser(username)
      .then((user) => {

        if(user === undefined) {
            res.status(404).send({
                errors: [{ 'param': 'Server', 'msg': 'Invalid e-mail' }] 
              });
        } else {
            if(!userDao.checkPassword(user, password)){
                res.status(401).send({
                    errors: [{ 'param': 'Server', 'msg': 'Wrong password' }] 
                  });
            } else {
                //AUTHENTICATION SUCCESS
                const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, {expiresIn: expireTime});
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
                res.json({id: user.id, name: user.name});
            }
        } 
      }).catch(

        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
            new Promise((resolve) => {setTimeout(resolve, 1000)}).then(() => res.status(401).json(authErrorObj))
        }
      );
  });

app.use(cookieParser());

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});


//POST /cars/browse      browse all cars(unauthenticated user)
app.post('/api/cars/browse', (req, res) => {
    const filter = req.body;
    carDao.getCars(filter)
        .then((cars) => {
            res.json(cars);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'msg': err}],
             });
       });
});

//GET /cars/availableCars/pricing
app.get('/api/cars/availableCars/pricing', (req, res) => {
    pricingDao.getPricing()
        .then((pricing) => {
            res.json(pricing);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'msg': err}],
             });
       });
});


//GET /cars/availablecars/brands
app.get('/api/cars/availablecars/brands', (req, res) =>{
    carDao.getBrands()
    .then((brands) => {
        res.json(brands);
    })
    .catch((err) => {
        res.status(500).json({
            errors: [{'msg': err}],
         });
   });
});



// For the rest of the code, all APIs require authentication
app.use(
    jwt({
      secret: jwtSecret,
      getToken: req => req.cookies.token
    })
  );
  
// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json(authErrorObj);
    }
  });

// AUTHENTICATED REST API endpoints

//GET /user
app.get('/api/user', (req,res) => {
    const user = req.user && req.user.user;
    userDao.getUserById(user)
        .then((user) => {
            res.json({id: user.id, name: user.name});
        }).catch(
        (err) => {
         res.status(401).json(authErrorObj);
        }
      );
});


//POST /cars/availableCars
app.post('/api/cars/availableCars', (req,res) => {
    const filter = req.body;
    if(!filter){
        res.status(400).end();
    } else {
        rentalDao.getAvailableCars(filter)
            .then((cars) => {
                res.json(cars);
            })
            .catch((err) => {
                res.status(500).json({errors: [{'param': 'Server', 'msg': err}]})
            });
    }
});

//GET /rentals/futureRentals
app.get('/api/rentals/futureRentals', (req, res) => {
    const user = req.user && req.user.user;
    rentalDao.getFutureRentals(user)
        .then((rentals) => {
            res.json(rentals);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'msg': err}],
             });
       });
});

//GET /rentals/pastRentals
app.get('/api/rentals/pastRentals', (req, res) => {
    const user = req.user && req.user.user;
    rentalDao.getPastRentals(user)
        .then((rentals) => {
            res.json(rentals);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'msg': err}],
             });
       });
});
//GET /rentals/currentRentals
app.get('/api/rentals/currentRentals', (req, res) => {
    const user = req.user && req.user.user;
    rentalDao.getCurrentRentals(user)
        .then((rentals) => {
            res.json(rentals);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'msg': err}],
             });
       });
});

//POST /rental      add rental
app.post('/api/rental', (req,res) => {
    const rental = req.body;
    if(!rental){
        res.status(400).end();
    } else {
        const user = req.user && req.user.user;
        rentalDao.createRental(rental, user)
            .then((id) => res.status(201).json({"id" : id}))
            .catch((err) => res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            }));
    }
});


//DELETE rentals/futureRentals/<rentalId>
app.delete('/api/rentals/futureRentals/:rentalId', (req,res) => {//done
    rentalDao.deleteRental(req.params.rentalId)
        .then((result) => res.status(204).end())
        .catch((err) => res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        }));
});

//POST /payment
app.post('/api/payment', (req,res) => {
    const paymentInfo = req.body;
    if(!paymentInfo){
        res.status(400).end();
    } else {
        if(!paymentInfo.cardNumber || !paymentInfo.cardCode || !paymentInfo.price ){
            res.status(404).send({
                errors: [{ 'param': 'Server', 'msg': 'Invalid' }] 
              });
        }
        res.status(204).end();
    }
});


//activate server
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

