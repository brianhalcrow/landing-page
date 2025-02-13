import DecimalEncoder from '../DecimalEncoder.js';
import MessageHeaderEncoder from '../MessageHeaderEncoder.js';

class TradeErrorEncoder {
    static BLOCK_LENGTH = 370;
    static LEG_BLOCK_LENGTH = 45;

    static TEMPLATE_ID = 5;
    static SCHEMA_ID = 5;
    static SCHEMA_VERSION = 1;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountEncoder = new DecimalEncoder();
        this.secondaryAmountEncoder = new DecimalEncoder();
        this.priceEncoder = new DecimalEncoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset + 8; // Add the header again? The first field starts at 16
        return this;
    }

    wrapAndApplyHeader(buffer, offset, headerEncoder) {
        headerEncoder.wrap(buffer, offset)
            .blockLength(TradeErrorEncoder.BLOCK_LENGTH)
            .templateId(TradeErrorEncoder.TEMPLATE_ID)
            .schemaId(TradeErrorEncoder.SCHEMA_ID)
            .version(TradeErrorEncoder.SCHEMA_VERSION);
        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    // Encode transactionType
    transactionType(value) {
        this.putString(this.offset + 0, value, 3);
        return this;
    }

    // Encode symbol
    symbol(value) {
        this.putString(this.offset + 3, value, 6);
        return this;
    }

    // Encode transactTime
    transactTime(value) {
        this.putString(this.offset + 9, value, 21);
        return this;
    }

    // Encode messageTime
    messageTime(value) {
        this.buffer.setBigInt64(this.offset + 30, value, true);
        return this;
    }

    // Encode quoteRequestID
    quoteRequestID(value) {
        this.putString(this.offset + 38, value, 16);
        return this;
    }

    // Encode quoteID
    quoteID(value) {
        this.putString(this.offset + 54, value, 16);
        return this;
    }

    // Encode dealRequestID
    dealRequestID(value) {
        this.putString(this.offset + 70, value, 16);
        return this;
    }

    // Encode dealID
    dealID(value) {
        this.putString(this.offset + 86, value, 16);
        return this;
    }

    // Encode clientID
    clientID(value) {
        this.putString(this.offset + 102, value, 4);
        return this;
    }

    // Encode message
    message(value) {
        this.putString(this.offset + 106, value, 256);
        return this;
    }

    encodeLeg(data) {
        const groupHeaderOffset = TradeErrorEncoder.BLOCK_LENGTH + 8;
        const numInGroup = data.length;

        this.buffer.setUint16(groupHeaderOffset, this.LEG_BLOCK_LENGTH, TradeErrorEncoder.LITTLE_ENDIAN);
        this.buffer.setUint16(groupHeaderOffset + 2, numInGroup, TradeErrorEncoder.LITTLE_ENDIAN);

        let currentOffset = groupHeaderOffset + 4;
        data.forEach((entry) => {
            this.amountEncoder.wrap(this.buffer.buffer, currentOffset);
            this.amountEncoder.mantissa(entry.amount.mantissa);
            this.amountEncoder.exponent(entry.amount.exponent);
            currentOffset += DecimalEncoder.ENCODED_LENGTH;
            this.putString(currentOffset, entry.currency, 3);
            currentOffset += 3;
            this.secondaryAmountEncoder.wrap(this.buffer.buffer, currentOffset);
            this.secondaryAmountEncoder.mantissa(entry.secondaryAmount.mantissa);
            this.secondaryAmountEncoder.exponent(entry.secondaryAmount.exponent);
            currentOffset += DecimalEncoder.ENCODED_LENGTH;
            this.putString(currentOffset, entry.secondaryCurrency, 3);
            currentOffset += 3;
            this.putString(currentOffset, entry.valueDate, 8);
            currentOffset += 8;
            this.putString(currentOffset, entry.side, 4);
            currentOffset += 4;
            this.priceEncoder.wrap(this.buffer.buffer, currentOffset);
            this.priceEncoder.mantissa(entry.price.mantissa);
            this.priceEncoder.exponent(entry.price.exponent);
            currentOffset += DecimalEncoder.ENCODED_LENGTH;
        });
    }

    putString(offset, value, length) {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(value);
        for (let i = 0; i < length; i++) {
            this.buffer.setUint8(offset + i, i < bytes.length ? bytes[i] : 0);
        }
    }

}

export default TradeErrorEncoder;
