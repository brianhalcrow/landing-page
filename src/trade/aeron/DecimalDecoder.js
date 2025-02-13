class DecimalDecoder {
    static ENCODED_LENGTH = 9;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.offset = 0;
        this.buffer = null;
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset;
        return this;
    }

    mantissa() {
        // This is a BigInt64 because the Java DecimalDencoder uses a getLong
        return this.buffer.getBigInt64(this.offset, DecimalDecoder.LITTLE_ENDIAN);
    }

    exponent() {
        return this.buffer.getInt8(this.offset + 8);
    }

    toString() {
        return `mantissa=${this.mantissa()}, exponent=${this.exponent()}`;
    }
}

export default DecimalDecoder;