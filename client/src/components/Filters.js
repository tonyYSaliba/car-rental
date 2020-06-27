import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import {NavLink} from 'react-router-dom';
import moment from 'moment';
class Filters extends React.Component {

    componentDidMount(){
        
       if(this.props.mode == "browse"){
        this.props.filterCars_general(this.props.filter);
       }
       else if (this.props.mode == "rentals"){
           this.props.onFilter("current");
       }
       else{
           this.props.reset();
           this.props.filterCars_general(this.props.browseFilter);
       }
    }
    
    render() {

       
        return (
            
            <>  
                {this.props.mode == "browse" && 
                <ListGroup variant="flush">

                    <ListGroup.Item className="p-3 mt-5 list-title">Categories</ListGroup.Item>    

                    <Form.Group controlId="category_A">
                    <Form.Label>A</Form.Label>
                    <Form.Control type="checkbox" name="A" checked={this.props.filter.categories.includes("A")} onChange={() => this.props.filterCars_browse_categories("A")}/>
                    </Form.Group>

                    <Form.Group controlId="category_B">
                    <Form.Label>B</Form.Label>
                    <Form.Control type="checkbox" name="B" checked={this.props.filter.categories.includes("B")} onChange={() => this.props.filterCars_browse_categories("B")}/>
                    </Form.Group>
                    
                    <Form.Group controlId="category_C">
                    <Form.Label>C</Form.Label>
                    <Form.Control type="checkbox" name="C" checked={this.props.filter.categories.includes("C")} onChange={() => this.props.filterCars_browse_categories("C")}/>
                    </Form.Group>
                    
                    <Form.Group controlId="category_D">
                    <Form.Label>D</Form.Label>
                    <Form.Control type="checkbox" name="D" checked={this.props.filter.categories.includes("D")} onChange={() => this.props.filterCars_browse_categories("D")}/>
                    </Form.Group>

                    <Form.Group controlId="category_E">
                    <Form.Label>E</Form.Label>
                    <Form.Control type="checkbox" name="E" checked={this.props.filter.categories.includes("E")} onChange={() => this.props.filterCars_browse_categories("E")}/>
                    </Form.Group>
                    
                    <ListGroup.Item className="p-3 mt-5 list-title">Brands</ListGroup.Item> 

                    {/* <Form.Group controlId="brand_AUDI">
                    <Form.Label>AUDI</Form.Label>
                    <Form.Control type="checkbox" name="AUDI" checked={this.props.filter.brands.includes("AUDI")} onChange={() => this.props.filterCars_browse_brands("AUDI")}/>
                    </Form.Group>

                    <Form.Group controlId="brand_FORD">
                    <Form.Label>FORD</Form.Label>
                    <Form.Control type="checkbox" name="FORD" checked={this.props.filter.brands.includes("FORD")} onChange={() => this.props.filterCars_browse_brands("FORD")}/>
                    </Form.Group> */}

                    {this.props.brands.map((brand, index) => {
                         return <Form.Group controlId={brand.brand} key = {"group"+index}>
                         <Form.Label key = {"label"+index}>{brand.brand}</Form.Label>
                         <Form.Control key = {"control"+index} type="checkbox" name={brand.brand} checked={this.props.filter.brands.includes(brand.brand)} onChange={() => this.props.filterCars_browse_brands(brand.brand)}/>
                         </Form.Group>
                    }
                    ) }

                </ListGroup>}

                {this.props.mode == "configurator" &&
                <ListGroup  variant="flush">
                    <ListGroup.Item className="p-3 mt-5 list-title">Parameters</ListGroup.Item>
                    
                <Form.Group controlId="starting_day">
                    <Form.Label>Starting day</Form.Label>
                    <Form.Control  type="date"   min={moment().format("YYYY-MM-DD")} max = {moment(this.props.filter.end_day).format("YYYY-MM-DD")}name="starting_day" value = {this.props.filter.starting_day} onChange={(ev) => this.props.updateRentalFilters( ev.target.name,ev.target.value)} required autoFocus/>
              </Form.Group>

              <Form.Group controlId="end_day">
                    <Form.Label>End day</Form.Label>
                    <Form.Control type="date" min={moment(this.props.filter.starting_day).format("YYYY-MM-DD") && moment().format("YYYY-MM-DD")}   name="end_day" value = {this.props.filter.end_day} onChange={(ev) => this.props.updateRentalFilters( ev.target.name,ev.target.value)} required autoFocus/>
              </Form.Group>
              <label>Category</label>
              <select  name="category" placeholder="" onChange={(ev) => this.props.updateRentalFilters( ev.target.name,ev.target.value)} value={this.props.filter.category}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
               </select>
              <Form.Group controlId="age">
                    <Form.Label>Age</Form.Label>
                    <Form.Control  type="text" name="age" placeholder="" value = {this.props.filter.age} onChange={(ev) => this.props.updateRentalFilters( ev.target.name,ev.target.value)} required autoFocus/>
              </Form.Group>

                <Form.Group controlId="number_extra_drivers">
                    <Form.Label>Number of extra drivers</Form.Label>
                    <Form.Control  type="text" name="number_extra_drivers" placeholder="" value = {this.props.filter.number_extra_drivers} onChange={(ev) => this.props.updateRentalFilters( ev.target.name,ev.target.value)} required autoFocus/>
              </Form.Group>

              <Form.Group controlId="number_kilometers">
                    <Form.Label>Number of Km</Form.Label>
                    <Form.Control  type="text" name="number_kilometers" placeholder="" value = {this.props.filter.number_kilometers} onChange={(ev) => this.props.updateRentalFilters( ev.target.name,ev.target.value)} required autoFocus/>
              </Form.Group>
              
              <Form.Group controlId="extra_insurance">
                    <Form.Label>Extra insurance</Form.Label>
                    <Form.Control  type="checkbox" name="extra_insurance" placeholder="" checked = {this.props.filter.extra_insurance} onChange={(ev) => this.props.updateRentalFilters( ev.target.name,!this.props.filter.extra_insurance)} />
              </Form.Group>

                </ListGroup>}

                {
                    this.props.mode == "rentals" &&
                    <ListGroup  variant="flush">
                        <NavLink key = "#current" to = "/rentals"><ListGroup.Item action active = {this.props.activeFilter === "current" ? true : false} id = "filter-current" onClick = {() => this.props.onFilter("current")}>Current rentals</ListGroup.Item></NavLink>
                        <NavLink key = "#past" to = "/rentals/past"><ListGroup.Item action active = {this.props.activeFilter === "past" ? true : false} id = "filter-past" onClick = {() => this.props.onFilter("past")}>Past rentals</ListGroup.Item></NavLink>
                        <NavLink key = "#future" to = "/rentals/future"><ListGroup.Item action active = {this.props.activeFilter === "future" ? true : false} id = "filter-future" onClick = {() => this.props.onFilter("future")}>Future rentals</ListGroup.Item></NavLink>
                    </ListGroup>
                }
            </>
        );
    }
}

export default Filters;
