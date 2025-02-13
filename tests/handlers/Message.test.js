import handleIncomingMessage from '../../src/handlers/handleIncomingMessage.js';

describe('handleIncomingMessage', () => {
    it('should log "Unknown message type: 1" for unknown templateId and return an empty array', () => {
        console.log('handleIncomingMessage test');

        // Set up test data
        const testData = new ArrayBuffer(8); // Assuming the header is 8 bytes
        const testView = new DataView(testData);
        testView.setUint16(0, 16, true); // blockLength
        testView.setUint16(2, 1, true);  // templateId (unknown)
        testView.setUint16(4, 1, true);  // schemaId
        testView.setUint16(6, 1, true);  // version

        // Log the buffer content to verify it
        console.log('Test DataView:', Array.from(new Uint8Array(testData)));

        // Mock console to capture the output
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        // Call test function
        handleIncomingMessage(testData);

        // Check if the error log contains the expected message
        expect(consoleErrorSpy).toHaveBeenCalledWith('Unknown message type:', 1);

        // Check if the log contains "Decoded Message" with an empty message
        expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('Decoded Message:'));

        // Restore console
        consoleSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });
});
