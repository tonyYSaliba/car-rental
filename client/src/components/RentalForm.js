import React from 'react';
import Button from'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import {AuthContext} from '../auth/AuthContext'

class RentalForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {cardNumber:"", cardCode:""};
    this.state.submitted = false;
  }

  updateField = (name, value) => {
    this.setState({[name]: value});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
    } else {
      let rental = Object.assign({}, this.props.rentalFilters);
      rental.price = this.props.price;
      rental.car_id = this.props.cars[0].id     
      this.props.performPayment({cardNumber:this.state.cardNumber, cardCode:this.state.cardCode, price:this.props.price}, rental);
      this.setState({submitted : true});
    }
  }

  render() {
    if (this.state.submitted){
      this.props.filterRentalHistory("current");
      return <Redirect to='/browse' />;}
    
    return(
      <AuthContext.Consumer>
      {(context) => (
        <>
          
          <h1>Online Payment</h1>

          <Form method="POST" onSubmit={(event) => this.handleSubmit(event)}>
              <Form.Group controlId="cardNumber">
                <Form.Label>Card Number</Form.Label>
                <Form.Control type="text" name="cardNumber" placeholder="Type card number..." value = {this.state.cardNumber} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} required autoFocus/>
              </Form.Group>

              <Form.Group controlId="cardCode">
                <Form.Label>Card Code</Form.Label>
                <Form.Control type="text" name="cardCode" placeholder="Type card code..." value = {this.state.cardCode} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} required autoFocus/>
              </Form.Group>

              <Form.Group controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control type="text" name="price" placeholder="Type card code..." value = {this.props.price} disabled= {true} />
              </Form.Group>

              
              <Form.Group>
                <Button variant="primary" type="submit">Submit</Button>
                <Link to = "/configurator">Cancel</Link>
              </Form.Group>
          </Form>
        </>
      )}
      </AuthContext.Consumer>
    );
    
  }
}

export default RentalForm;