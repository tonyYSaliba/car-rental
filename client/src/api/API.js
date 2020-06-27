import Rental from './Rental'
import Pricing from './Pricing'
const baseURL = "/api";

async function isAuthenticated(){
    let url = "/user";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if(response.ok){
        return userJson;
    } else {
        let err = {status: response.status, errObj:userJson};
        throw err;  // An object with the error coming from the server
    }
}

async function getCarsBrowse(filter) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/cars/browse", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filter),
        }).then( (response) => {
            if(response.ok) {
                response.json().then((res)=>{
                    resolve(res);
                });
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function getCarsAvailableCars(filter) {//added and done

    return new Promise((resolve, reject) => {
        fetch(baseURL + "/cars/availableCars", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filter),
        }).then( (response) => {
            if(response.ok) {
                response.json().then((res)=>{
                    resolve(res);
                });
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}
async function getRentalsFutureRentals() {
    let url = "/rentals/futureRentals";
    const response = await fetch(baseURL + url);
    const rentalsJson = await response.json();
    if(response.ok){
        return rentalsJson.map((r) => new Rental(r.id, r.user_id, r.car_id, r.age,r.starting_day, r.end_day, r.number_extra_drivers, r.number_kilometers, r.extra_insurance, r.price ));
    } else {
        let err = {status: response.status, errObj:rentalsJson};
        throw err;  // An object with the error coming from the server
    }
}
async function getRentalsPastRentals() {
    let url = "/rentals/pastRentals";
    const response = await fetch(baseURL + url);
    const rentalsJson = await response.json();
    if(response.ok){
        return rentalsJson.map((r) => new Rental(r.id, r.user_id, r.car_id, r.age,r.starting_day, r.end_day, r.number_extra_drivers, r.number_kilometers, r.extra_insurance, r.price ));
    } else {
        let err = {status: response.status, errObj:rentalsJson};
        throw err;  // An object with the error coming from the server
    }
}
async function getRentalsCurrentRentals() {
    let url = "/rentals/currentRentals";
    const response = await fetch(baseURL + url);
    const rentalsJson = await response.json();
    if(response.ok){
        return rentalsJson.map((r) => new Rental(r.id, r.user_id, r.car_id, r.age,r.starting_day, r.end_day, r.number_extra_drivers, r.number_kilometers, r.extra_insurance, r.price ));
    } else {
        let err = {status: response.status, errObj:rentalsJson};
        throw err;  // An object with the error coming from the server
    }
}

async function getPricing() {
    let url = "/cars/availableCars/pricing";

    const response = await fetch(baseURL + url);
    const PricingJson = await response.json();
    if(response.ok){
        return PricingJson.map((p) => new Pricing(p.id, p.item, p.price));
    } else {
        let err = {status: response.status, errObj:PricingJson};
        throw err;  // An object with the error coming from the server
    }
}
async function getBrands() {
    let url = "/cars/availablecars/brands";

    const response = await fetch(baseURL + url);
    const brandsJson = await response.json();
    if(response.ok){
        return brandsJson;
    } else {
        let err = {status: response.status, errObj:brandsJson};
        throw err;  // An object with the error coming from the server
    }
}

async function addRental(rental) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/rental", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rental),
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function performPayment(paymentInfo) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/payment", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentInfo),
        }).then( (response) => {
            if(response.ok) {
                resolve(true);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function deleteFutureRentals(rentalId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/rentals/futureRentals/" + rentalId, {
            method: 'DELETE'
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userLogin(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username, password: password}),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userLogout(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}

const API = { getBrands, isAuthenticated, getCarsBrowse, getCarsAvailableCars, getRentalsFutureRentals, getRentalsPastRentals, getRentalsCurrentRentals, getPricing, addRental, deleteFutureRentals, userLogin, userLogout, performPayment} ;
export default API;
