'use strict';

const Rental = require('./rental');
const Car = require('./car');
const db = require('./db');
const moment = require('moment');
/**
 * Function to create a Rental object from a row of the rentals table
 * @param {*} row a row of the rentals table
 */
const createRental = function (row) {
    const id = row.id;
    const user_id = row.user_id;
    const car_id = row.car_id;
    const age = row.age;
    const starting_day = row.starting_day;
    const end_day = row.end_day;
    const number_extra_drivers = row.number_extra_drivers;
    const number_kilometers = row.number_kilometers;
    const extra_insurance = row.extra_insurance;
    const price = row.price;
   
    return new Rental(id, user_id, car_id, age, starting_day, end_day, number_extra_drivers, number_kilometers, extra_insurance, price);
}
const createCar = function (row) {
    const id = row.id;
    const category = row.category;
    const brand = row.brand;
    const model = row.model;
   
    return new Car(id, category, brand, model);
}
/**
 * Get available cars and optionally filter them
 */
exports.getAvailableCars = function(filter) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT c.id, c.category, c.brand, c.model FROM cars as c WHERE c.id not in (SELECT r2.car_id FROM rentals AS r2 WHERE not(r2.starting_day >? OR r2.end_day< ?)    ); ";
        db.all(sql, [filter.end_day, filter.starting_day], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let cars = rows.map((row) => createCar(row));
                if(filter){
                    cars = cars.filter((el)=>{
                                return el.category == filter.category;
                            });
                }
                resolve(cars);
            }
        });
    });
}


/**
 * Get future rentals
 */
exports.getFutureRentals = function(filter) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM rentals WHERE starting_day>? AND user_id = ?; ";
        db.all(sql, [moment().format("YYYY-MM-DD"), filter], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let rentals = rows.map((row) => createRental(row));
                resolve(rentals);
            }
        });
    });
}
/**
 * Get past rentals
 */
exports.getPastRentals = function(filter) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM rentals WHERE end_day<? AND user_id = ?; ";
        db.all(sql, [moment().format("YYYY-MM-DD"), filter], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let rentals = rows.map((row) => createRental(row));
                resolve(rentals);
            }
        });
    });
}
/**
 * Get current rentals
 */
exports.getCurrentRentals = function(filter) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM rentals WHERE starting_day<=? AND end_day>=? AND user_id = ?; ";       
        db.all(sql, [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"), JSON.stringify(filter)], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let rentals = rows.map((row) => createRental(row));
                resolve(rentals);
            }
        });
    });
}

/**
 * Delete a rental with a given id
 */
exports.deleteRental = function(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM rentals WHERE id = ?';
        db.run(sql, [id], (err) => {
            if(err)
                reject(err);
            else 
                resolve(null);
        })
    });
}

/**
 * Insert a rental in the database and returns the id of the inserted rental. 
 * To get the id, this.lastID is used. To use the "this", db.run uses "function (err)" instead of an arrow function.
 */
exports.createRental = function(rental, user_id) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO rentals(user_id, car_id, age, starting_day, end_day, number_extra_drivers, number_kilometers, extra_insurance, price) VALUES(?,?,?,?,?,?,?,?,?)';
        db.run(sql, [user_id, rental.car_id, rental.age, rental.starting_day, rental.end_day, rental.number_extra_drivers, rental.number_kilometers, rental.extra_insurance, rental.price], function (err) {
            if(err){
                reject(err);
            }
            else{
                resolve(this.lastID);
            }
        });
    });
}