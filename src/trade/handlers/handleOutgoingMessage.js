const handleOutgoingMessage = (socketRef) => {
    const sendMessage = (data) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            console.log('Outgoing data: ', data);
            socketRef.current.send(data);
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
    };

    return sendMessage;
};

export default handleOutgoingMessage;

