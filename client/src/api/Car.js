class Car{    
    constructor(id, category, brand, model) {
        if(id)
            this.id = id;

        this.category = category;
        this.brand = brand;
        this.model = model;
    }


    /**
     * Construct a Car from a plain object
     * @param {{}} json 
     * @return {Car} the newly created Car object
     */
    static from(json) {
        const c =  Object.assign(new Car(), json);
        return c;
    }
}
export default Car;