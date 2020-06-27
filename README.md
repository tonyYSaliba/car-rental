# Exam #1: "Car Rental"
## Student: s275112 SALIBA TONI 

## React client application routes

- Route `/login`: Contains fields to enter logIn information, in order to login into a certain account
- Route `/browse`: Page that allows users to browse a list containing the full set of vehicles, and the list may be filtered by category and/or brand
- Route `/configurator`: Page to make a new rental. Contains fields in order to enter parameters for rentals
- Route `/rentals`: Contains a list of all rentals for a certain user. rentals are filtered by "current rentals", "future rentals" and "past rentals"
- Route `/rentals/:filter`: Same as `/rentals`, and the parameters could be "past" (to get past rentals), "future" (to get future rentals) and null (to get current rentals by default)
- Route `/add/:price`: Page showing price of the rental and fields to fill credit card information in order to make the payment for the rental. parameter "price", is an int, and it's the price of the rental.
- Route `/init`: It's not a page, it's just used to wait for a certain state update, and then redirect to `/browse` after the update. It is used on startup, it initializes the web application.

## REST API server

- POST `/api/login`
  - username, password
  - cookie, user.id, user.name
- POST `/api/cars/browse`
  - {idZ, categories, brands}
  - Array of cars
- POST `/api/cars/availableCars`
  - rental parameters
  - Array of cars
- POST `/api/rental`
  - rental parameters
  - rental id
- POST `/api/payment`
  - cardNumber, cardCode
  - status(204)
- GET `/api/cars/availableCars/pricing`
  - none
  - pricing array
- GET `/api/cars/availableCars/brands`
  - none
  - array of all brands in the cars database
- GET `/api/user`
  - user
  - user.id, user.name
- GET `/api/rentals/futureRentals`
  - user
  - array of rentals
- GET `/api/rentals/pastRentals`
  - user
  - array of rentals
- GET `/api/rentals/currentRentals`
  - user
  - array of rentals
- DELETE `/api/rentals/futureRentals/:rentalId`
  - rental id
  - status(204)


## Server database

- Table `users` - contains id name email hash
- Table `cars` - contains id category brand model
- Table `pricing` - contains id item price
- Table `rentals` - contains id user_id car_id age starting_day end_day number_extra_drivers number_kilometers extra_insurance price

## Main React Components

- `Header` (in `Header.js`): Header of the page
- `Item` (in `Item.js`): Item specifications. Item  could be a rental contract or a car
- `LoginForm` (in `LoginForm.js`): LogIn component
- `List` (in `List.js`): It is a container for the elements
- `RentalForm` (in `RentalForm.js`): Used for filling the credit card information
- `Filters` (in `Filters.js`): contains different kind of parameters. Filters could be rental parameters, browse parameters or configurator parameters

## Screenshot

![Configurator Screenshot](./img/screenshot.jpg)

## Test users

* tony.saliba@polito.it, tony
* yara.saliba@polito.it, yara
* john.doe@polito.it, password (frequent customer)
* silar.saliba@polito.it, silar
* david.moukasher@polito.it, david (frequent customer)
