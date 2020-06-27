class Pricing{    
    constructor(id, item, price ) {
        if(id)
            this.id = id;

        this.item = item;
        this.price = price;
    }
}

module.exports = Pricing;
