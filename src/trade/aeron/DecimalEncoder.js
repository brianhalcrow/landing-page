class DecimalEncoder {
    static ENCODED_LENGTH = 9;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset;
        return this;
    }

    mantissa(value) {
        // This is a BigInt64 because the Java DecimalEncoder uses a setLong
        const bigIntValue = BigInt(value);
        this.buffer.setBigInt64(this.offset, bigIntValue, DecimalEncoder.LITTLE_ENDIAN);
        return this;
    }

    exponent(value) {
        this.buffer.setInt8(this.offset + 8, value);
        return this;
    }
}

export default DecimalEncoder;