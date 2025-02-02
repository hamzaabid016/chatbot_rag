import { useEffect, useRef, useState } from 'react';
import './newPrompt.css';
import { FileText, Image, FileAudio, FileIcon } from 'lucide-react';

const NewPrompt = ({ onSendMessage }) => {
    const endRef = useRef(null);
    const textInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const recognitionRef = useRef(null);
    const lastTranscriptRef = useRef('');

    const allowedFileTypes = {
        'image/jpeg': 'image',
        'image/png': 'image',
        'image/gif': 'image',
        'application/pdf': 'pdf',
        'text/plain': 'text',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'doc',
        'audio/mpeg': 'audio',
        'audio/wav': 'audio',
        'audio/ogg': 'audio',
        'audio/mp3': 'audio'
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim() && !selectedFile) return;
        
        onSendMessage({
            text: inputValue.trim(),
            file: selectedFile
        });

        setInputValue('');
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const getFileIcon = (fileType) => {
        const type = allowedFileTypes[fileType];
        const iconProps = { className: "w-4 h-4", color: "#ececec" };
        switch (type) {
            case 'image':
                return <Image {...iconProps} />;
            case 'text':
                return <FileText {...iconProps} />;
            case 'audio':
                return <FileAudio {...iconProps} />;
            default:
                return <FileIcon {...iconProps} />;
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (allowedFileTypes.hasOwnProperty(file.type)) {
                setSelectedFile(file);
            } else {
                alert('Please select a valid file (Image, PDF, Text, Doc, or Audio file)');
                e.target.value = '';
            }
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const toggleListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            if (isListening) {
                recognitionRef.current?.stop();
                return;
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
                lastTranscriptRef.current = '';
            };

            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join(' ');
                setInputValue(transcript);
                lastTranscriptRef.current = transcript;
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
                if (lastTranscriptRef.current.trim()) {
                    setTimeout(() => {
                        onSendMessage({
                            text: lastTranscriptRef.current.trim(),
                            file: selectedFile
                        });
                        setInputValue('');
                        lastTranscriptRef.current = '';
                        setSelectedFile(null);
                    }, 100);
                }
            };

            recognitionRef.current = recognition;
            recognition.start();
        } else {
            alert('Speech recognition is not supported in this browser.');
        }
    };

    return (
        <div className="newPrompt">
            <div className="endChat" ref={endRef}></div>
            <form className='newForm' onSubmit={handleSubmit}>
                <label htmlFor='file'>
                    <img src='/attachment.png' alt='' />
                </label>
                <input 
                    id="file" 
                    type='file'
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.txt,.doc,.docx,.mp3,.wav,.ogg"
                    multiple={false} 
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                />
                <div className="input-container">
                    <div className="content-wrapper">
                        {selectedFile && (
                            <div className="file-preview">
                                {allowedFileTypes[selectedFile.type] === 'image' ? (
                                    <div className="image-preview">
                                        <img 
                                            src={URL.createObjectURL(selectedFile)} 
                                            alt="Preview" 
                                        />
                                        <button 
                                            type="button" 
                                            className="clear-file" 
                                            onClick={clearFile}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <div className="document-preview">
                                        <div className="file-info">
                                            {getFileIcon(selectedFile.type)}
                                            <span className="file-name">{selectedFile.name}</span>
                                        </div>
                                        <button 
                                            type="button" 
                                            className="clear-file" 
                                            onClick={clearFile}
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        <textarea 
                            id="text" 
                            placeholder='Ask me anything...' 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            ref={textInputRef}
                            rows={1}
                            className="multiline-input"
                            style={{ 
                                resize: 'none',
                                height: 'auto',
                                minHeight: '24px',
                                maxHeight: '150px'
                            }}
                        />
                    </div>
                </div>
                <button 
                    type="button" 
                    onClick={toggleListening}
                    className={`mic-button ${isListening ? 'listening' : ''}`}
                >
                    <img src="/recorder.png" alt="Microphone" />
                </button>
                <button type="submit">
                    <img src="/arrow.png" alt="" />
                </button>
            </form>
        </div>
    );
};

export default NewPrompt;