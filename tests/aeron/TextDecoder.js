class TextDecoder {
    constructor() {}

    decode(buffer) {
        let result = '';
        const view = new Uint8Array(buffer);
        for (let i = 0; i < view.length; i++) {
            result += String.fromCharCode(view[i]);
        }
        return result;
    }
}

export default TextDecoder;
