import { v4 as uuidv4 } from 'uuid';
const quotes = [];

export class Quote {
    constructor(id, symbol, price, availableVolume, expiration, creationDate) {
        this.id = id; // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        this.symbol = symbol // string
        this.price = price // Number
        this.availableVolume = availableVolume // int

        this.expDate = new Date(expiration); // T00:00:00.0000Z
        this.expDate.setHours(24, 0, 0, 0);

        this.creationDate = new Date(); 


    }

    getId() {    // UUID
        return this.id;
    }

    setId(id) {
        this.id = id;
        return this.id;
    }

    setSymbol(symbol) {  // string
        this.symbol = symbol;
        return this.symbol;
    }

    getSymbol() {
        return this.symbol;
    }

    setPrice(price) {    // currency numeric type
        if (Number(price)) this.price = price;
        else throw ("Price is not valid");

        return this.price;
    }

    getPrice() {
        return this.price;
    }

    setAvailableVolume(volume) { //int
        if (parseInt(volume)) this.volume = volume;
        else throw ("Volume is not valid");

        return this.volume;
    }

    getAvailableVolume() {
        return this.availableVolume;
    }

    setExpiration(expiration) {
        if (Date(expiration)) this.expDate = expiration;
        else throw ("Volume is not valid");

        return this.expDate;
    }

    getExpiration() {    // date
        return this.expDate
    }
}

export class TradeResult {
    constructor(symbol, volumeWeightedAveragePrice, volumeRequested) {
        this.id = uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        this.symbol = symbol // string
        this.avgPrice = volumeWeightedAveragePrice // Number
        this.volumeRequested = volumeRequested // int
    }

    getId() {    // UUID
        return this.id;
    }

    setId(id) {
        this.id = id;
        return this.id;
    }

    setSymbol(symbol) {  // string
        this.symbol = symbol;
        return this.symbol;
    }

    getSymbol() {
        return this.symbol;
    }

    setVolumeWeightedAveragePrice(avgPrice) {
        if (Number(avgPrice)) this.avgPrice = avgPrice;
        else throw ("Price is not valid");

        return this.avgPrice;
    }

    getVolumeWeightedAveragePrice() {
        return this.avgPrice;
    }

    setVolumeRequested(volume) {
        if (parseInt(volume)) this.volumeRequested = volume;
        else throw ("Volume is not valid");

        return this.volumeRequested;
    }

    getVolumeRequested() {
        return this.volumeRequested;
    }
}

export class QuoteManager {

    // Add or update the quote by Id
    addOrUpdateQuote(quote) {
        const quoteExisted = quotes.find(item => item.id == quote.id) // find quote

        if (quoteExisted) {
            // update params
            quoteExisted.price = quote.price
            quoteExisted.availableVolume = quote.availableVolume
            quoteExisted.symbol = quote.symbol
            console.log(`Quoe updated with id ${quoteExisted.getId()}`)
            return quoteExisted
        } else {
            // If quote is new
            const result = new Quote(quote.id, quote.symbol, quote.price, quote.availableVolume, quote.expiration, quote.creationDate);
            quotes.push(result);
            console.log(`New quote added with id ${result.getId()}`)
            return result
        }
    }

    // Remove quote by Id
    removeQuote(id) {
        const existedQuoteId = quotes.findIndex(item => item.id == id) // find quote

        if (existedQuoteId !== -1) {
            quotes.splice(existedQuoteId, 1);
            console.log("Delete succesful!");
            return true;
        } else {
            console.log("Quote does not exist or cannot be deleted.");
            return false;
        }
    }

    // Remove all quotes on the specifed symbol's book.
    removeAllQuotes(symbol) {
        const quotesToRemove = quotes.filter(item => item.symbol == symbol);
        if (quotesToRemove.length > 0) {
            quotesToRemove.map(item => this.removeQuote(item.getId()));
            console.log(`All quotes removed with symbol: ${symbol}`);
        } else {
            console.log("No quotes found with given symbol.");
        }
    }

    // Get the quotes. Sorted by price (ASC)
    getQuotesSortByPrice(symbol) {
        const today = new Date(); // Today
        today.setHours(0, 0, 0, 0); // set today's date's hours to 0

        const availableQuotes = quotes
            .filter(item => item.symbol == symbol)
            .filter(item => item.availableVolume > 0)
            .filter(item => item.expDate >= today);

        // sort by price (asc)
        if (availableQuotes.length > 0)
            availableQuotes.sort((a,b)=> (a.price > b.price ? 1 : -1))

        return availableQuotes;
    }

    // Get the best quote
    getBestQuoteWithAvailableVolume(symbol) {
        const bestQuotes = this.getQuotesSortByPrice(symbol);

        if (bestQuotes.length > 0) {
            const sortedBestQuotes = bestQuotes.sort((a,b)=> (a.creationDate > b.creationDate ? 1 : -1)); //checks the oldest quote
            return sortedBestQuotes[0];
        } else return null;
    }

    // Execute trade.
    executeTrade(symbol, volumeRequested) {
        const availableQuotes = this.getQuotesSortByPrice(symbol);
        
        for (var i = 0; i < availableQuotes.length; i++) {
            // if volume can NOT be fulfilled completely
            if (volumeRequested > availableQuotes[i].availableVolume) {
                const currentAvailableVolume = availableQuotes[i].availableVolume
                volumeRequested = volumeRequested - currentAvailableVolume;
                availableQuotes[i].availableVolume = 0;
                // console.log(currentAvailableVolume)
            } 
            // if volume can be fulfilled completely
            else {
                availableQuotes[i].availableVolume -= volumeRequested;
                volumeRequested = 0;
                console.log("Volume fulfilled!");
                return true; // volume filled (volumeRequested = 0)
            }
        }

        console.log(`Volume cannot be fulfilled! Remaining volume ${volumeRequested}`)
        return false;
    }
}

// Init quote manager
const quoteManager = new QuoteManager();

// Quote to be updated.
const quoteToBeUpdatedId = uuidv4();
quoteManager.addOrUpdateQuote({ id: quoteToBeUpdatedId, symbol: "test1", price: 1.99, availableVolume: 750, expiration: "2022-12-17" });
quoteManager.addOrUpdateQuote({ id: uuidv4(), symbol: "test1", price: 2.99, availableVolume: 1000, expiration: "2022-12-22" });
quoteManager.addOrUpdateQuote({ id: uuidv4(), symbol: "test1", price: 2.99, availableVolume: 1500, expiration: "2022-12-22" });
quoteManager.addOrUpdateQuote({ id: uuidv4(), symbol: "test2", price: 1.99, availableVolume: 500, expiration: "2022-12-14" });
quoteManager.addOrUpdateQuote({ id: uuidv4(), symbol: "test2", price: 3.99, availableVolume: 2000, expiration: "2022-12-24" });
console.log("Quote Add - testing finished. \n\n")

quoteManager.addOrUpdateQuote({ id: quoteToBeUpdatedId, symbol: "test1", price: 5.99, availableVolume: 2500, expiration: "2022-12-17" });
console.log("Quote Add - testing finished. \n\n")

var quoteToBeRemoved = quoteManager.addOrUpdateQuote({ id: uuidv4(), symbol: "oneToBeRemoved", price: 2.99, availableVolume: 1500, expiration: "2022-12-22" });
quoteManager.removeQuote(quoteToBeRemoved.getId());
console.log("Remove one quote - testing finished. \n\n")


quoteManager.addOrUpdateQuote({ id: uuidv4(), symbol: "allToBeRemoved", price: 2.99, availableVolume: 1500, expiration: "2022-12-22" });
quoteManager.addOrUpdateQuote({ id: uuidv4(), symbol: "allToBeRemoved", price: 2.99, availableVolume: 1500, expiration: "2022-12-22" });
quoteManager.removeAllQuotes("allToBeRemoved");
console.log("Remove all quotes with symbol - testing finished. \n\n")


var bestQuote = quoteManager.getBestQuoteWithAvailableVolume("test1");
console.log(bestQuote);
console.log("Get the best quote with symbol - testing finished. \n\n")


quoteManager.executeTrade("test1", 20000); // will throw error
quoteManager.executeTrade("test2", 1000); // will fulfill
console.log("Execute trades - testing finished. \n\n")
