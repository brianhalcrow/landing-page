class MessageHeaderEncoder {
    static ENCODED_LENGTH = 8;
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

    blockLength(value) {
        this.buffer.setUint16(this.offset, value, MessageHeaderEncoder.LITTLE_ENDIAN);
        return this;
    }

    templateId(value) {
        this.buffer.setUint16(this.offset + 2, value, MessageHeaderEncoder.LITTLE_ENDIAN);
        return this;
    }

    schemaId(value) {
        this.buffer.setUint16(this.offset + 4, value, MessageHeaderEncoder.LITTLE_ENDIAN);
        return this;
    }

    version(value) {
        this.buffer.setUint16(this.offset + 6, value, MessageHeaderEncoder.LITTLE_ENDIAN);
        return this;
    }
}

export default MessageHeaderEncoder;