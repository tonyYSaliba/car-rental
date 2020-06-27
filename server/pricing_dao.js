'use strict';

const Pricing = require('./pricing');
const db = require('./db');

/**
 * Function to create a Pricing object from a row of the pricing table
 * @param {*} row a row of the pricing table
 */
const createPricing = function (row) {
    const id = row.id;
    const item = row.item;
    const price = row.price;
   
    return new Pricing(id, item, price);
}
/**
 * Get pricing
 */
exports.getPricing = function() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM pricing";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let pricing = rows.map((row) => createPricing(row));
                resolve(pricing);
            }
        });
    });
}
