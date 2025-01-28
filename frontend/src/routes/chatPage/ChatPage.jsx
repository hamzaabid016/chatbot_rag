import { useEffect, useRef } from 'react'
import './chatPage.css'
import NewPrompt from '../../components/newPrompt/NewPrompt';

const Message = ({ content, isBot, type = 'text' }) => {
    if (type === 'file') {
        const isImage = content.type.startsWith('image/');
        const isPdf = content.type === 'application/pdf';
        
        return (
            <div className={isBot ? "message-bot" : "message-user"}>
                {isImage && (
                    <img 
                        src={URL.createObjectURL(content)} 
                        alt="Uploaded content"
                        className="message-image"
                    />
                )}
                {isPdf && (
                    <div className="pdf-preview">
                        <embed
                            src={URL.createObjectURL(content)}
                            type="application/pdf"
                            width="100%"
                            height="400px"
                        />
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <div className={isBot ? "message-bot" : "message-user"}>
            {content}
        </div>
    );
};

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const handleNewMessage = async (userInput) => {
        // Handle both text and file inputs
        const { text, file } = userInput;
        
        // If there's a file, add it to messages first
        if (file) {
            setMessages(prev => [...prev, { 
                content: file, 
                isBot: false, 
                type: 'file' 
            }]);
        }

        // If there's text or a file, create FormData for the API request
        const formData = new FormData();
        if (text) {
            formData.append('query', text);
            setMessages(prev => [...prev, { content: text, isBot: false }]);
        }
        if (file) {
            formData.append('file', file);
        }
        formData.append('user_id', 'user123'); // Replace with actual user ID
        formData.append('conversation_id', 'conv123'); // Replace with actual conversation ID

        try {
            const response = await fetch('http://localhost:8000/query-model', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botMessage = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                botMessage += chunk;
                
                setMessages(prev => {
                    const newMessages = [...prev];
                    if (newMessages[newMessages.length - 1]?.isBot) {
                        newMessages[newMessages.length - 1].content = botMessage;
                    } else {
                        newMessages.push({ content: botMessage, isBot: true });
                    }
                    return [...newMessages];
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { 
                content: "Sorry, there was an error processing your request.", 
                isBot: true 
            }]);
        }
    };

    return (
        <div className='chatpage'>
            <div className="wrapper">
                <div className="chat" ref={chatRef}>
                    {messages.map((message, index) => (
                        <Message 
                            key={index}
                            content={message.content}
                            isBot={message.isBot}
                            type={message.type}
                        />
                    ))}
                    <NewPrompt onSendMessage={handleNewMessage} />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
