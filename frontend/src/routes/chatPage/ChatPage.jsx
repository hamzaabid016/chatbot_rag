import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import './chatPage.css'
import { FileText, FileAudio, Download, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import NewPrompt from '../../components/newPrompt/NewPrompt';

const formatTimestamp = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
};

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const AudioPlayer = ({ audioUrl, fileName }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.addEventListener('loadedmetadata', () => {
                setDuration(audio.duration);
            });
            audio.addEventListener('timeupdate', () => {
                setCurrentTime(audio.currentTime);
            });
            audio.addEventListener('ended', () => {
                setIsPlaying(false);
                setCurrentTime(0);
            });
        }
        return () => {
            if (audio) {
                audio.removeEventListener('loadedmetadata', () => {});
                audio.removeEventListener('timeupdate', () => {});
                audio.removeEventListener('ended', () => {});
            }
        };
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeChange = (e) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    return (
        <div className="custom-audio-player">
            <audio ref={audioRef} src={audioUrl} preload="metadata" />
            <div className="audio-info">
                <FileAudio size={24} className="file-icon" />
                <span className="file-name">{fileName}</span>
            </div>
            <div className="audio-controls">
                <button className="play-button" onClick={togglePlay}>
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <div className="time-control">
                    <span className="time-display">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleTimeChange}
                        className="time-slider"
                    />
                    <span className="time-display">{formatTime(duration)}</span>
                </div>
                <div className="volume-control">
                    <button className="volume-button" onClick={toggleMute}>
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                        hidden
                    />
                </div>
            </div>
        </div>
    );
};

const FilePreview = ({ file, type }) => {
    const fileUrl = URL.createObjectURL(file);

    useEffect(() => {
        return () => URL.revokeObjectURL(fileUrl);
    }, [fileUrl]);

    if (type === 'image') {
        return (
            <div className="file-preview image-preview">
                <img src={fileUrl} alt="Uploaded content" className="message-image" />
                <a href={fileUrl} download={file.name} className="download-button">
                    <Download size={16} />
                </a>
            </div>
        );
    }

    if (type === 'pdf') {
        return (
            <div className="file-preview pdf-preview">
                <embed
                    src={fileUrl}
                    type="application/pdf"
                    width="100%"
                    height="400px"
                />
                <a href={fileUrl} download={file.name} className="download-button">
                    <Download size={16} />
                </a>
            </div>
        );
    }

    if (type === 'audio') {
        return (
            <div className="file-preview audio-preview">
                <AudioPlayer audioUrl={fileUrl} fileName={file.name} />
                <a href={fileUrl} download={file.name} className="download-button">
                    <Download size={16} />
                </a>
            </div>
        );
    }

    if (type === 'text' || type === 'document') {
        return (
            <div className="file-preview document-preview">
                <div className="document-container">
                    <FileText size={24} className="file-icon" />
                    <span className="file-name">{file.name}</span>
                </div>
                <a href={fileUrl} download={file.name} className="download-button">
                    <Download size={16} />
                </a>
            </div>
        );
    }

    return null;
};

const Message = ({ content, isBot, type = 'text', timestamp }) => {
    const getFileType = (file) => {
        if (file.type.startsWith('image/')) return 'image';
        if (file.type === 'application/pdf') return 'pdf';
        if (file.type.startsWith('audio/')) return 'audio';
        if (file.type === 'text/plain') return 'text';
        if (file.type.includes('document') || file.type.includes('msword')) return 'document';
        return 'unknown';
    };

    return (
        <div className={`message-container ${isBot ? 'bot' : 'user'}`}>
            <div className={`message ${isBot ? 'message-bot' : 'message-user'}`}>
                {type === 'file' ? (
                    <FilePreview file={content} type={getFileType(content)} />
                ) : (
                    <div className="message-content">
                        {isBot ? (
                            <ReactMarkdown 
                                className="markdown-content"
                                components={{
                                    p: ({ children }) => <p className="mb-4">{children}</p>,
                                    h1: ({ children }) => <h1 className="text-xl font-bold mb-4">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-lg font-bold mb-3">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-base font-bold mb-3">{children}</h3>,
                                    ul: ({ children }) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal ml-6 mb-4">{children}</ol>,
                                    li: ({ children }) => <li className="mb-2">{children}</li>,
                                    code: ({ node, inline, children }) => (
                                        inline ? 
                                            <code className="bg-gray-800 px-1 rounded">{children}</code> :
                                            <pre className="bg-gray-800 p-4 rounded-lg mb-4 overflow-x-auto">
                                                <code>{children}</code>
                                            </pre>
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-gray-500 pl-4 my-4">
                                            {children}
                                        </blockquote>
                                    ),
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        ) : (
                            content
                        )}
                    </div>
                )}
                <div className="message-timestamp">{formatTimestamp(timestamp)}</div>
            </div>
        </div>
    );
};

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleNewMessage = async (userInput) => {
        const { text, file } = userInput;
        const timestamp = new Date();
        
        if (file) {
            setMessages(prev => [...prev, { 
                content: file, 
                isBot: false, 
                type: 'file',
                timestamp
            }]);
        }

        const formData = new FormData();
        if (text) {
            formData.append('query', text);
            setMessages(prev => [...prev, { 
                content: text, 
                isBot: false,
                timestamp
            }]);
        }
        if (file) {
            formData.append('file', file);
        }
        formData.append('user_id', 'user123');
        formData.append('conversation_id', 'conv123');

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
            const botTimestamp = new Date();

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
                        newMessages.push({ 
                            content: botMessage, 
                            isBot: true,
                            timestamp: botTimestamp
                        });
                    }
                    return newMessages;
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { 
                content: "Sorry, there was an error processing your request.", 
                isBot: true,
                timestamp: new Date()
            }]);
        }
    };

    return (
        <div className="chatpage">
            <div className="wrapper">
                <div className="chat">
                    {messages.map((message, index) => (
                        <Message 
                            key={index}
                            content={message.content}
                            isBot={message.isBot}
                            type={message.type}
                            timestamp={message.timestamp}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                    <NewPrompt onSendMessage={handleNewMessage} />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;