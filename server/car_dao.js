'use strict';

const Car = require('./car');
const db = require('./db');

/**
 * Function to create a Car object from a row of the cars table
 * @param {*} row a row of the cars table
 */
const createCar = function (row) {
    const id = row.id;
    const category = row.category;
    const brand = row.brand;
    const model = row.model;
   
    return new Car(id, category, brand, model);
}
/**
 * Get cars and optionally filter them
 */
exports.getCars = function(filter) {
    
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM cars";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let cars = rows.map((row) => createCar(row));
                if(filter){
                    if( filter.idz.length>0) {
                        cars = cars.filter((el)=>{
                            return filter.idz.includes(el.id);
                        });
                    }
                    if(filter.categories.length>0) {
                        cars = cars.filter((el)=>{
                            return filter.categories.includes(el.category);
                        });
                    }
                    if(filter.brands.length>0) {
                        cars = cars.filter((el)=>{
                            return filter.brands.includes(el.brand);
                        });
                    }
                }
                resolve(cars);
            }
        });
    });
}
exports.getBrands = function(){
    return new Promise((resolve, reject) => {
        const sql = "SELECT brand FROM cars GROUP BY brand";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else{
                resolve(rows);
            }
        });
    });
}
