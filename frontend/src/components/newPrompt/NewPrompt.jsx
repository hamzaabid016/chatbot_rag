import { useEffect, useRef, useState } from 'react';
import './newPrompt.css';

const NewPrompt = ({ onSendMessage }) => {
    const endRef = useRef(null);
    const textInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const recognitionRef = useRef(null);

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

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
            if (allowedTypes.includes(file.type)) {
                setSelectedFile(file);
                setInputValue(''); // Clear text input when file is selected
            } else {
                alert('Please select an image (JPEG, PNG, GIF) or PDF file');
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
                setIsListening(false);
                return;
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join(' ');
                setInputValue(transcript);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
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
                    accept="image/*,.pdf"
                    multiple={false} 
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                />
                <div className="input-container">
                    {selectedFile ? (
                        <>
                            {selectedFile.type.startsWith('image/') ? (
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
                                <div className="pdf-preview">
                                    <span className="pdf-name">{selectedFile.name}</span>
                                    <button 
                                        type="button" 
                                        className="clear-file" 
                                        onClick={clearFile}
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <input 
                            id="text" 
                            type="text" 
                            placeholder='Ask me anything...' 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            ref={textInputRef}
                        />
                    )}
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