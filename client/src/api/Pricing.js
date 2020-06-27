class Pricing{    
    constructor(id, item, price ) {
        if(id)
            this.id = id;

        this.item = item;
        this.price = price;
    }


/**
     * Construct a Pricing from a plain object
     * @param {{}} json 
     * @return {Pricing} the newly created Pricing object
     */
static from(json) {
        const p =  Object.assign(new Pricing(), json);
        return p;
    }
}
export default Pricing;