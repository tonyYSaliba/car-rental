import React from 'react';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom' ;
import Button from'react-bootstrap/Button';
import Rental from '../api/Rental';

const Item=(props)=> {
let {pricings,rentalFilters, getDiscount, mode, car, myRental, deleteRental, activeFilter, totalCars } = props;

   const calculatePrice = (availableCars, totalCars) =>{
    let price = 0;
    let sale = 0;
    if(pricings.length){
    if(rentalFilters.category =="A"){
      price = price +parseFloat (pricings[0].price);
    }
    else if (rentalFilters.category =="B"){
      price = price +parseFloat (pricings[1].price);
    }
    else if (rentalFilters.category =="C"){
      price = price +parseFloat (pricings[2].price);
    }
    else if (rentalFilters.category =="D"){
      price = price +parseFloat (pricings[3].price);
    }
    else if (rentalFilters.category =="E"){
      price = price +parseFloat (pricings[4].price);
    }

    if(parseFloat(rentalFilters.number_kilometers)<50){
      sale = sale +parseFloat(pricings[5].price)/100;
    }
    else if(parseInt(rentalFilters.number_kilometers)<150){
      sale = sale +parseFloat(pricings[6].price)/100;
    }
    else{
      sale = sale +parseFloat(pricings[7].price)/100;
    }

    if(parseFloat(rentalFilters.age)<25){
      sale = sale +parseFloat(pricings[8].price)/100;
    }
    else if(parseInt(rentalFilters.age)>65){
      sale = sale +parseFloat(pricings[9].price)/100;
    }
    if(parseInt(rentalFilters.number_extra_drivers)){
      sale = sale +parseFloat(pricings[10].price)/100;
    }
    if(rentalFilters.extra_insurance){
      sale = sale +parseFloat(pricings[11].price)/100;
    }

    if((availableCars/totalCars)*100 <=50){
      sale = sale +parseFloat(pricings[12].price)/100;
    }

    if(getDiscount){
      sale = sale +parseFloat(pricings[13].price)/100;
    }


}
    return (price + price*sale).toFixed(2);
  }

  return (
    <>
    {mode=="browseCars"&& 
    <ListGroup.Item id = {car.id}>
      <div className="d-flex w-100 justify-content-between">
          <div className="custom-control custom-checkbox">
            <label className="custom-control-label"  htmlFor={"check-c" +  car.id} >{car.brand}</label>
           
            <span className="badge badge-secondary ml-4">{car.model}</span>
            <span className="badge badge-success ml-4">{car.category}</span>
            
            
            
          </div>

        </div>
    </ListGroup.Item>
}

{mode=="rentals" &&
    <ListGroup.Item id = {myRental.id}>
      <div className="d-flex w-100 justify-content-between">
          <div className="custom-control custom-checkbox">
            
            <label className="custom-control-label"  htmlFor={"check-r" +  myRental.id} >#{myRental.id}</label>
            <span className=" ml-4">Car#: {myRental.car_id}</span>
            <span className=" ml-4">From: {myRental.starting_day}</span>
            <span className=" ml-4">To: {myRental.end_day}</span>
            <span className=" ml-4">Age: {myRental.age}</span>
            <span className=" ml-4">Extra drivers: {myRental.number_extra_drivers}</span>
            <span className=" ml-4">Kilometers: {myRental.number_kilometers}</span>
            <span className=" ml-4">Extra insurance: {myRental.extra_insurance? "Yes" : "No"}</span>
            <span className=" ml-4">Price: {(myRental.price).toFixed(2)}</span>
          </div>

          {activeFilter === "future" && <div>
            <Image width="20" height="20" className="img-button" src="/svg/delete.svg" alt ="" onClick={() => {deleteRental(myRental.id)}}/>
          </div>}
        </div>
    </ListGroup.Item>
}

{
  mode == "configurator" && 
  <ListGroup.Item>
      <div className="mx-auto">
          <div className="custom-control mx-auto custom-checkbox">
            <label className="custom-control-label"  >Number of available cars: {car.length } </label>
            <p/>
            <label className="custom-control-label"  >Number of total cars (same category): {(car.length)>0 ? totalCars[rentalFilters.category] :"" } </label>
            <p/>
            
            <label className="custom-control-label">Price: {(car.length)>0 ? (calculatePrice((car.length), totalCars[rentalFilters.category])) : ""}  </label>
            
            <p/>

            <Link to ={"/add/"+(calculatePrice((car.length), totalCars[rentalFilters.category]))}>         <Button variant="primary" type="submit" disabled = {!car.length}>Rent</Button></Link>
            <p/>

            
            <p/>
            <hr></hr>

            
           
          </div>

        </div>
    </ListGroup.Item>
}
    </>
  );
}
export default Item;
