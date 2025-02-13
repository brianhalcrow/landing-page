import DecimalDecoder from '../DecimalDecoder.js';

class TradeErrorDecoder {
    static BLOCK_LENGTH = 370;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.offset = 0;
        this.buffer = null;
        this.amountDecoder = new DecimalDecoder();
        this.secondaryAmountDecoder = new DecimalDecoder();
        this.priceDecoder = new DecimalDecoder();
        this.leg= [];
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset + 8; // Add the header again? The first field starts at 16
        return this;
    }

    // Decode transactionType
    transactionType() {
        return this.getString(this.offset + 0, 3);
    }

    // Decode symbol
    symbol() {
        return this.getString(this.offset + 3, 6);
    }

    // Decode transactTime
    transactTime() {
        return this.getString(this.offset + 9, 21);
    }

    // Decode messageTime
    messageTime() {
        return this.buffer.getBigInt64(this.offset + 30, true);
    }

    // Decode quoteRequestID
    quoteRequestID() {
        return this.getString(this.offset + 38, 16);
    }

    // Decode quoteID
    quoteID() {
        return this.getString(this.offset + 54, 16);
    }

    // Decode dealRequestID
    dealRequestID() {
        return this.getString(this.offset + 70, 16);
    }

    // Decode dealID
    dealID() {
        return this.getString(this.offset + 86, 16);
    }

    // Decode clientID
    clientID() {
        return this.getString(this.offset + 102, 4);
    }

    // Decode message
    message() {
        return this.getString(this.offset + 106, 256);
    }

    decodeLeg() {
        const results = [];
        const groupHeaderOffset = TradeErrorDecoder.BLOCK_LENGTH + 8;
        const numInGroup = this.buffer.getUint16(groupHeaderOffset + 2, TradeErrorDecoder.LITTLE_ENDIAN);
        let currentOffset = groupHeaderOffset + 4;

        for (let i = 0; i < numInGroup; i++) {
            const entry = {};
            
            this.amountDecoder.wrap(this.buffer.buffer, currentOffset);
            entry.amount = {
                mantissa: this.amountDecoder.mantissa(),
                exponent: this.amountDecoder.exponent()
            };
            currentOffset += DecimalDecoder.ENCODED_LENGTH;

            entry.currency = this.getString(currentOffset, 3);
            currentOffset += 3;
            
            this.secondaryAmountDecoder.wrap(this.buffer.buffer, currentOffset);
            entry.secondaryAmount = {
                mantissa: this.secondaryAmountDecoder.mantissa(),
                exponent: this.secondaryAmountDecoder.exponent()
            };
            currentOffset += DecimalDecoder.ENCODED_LENGTH;

            entry.secondaryCurrency = this.getString(currentOffset, 3);
            currentOffset += 3;
            entry.valueDate = this.getString(currentOffset, 8);
            currentOffset += 8;
            entry.side = this.getString(currentOffset, 4);
            currentOffset += 4;
            
            this.priceDecoder.wrap(this.buffer.buffer, currentOffset);
            entry.price = {
                mantissa: this.priceDecoder.mantissa(),
                exponent: this.priceDecoder.exponent()
            };
            currentOffset += DecimalDecoder.ENCODED_LENGTH;

            results.push(entry);
        }

        return results;
    }

    toString() {
        return {
                transactionType: this.transactionType().replace(/\0/g, ''),
                symbol: this.symbol().replace(/\0/g, ''),
                transactTime: this.transactTime().replace(/\0/g, ''),
                messageTime: this.messageTime(),
                quoteRequestID: this.quoteRequestID().replace(/\0/g, ''),
                quoteID: this.quoteID().replace(/\0/g, ''),
                dealRequestID: this.dealRequestID().replace(/\0/g, ''),
                dealID: this.dealID().replace(/\0/g, ''),
                clientID: this.clientID().replace(/\0/g, ''),
                message: this.message().replace(/\0/g, ''),
                leg: this.decodeLeg(this.buffer, this.offset + 8),
        };
    }

    getString(offset, length) {
        const decoder = new TextDecoder();
        const bytes = new Uint8Array(this.buffer.buffer, offset, length);
        return decoder.decode(bytes);
    }

}

export default TradeErrorDecoder;
