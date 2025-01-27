import { useEffect, useRef, useState } from 'react';
import './newPrompt.css';

const NewPrompt = () => {
    const endRef = useRef(null);
    const textInputRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" });
    }, []);

    const toggleListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            if (isListening) {
                // Stop recording
                recognitionRef.current?.stop();
                setIsListening(false);
                return;
            }

            // Start new recording
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
                    
                if (textInputRef.current) {
                    textInputRef.current.value = transcript;
                }
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
            <form className='newForm'>
                <button 
                    type="button" 
                    onClick={toggleListening}
                    className={`mic-button ${isListening ? 'listening' : ''}`}
                >
                    <img src="/recorder.png" alt="Microphone" />
                </button>
                <label htmlFor='file'>
                    <img src='/attachment.png' alt='' />
                </label>
                <input id="file" type='file' multiple={false} hidden />
                <input 
                    id="text" 
                    type="text" 
                    placeholder='Ask me anything...' 
                    ref={textInputRef}
                />
                <button type="submit">
                    <img src="/arrow.png" alt="" />
                </button>
            </form>
        </div>
    );
};

export default NewPrompt;