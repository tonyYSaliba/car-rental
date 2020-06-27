import React,{ useEffect } from 'react';
import Item from './Item';
import ListGroup from 'react-bootstrap/ListGroup';
import {Redirect} from 'react-router-dom';
import {AuthContext} from '../auth/AuthContext'

const List = (props) => {

  let {cars, mode, myRentals, deleteRental, getAllPricings, pricings, rentalFilters, getDiscount, activeFilter, totalCars} = props;

  //same as componentDidMount()
  useEffect(() => {
  }
    );


  return(
    <AuthContext.Consumer>
      {(context) => (
        <>
        {context.authErr && <Redirect to = "/login"></Redirect>}
        
        {mode == "browseCars" && 
        <ListGroup as="ul" variant="flush">
          {cars.map((car) => <Item mode = {mode} key = {car.id} car = {car} />) }
        </ListGroup>}

        {
          mode == "configurator" && 
          <ListGroup as="ul" variant="flush">
            {<Item mode = {mode} totalCars={totalCars} car = {cars} getAllPricings = {getAllPricings} pricings={pricings} rentalFilters={rentalFilters} getDiscount={getDiscount}/> }
          </ListGroup>
        }

        {
          mode == "rentals" &&
          <ListGroup as="ul" variant="flush">

            
            {myRentals.map((myRental) =>
            <Item mode = {mode}  key = {myRental.id} myRental = {myRental} activeFilter = {activeFilter} deleteRental = {deleteRental}/>)
             }
          </ListGroup>
        }


        </>
      )}
    </AuthContext.Consumer>
  );
}

export default List;
