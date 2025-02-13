class MessageHeaderDecoder {
    static ENCODED_LENGTH = 8;
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

    blockLength() {
        return this.buffer.getUint16(this.offset, MessageHeaderDecoder.LITTLE_ENDIAN);
    }

    templateId() {
        return this.buffer.getUint16(this.offset + 2, MessageHeaderDecoder.LITTLE_ENDIAN);
    }

    schemaId() {
        return this.buffer.getUint16(this.offset + 4, MessageHeaderDecoder.LITTLE_ENDIAN);
    }

    version() {
        return this.buffer.getUint16(this.offset + 6, MessageHeaderDecoder.LITTLE_ENDIAN);
    }

    toString() {
        return `messageHeaderDecoder(blockLength=${this.blockLength()}, templateId=${this.templateId()}, schemaId=${this.schemaId()}, version=${this.version()})`;
    }
}

export default MessageHeaderDecoder;