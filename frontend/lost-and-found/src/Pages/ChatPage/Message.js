import React, { useEffect, useRef } from 'react';

const Message = ({ sender, message, timestamp, isOutgoing }) => {

    const messageClass = isOutgoing ? 'outgoing-message' : 'incoming-message';

    const ref = useRef();
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);


    return (
        <div ref={ref} className={`chat-message ${messageClass}`}>
            {isOutgoing && <div className="timestamp">{timestamp}</div>}
            <div className="sender-name">{sender}</div>
            <div className="message-text">{message}</div>
            {!isOutgoing && <div className="timestamp">{timestamp}</div>}
        </div>
    )
}

export default Message