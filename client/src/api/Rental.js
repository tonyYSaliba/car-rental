class Rental{    
    constructor(id, user_id, car_id, age,starting_day, end_day, number_extra_drivers, number_kilometers, extra_insurance, price ) {
        if(id)
            this.id = id;

        this.user_id = user_id;
        this.car_id = car_id;
        this.age = age;
        this.starting_day = starting_day;
        this.end_day = end_day;
        this.number_extra_drivers = number_extra_drivers;
        this.number_kilometers = number_kilometers;
        this.extra_insurance = extra_insurance;
        this.price = price;
    }
    /**
     * Construct a Rental from a plain object
     * @param {{}} json 
     * @return {Rental} the newly created Rental object
     */
    static from(json) {
        const r =  Object.assign(new Rental(), json);
        return r;
    }
}
export default Rental;
