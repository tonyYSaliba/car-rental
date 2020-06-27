import React from 'react';
import './App.css';
import Header from './components/Header';
import Container from 'react-bootstrap/Container'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse';
import Filters from './components/Filters';
import List from './components/List';
import RentalForm from './components/RentalForm';
import LoginForm from './components/LoginForm';
import API from './api/API';
import {Redirect, Route} from 'react-router-dom';
import {Switch} from 'react-router';
import {AuthContext} from './auth/AuthContext';
import { withRouter } from 'react-router-dom';
import moment from 'moment';


class App extends React.Component {
  
  constructor(props)  {
    super(props);
    this.state = { brands:[], totalCars: {"A":0, "B":0, "C":0, "D":0, "E":0 } ,getDiscount:false, rentalHistoryFilter:"future",availableCars:[],cars: [], rentals: [], pricings: [], filter: {idz:[], categories:[], brands:[]}, openMobileMenu: false, rentalFilters:{category:"A", starting_day:"", end_day:"", age:"", number_extra_drivers: "", number_kilometers:"", extra_insurance:false}, rentalFilterFetch:false, rentalFiltersReady:{category:true,starting_day:false, end_day:false, age:false, number_extra_drivers: false, number_kilometers:false, extra_insurance:true}};
  }

  componentDidMount() {
    //setTimeout(() => {window.location.reload()}, 5000);
    //check if the user is authenticated
    API.isAuthenticated().then(
      (user) => {
        
        this.setState({authUser: user});
        this.props.history.push("/configurator");
      }
    ).catch((err) => { 
      this.setState({authErr: err.errorObj});
      this.props.history.push("/init");
    });

    API.getPricing().then((pricings) => 
    this.setState(prevState => {
      let temp = Object.assign({}, prevState);  
      temp.pricings = pricings; 
      return  temp ;                                
      })
    )
    this.getAllCarsCategory()
    this.getBrands()
  }


  handleErrors(err) {
    if (err) {
        if (err.status && err.status === 401) {
          this.setState({authErr: err.errorObj});
          this.setState({brands:this.state.brands, totalCars: this.state.totalCars, getDiscount:false, rentalHistoryFilter:"future",authUser: null,authErr: null,cars: [],availableCars:[], rentals: [], pricings: this.state.pricings, filter: {idz:[], categories:[], brands:[]}, openMobileMenu: false, rentalFilters:{category:"A", starting_day:"", end_day:"", age:"", number_extra_drivers: "", number_kilometers:"", extra_insurance:false}, rentalFilterFetch:false, rentalFiltersReady:{category:true,starting_day:false, end_day:false, age:false, number_extra_drivers: false, number_kilometers:false, extra_insurance:true}});
          this.props.history.push("/browse");
        }
    }
}



getBrands = () => {
  API.getBrands() //to get all brands
  .then((brandS) => {
    this.setState({brands:brandS});
  })
  .catch((errorObj) => {
    this.handleErrors(errorObj);
  });
}

  // Add a logout method
  logout = () => {
    API.userLogout().then(() => {
      this.setState({brands:this.state.brands,totalCars: this.state.totalCars, getDiscount:false, rentalHistoryFilter:"future",authUser: null,authErr: null,cars: [],availableCars:[], rentals: [], pricings: this.state.pricings, filter: {idz:[], categories:[], brands:[]}, openMobileMenu: false, rentalFilters:{category:"A", starting_day:"", end_day:"", age:"", number_extra_drivers: "", number_kilometers:"", extra_insurance:false}, rentalFilterFetch:false, rentalFiltersReady:{category:true,starting_day:false, end_day:false, age:false, number_extra_drivers: false, number_kilometers:false, extra_insurance:true}});
      //add method get browse cars
      this.filterCars_general(this.state.filter)
      this.props.history.push("/browse");
    });
  }

  // Add a login method
  login = (username, password) => {
    API.userLogin(username, password).then(
      (user) => { 

        
        this.setState({brands:this.state.brands,totalCars: this.state.totalCars, getDiscount:false, rentalHistoryFilter:"future",cars: [],availableCars:[], rentals: [], pricings:this.state.pricings, filter: {idz:[], categories:[], brands:[]}, openMobileMenu: false, rentalFilters:{category:"A", starting_day:"", end_day:"", age:"", number_extra_drivers: "", number_kilometers:"", extra_insurance:false}, rentalFilterFetch:false, rentalFiltersReady:{category:true,starting_day:false, end_day:false, age:false, number_extra_drivers: false, number_kilometers:false, extra_insurance:true}, authUser: user, authErr: null});
        //add method get browse cars
        this.filterCars_general(this.state.filter)
        this.props.history.push("/configurator");
      }
    ).catch(
      (errorObj) => {
        const err0 = errorObj.errors[0];
        this.setState({authErr: err0});
      }
    );
  }

  showSidebar = () => {
    this.setState((state) => ({openMobileMenu: !state.openMobileMenu}));
  }

  filterCars_browse_categories = (filter) => {
    let temp ={};
      if(this.state.filter.categories.includes(filter)){
          temp = Object.assign({}, this.state);  
          temp.filter.categories = temp.filter.categories.filter((val)=>val!=filter);                  
      }
      else{
           temp = Object.assign({}, this.state); 
          
          temp.filter.categories = [...temp.filter.categories, filter];                
        }
      API.getCarsBrowse(temp.filter)
        .then((cars) => {
          this.setState({brands:this.state.brands,totalCars: this.state.totalCars, getDiscount:false, rentalHistoryFilter:"future",cars:cars,availableCars:[], filter: temp.filter, rentals: [], pricings: this.state.pricings, openMobileMenu: false, rentalFilters:{category:"A", starting_day:"", end_day:"", age:"", number_extra_drivers: "", number_kilometers:"", extra_insurance:false}, rentalFilterFetch:false, rentalFiltersReady:{category:true,starting_day:false, end_day:false, age:false, number_extra_drivers: false, number_kilometers:false, extra_insurance:true}});
        })
        .catch((errorObj) => {
          this.handleErrors(errorObj);
        });
  }


  getAllCarsCategory = ()=>{
    let totalCars= {"A":0, "B":0, "C":0, "D":0, "E":0 }
    API.getCarsBrowse({idz:[], categories:["A"], brands:[]})
    .then((cars) => {
      totalCars.A = cars.length;
      this.setState({totalCars:totalCars});        

    })
    .catch((errorObj) => {
      this.handleErrors(errorObj);
    });
    API.getCarsBrowse({idz:[], categories:["B"], brands:[]})
    .then((cars) => {
      totalCars.B = cars.length;
      this.setState({totalCars:totalCars});
    })
    .catch((errorObj) => {
      this.handleErrors(errorObj);
    });
    API.getCarsBrowse({idz:[], categories:["C"], brands:[]})
    .then((cars) => {
      totalCars.C = cars.length;
      this.setState({totalCars:totalCars});
    })
    .catch((errorObj) => {
      this.handleErrors(errorObj);
    });
    API.getCarsBrowse({idz:[], categories:["D"], brands:[]})
    .then((cars) => {
      totalCars.D = cars.length; 
      this.setState({totalCars:totalCars});
    })
    .catch((errorObj) => {
      this.handleErrors(errorObj);
    });
    API.getCarsBrowse({idz:[], categories:["E"], brands:[]})
    .then((cars) => {
      totalCars.E = cars.length; 
      this.setState({totalCars:totalCars});
    })
    .catch((errorObj) => {
      this.handleErrors(errorObj);
    });


  }

  getCarsAvailableCars = (filter) =>{
    API.getCarsAvailableCars(filter)
    .then((cars) => {
      this.setState({brands:this.state.brands,totalCars: this.state.totalCars, getDiscount:false, rentalHistoryFilter:"future",cars:this.state.cars,availableCars:cars, filter: this.state.filter, rentals:[], rentalFilters:filter, pricings: this.state.pricings, price:this.price, rentalFilterFetch:false, rentalFiltersReady:{category:true,starting_day:true, end_day:true, age:true, number_extra_drivers: true, number_kilometers:true, extra_insurance:true}});
    })
    .catch((errorObj) => {
      this.handleErrors(errorObj);
    });
    API.getRentalsPastRentals()
    .then((myRentals) => {
      this.setState((prevState) => {
        let temp = Object.assign({}, prevState); 
        if(myRentals.length>=3)
        {temp.getDiscount = true;}
        else 
       { temp.getDiscount = false;}
        return temp;                                
      });
    })
    .catch((errorObj) => {
      this.handleErrors(errorObj);
    });
  }

  reset = ()=>{
    this.setState({ brands:this.state.brands, totalCars: this.state.totalCars, getDiscount:false, rentalHistoryFilter:"future",price:null,pricings:this.state.pricings, cars:this.state.cars, availableCars:[],rentalFilters:{category:"A",starting_day:"", end_day:"", age:"", number_extra_drivers: "", number_kilometers:"", extra_insurance:false}, rentalFilterFetch:false ,rentalFiltersReady:{category:true,starting_day:false, end_day:false, age:false, number_extra_drivers: false, number_kilometers:false, extra_insurance:true}})
  }
  isInt = (value) =>{
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
  }

  updateRentalFilters = (name, value)=>{

    let myObject = Object.assign({}, this.state.rentalFilters);
    myObject[name] = value;
    let myObjectCheck =Object.assign({}, this.state);
    if(name == "starting_day"){
      if(moment(moment(value).format("YYYY-MM-DD"),"YYYY-MM-DD",true).isValid()){
        myObjectCheck.rentalFiltersReady.starting_day = true;                
        this.setState(prevState => {
          let temp = Object.assign({}, prevState);  
          temp.rentalFiltersReady.starting_day = true;                
          temp.rentalFilters.starting_day = value;
          return  temp ;                                 
        })
      }
      else{
        myObjectCheck.rentalFiltersReady.starting_day = false;                   
        this.setState(prevState => {
          let temp = Object.assign({}, prevState); 
          temp.rentalFiltersReady.starting_day = false;                 
          myObjectCheck.rentalFiltersReady.starting_day = false;                  
          temp.rentalFilters.starting_day = value;
          return  temp ;                                 
        })
      }
    }
    else if (name == "end_day"){
      if(moment(moment(value).format("YYYY-MM-DD"),"YYYY-MM-DD",true).isValid()){
        myObjectCheck.rentalFiltersReady.end_day = true;                
        this.setState(prevState => {
          let temp = Object.assign({}, prevState);  
          temp.rentalFiltersReady.end_day = true;              
          temp.rentalFilters.end_day = value;
          return  temp ;                                
        })
      }
      else{
        myObjectCheck.rentalFiltersReady.end_day = false;            
        this.setState(prevState => {
          let temp = Object.assign({}, prevState);  
          temp.rentalFiltersReady.end_day = false;                
          temp.rentalFilters.end_day = value;
          return  temp ;                                
        })
      }
    }
    else if (name == "number_extra_drivers"){
      if(value=="-"){
        myObjectCheck.rentalFiltersReady.number_extra_drivers = false;                 
        this.setState(prevState => {
          let temp = Object.assign({}, prevState);  
          temp.rentalFiltersReady.number_extra_drivers = false;                 
          temp.rentalFilters.number_extra_drivers = "";
          return  temp ;                                 
        })
        alert("insert a positive integer");
      }
      else if (this.isInt(value)) {
        myObjectCheck.rentalFiltersReady.number_extra_drivers = true;                
        this.setState(prevState => {
          let temp = Object.assign({}, prevState);  
          temp.rentalFiltersReady.number_extra_drivers = true;                  
          temp.rentalFilters.number_extra_drivers = value;
          return  temp ;                                
        })        
      } else {
        myObjectCheck.rentalFiltersReady.number_extra_drivers = false;               
        this.setState(prevState => {
          let temp = Object.assign({}, prevState);  
          temp.rentalFiltersReady.number_extra_drivers = false;               
          temp.rentalFilters.number_extra_drivers = "";
          return temp ;                                 
        })
        if(value != "")
          alert("insert an integer");
      }
      
    }
    else if (name == "number_kilometers"){
      if(value=="-"){
        myObjectCheck.rentalFiltersReady.number_kilometers = false;               
        this.setState(prevState => {
          let temp = Object.assign({}, prevState);  
          temp.rentalFiltersReady.number_kilometers = false;               
          temp.rentalFilters.number_kilometers="";
          return  temp ;                                
        })
        alert("insert a positive integer");
      }
      else if (this.isInt(value)) {
        myObjectCheck.rentalFiltersReady.number_kilometers = true;            
        this.setState(prevState => {
          let temp = Object.assign({}, prevState); 
          temp.rentalFiltersReady.number_kilometers = true;             
          temp.rentalFilters.number_kilometers=value;
          return  temp ;                                 
        })
      } else {
        myObjectCheck.rentalFiltersReady.number_kilometers = false;                
        this.setState(prevState => {
          let temp = Object.assign({}, prevState); 
          temp.rentalFiltersReady.number_kilometers = false;                 
          temp.rentalFilters.number_kilometers="";
          return  temp ;                                 
        })
        if(value != "")
          alert("insert an integer");
      }
    }
    else if (name == "extra_insurance"){
      this.setState(prevState => {
        let temp = Object.assign({}, prevState);  
        temp.rentalFilters.extra_insurance=value;
        return  temp ;                                 
      })
    }
    else if (name == "category"){
      this.setState(prevState => {
        let temp = Object.assign({}, prevState);  
        temp.rentalFilters.category=value;
        return  temp ;                                 
      })
    }
    else if (name == "age"){
      if(value=="-"){
        myObjectCheck.rentalFiltersReady.age = false;            
        this.setState(prevState => {
          let temp = Object.assign({}, prevState);  
          temp.rentalFiltersReady.age = false;                
          temp.rentalFilters.age="";
          return  temp ;                                 
        })
        alert("insert a positive integer");
      }
      else if (this.isInt(value)) {
        myObjectCheck.rentalFiltersReady.age = true;                 
        this.setState(prevState => {
          let temp = Object.assign({}, prevState);  
          temp.rentalFiltersReady.age = true;                
          temp.rentalFilters.age = value;
          return  temp ;                                 
          
        })
      } else {
        myObjectCheck.rentalFiltersReady.age = false;                 
        this.setState(prevState => {
          let temp = Object.assign({}, prevState);  
          temp.rentalFiltersReady.age = false;               
          temp.rentalFilters.age = "";
          return  temp;                                
        });
        if(value != "")
        alert("insert an integer");
      }
    }
    

    let a = myObjectCheck.rentalFiltersReady;
    if(a.starting_day && a.end_day && a.age && a.extra_insurance && a.number_extra_drivers && a.number_kilometers){
            this.getCarsAvailableCars(myObject);
    }
    else{
      this.setState(prevState => {
        let temp = Object.assign({}, prevState);  
        temp.availableCars = [];               
        return  temp ;                                
      });
      this.props.history.push("/configurator");
    }
  }

  filterCars_browse_brands = (filter) => {
    let temp ={};
      if(this.state.filter.brands.includes(filter)){
          temp = Object.assign({}, this.state);  
          temp.filter.brands = temp.filter.brands.filter((val)=>val!=filter);                
      }
      else{
           temp = Object.assign({}, this.state); 
          
          temp.filter.brands = [...temp.filter.brands, filter];                 
        }
      API.getCarsBrowse(temp.filter)
        .then((cars) => {
          this.setState({brands:this.state.brands, totalCars: this.state.totalCars, getDiscount:false, rentalHistoryFilter:"future",cars:cars,availableCars:[], filter: temp.filter, rentals: [], pricings: this.state.pricings, openMobileMenu: false, rentalFilters:{category:"A", starting_day:"", end_day:"", age:"", number_extra_drivers: "", number_kilometers:"", extra_insurance:false}, rentalFilterFetch:false, rentalFiltersReady:{category:true,starting_day:false, end_day:false, age:false, number_extra_drivers: false, number_kilometers:false, extra_insurance:true}});
        })
        .catch((errorObj) => {
          this.handleErrors(errorObj);
        });
}
filterCars_general= (filter) => {
  API.getCarsBrowse(filter)
  .then((cars) => {
    this.setState({brands:this.state.brands, totalCars: this.state.totalCars, getDiscount:false, rentalHistoryFilter:"future",cars: cars,availableCars:[],filter: filter, rentals: [], pricings: this.state.pricings, openMobileMenu: false, rentalFilters:{category:"A", starting_day:"", end_day:"", age:"", number_extra_drivers: "", number_kilometers:"", extra_insurance:false}, rentalFilterFetch:false, rentalFiltersReady:{category:true,starting_day:false, end_day:false, age:false, number_extra_drivers: false, number_kilometers:false, extra_insurance:true} });
  })
  .catch((errorObj) => {
    this.handleErrors(errorObj);
  });
}

  getAllPricings= () => {
    API.getPricing().then((pricings) => 
    this.setState(prevState => {
      let temp = Object.assign({}, prevState);  
      temp.pricings = pricings;                
      return  temp ;                                 
      })
    ).catch((errorObj) => {
      this.handleErrors(errorObj);
    });
  }

  setRentalFilterFetch=(value)=>{
    this.setState({rentalFilterFetch:value});
  }

  addRental = (rental) => {
      
      API.addRental(rental)
        .then(() => {
          //this.props.history.push("/rentals");
          //alert("rental done!");
          //get the updated list of tasks from the server
          //API.getTasks().then((tasks) => this.setState({tasks: tasks, filter: 'All',projects: this.getProjects(tasks)}));
        })
        .catch((errorObj) => {
          this.handleErrors(errorObj);
        });
    
  }

  deleteRental = (rentalId) => {
    API.deleteFutureRentals(rentalId)
      .then(() => {
        this.filterRentalHistory("future");
      })
      .catch((errorObj) => {
        this.handleErrors(errorObj);
      });
  }


  filterRentalHistory = (filter) => {
      let myFunction;
      if(filter == "current")
        myFunction = API.getRentalsCurrentRentals;
      else if (filter == "past")
        myFunction = API.getRentalsPastRentals;
      else 
        myFunction = API.getRentalsFutureRentals;

      myFunction()
        .then((myRentals) => {

          this.setState((prevState) => {
            let temp = Object.assign({}, prevState);  
            temp.rentalHistoryFilter=filter;
            temp.rentals = myRentals;
            return temp;                                 
          });
        })
        .catch((errorObj) => {
          this.handleErrors(errorObj);
        });
    
  }
  performPayment = (paymentInfo, rental) => {

    API.performPayment(paymentInfo)
      .then((response) => {
        if(response){
          alert("payment successful!");
          this.addRental(rental)
        }
        else{
          alert("something went wrong!")
        }


      })
      .catch((errorObj) => {
        this.handleErrors(errorObj);
      });
  
}
  
  render() {
    // compose value prop as object with user object and logout method
    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      loginUser: this.login,
      logoutUser: this.logout
    }
    return(
      <AuthContext.Provider value={value}>
        
        <Header showSidebar={this.showSidebar} getPublicTasks = {this.getPublicTasks}/>

        <Container fluid>

          <Switch> 
            <Route path="/login">
              <Row className="vheight-100">
                <Col sm={4}></Col>
                <Col sm={4} className="below-nav"> 
                  <LoginForm/>
                </Col>
              </Row>
            </Route>

            <Route path="/browse"> 
              <Row className="vheight-100">
                <Collapse in={this.state.openMobileMenu}>
                  <Col sm={3} bg="light" id="left-sidebar" className="collapse d-sm-block below-nav">
                    <Filters mode="browse" getBrands = {this.getBrands} brands={this.state.brands} filterCars_browse_categories = {this.filterCars_browse_categories} filterCars_browse_brands={this.filterCars_browse_brands} filterCars_general={this.filterCars_general} filter = {this.state.filter} reset={this.reset}  />
                  </Col>
                </Collapse>;
                  
             
                <Col sm={8} className="below-nav"> 
                  <List cars = {this.state.cars} mode="browseCars" />
                </Col>
              </Row>
            </Route>

            <Route path="/configurator"> 
              <Row className="vheight-100">
                <Collapse in={this.state.openMobileMenu}>
                  <Col sm={3} bg="light" id="left-sidebar" className="collapse d-sm-block below-nav">
                    <Filters mode="configurator" brands={this.state.brands} filter = {this.state.rentalFilters} browseFilter={this.state.filter} rentalFiltersReady = {this.state.rentalFiltersReady} reset={this.reset} updateRentalFilters ={this.updateRentalFilters} getCarsAvailableCars={this.getCarsAvailableCars} rentalFilterFetch={this.rentalFilterFetch} setRentalFilterFetch={this.setRentalFilterFetch} filterCars_general={this.filterCars_general}/>
                  </Col>
                </Collapse>;
                  
             
                <Col sm={8} className="below-nav"> 
                  <List totalCars = {this.state.totalCars} cars = {this.state.availableCars} mode="configurator" getAllPricings = {this.getAllPricings} pricings={this.state.pricings} rentalFilters = {this.state.rentalFilters} getDiscount={this.state.getDiscount}/>
                </Col>



              </Row>
            </Route>


            <Route path="/rentals"> 
              <Row className="vheight-100">
                  <Switch>
                  <Route path="/rentals/:filter"  render={({match}) => {
                      return <Collapse in={this.state.openMobileMenu}>
                        <Col sm={2} bg="light" id="left-sidebar" className="collapse d-sm-block below-nav">
                          <Filters mode="rentals" onFilter = {this.filterRentalHistory} activeFilter = {match.params.filter} reset={this.reset}/>
                        </Col>
                      </Collapse>;
                  }}/> 
                  <Route render={({match}) => {
                      return <Collapse in={this.state.openMobileMenu}>
                      <Col sm={2} bg="light" id="left-sidebar" className="collapse d-sm-block below-nav">
                        <Filters mode="rentals" onFilter = {this.filterRentalHistory} activeFilter = "current" reset={this.reset}/>
                      </Col>
                    </Collapse>;
                  }}/>
                      
                </Switch>

                <Col sm={10} className="below-nav"> 
                  <List  mode = "rentals" myRentals = {this.state.rentals}  deleteRental = {this.deleteRental} activeFilter = {this.state.rentalHistoryFilter} />
                </Col>

              </Row>
            </Route>

            <Route path="/add/:price" render={({match}) => {
              return <Row className="vheight-100">
                <Col sm={4}></Col>
                <Col sm={4} className="below-nav"> 
                  <RentalForm performPayment={this.performPayment} addRental={this.addRental} price = {match.params.price} rentalFilters = {this.state.rentalFilters} filterRentalHistory={this.filterRentalHistory} cars = {this.state.availableCars}/>
                </Col>
              </Row>
            }}/>


            <Route path = "/init" render = {() =>{
              if(this.state.brands.length)
              return <Redirect to='/browse' />

            }
            }

            />
            <Route>
              <Redirect to='/browse' />
            </Route>



          </Switch>            

          
        </Container>
      </AuthContext.Provider>
    );
  }
}

export default withRouter(App);
