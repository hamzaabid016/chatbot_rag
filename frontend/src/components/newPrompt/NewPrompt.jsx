import { useEffect, useRef, useState } from 'react';
import './newPrompt.css';
import { FileText, Image, FileAudio, FileIcon, X, Paperclip, Send, Mic } from 'lucide-react';

const NewPrompt = ({ onSendMessage }) => {
    const endRef = useRef(null);
    const textInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const recognitionRef = useRef(null);
    const lastTranscriptRef = useRef('');

    const allowedFileTypes = {
        'image/jpeg': { type: 'image', icon: Image },
        'image/png': { type: 'image', icon: Image },
        'image/gif': { type: 'image', icon: Image },
        'application/pdf': { type: 'pdf', icon: FileText },
        'text/plain': { type: 'text', icon: FileText },
        'application/msword': { type: 'doc', icon: FileText },
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { type: 'doc', icon: FileText },
        'audio/mpeg': { type: 'audio', icon: FileAudio },
        'audio/wav': { type: 'audio', icon: FileAudio },
        'audio/ogg': { type: 'audio', icon: FileAudio },
        'audio/mp3': { type: 'audio', icon: FileAudio }
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        if (selectedFile && allowedFileTypes[selectedFile.type]?.type === 'image') {
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreviewUrl(null);
    }, [selectedFile]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim() && !selectedFile) return;
        
        onSendMessage({
            text: inputValue.trim(),
            file: selectedFile
        });

        setInputValue('');
        setSelectedFile(null);
        setPreviewUrl(null);
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
        const fileConfig = allowedFileTypes[fileType];
        const IconComponent = fileConfig?.icon || FileIcon;
        return <IconComponent className="w-5 h-5" />;
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
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Speech recognition logic remains the same
    const toggleListening = () => {
        // ... existing speech recognition code ...
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="newPrompt">
            <div className="endChat" ref={endRef}></div>
            <form className="newForm" onSubmit={handleSubmit}>
                <label htmlFor="file" className="attachment-button">
                    <Paperclip className="w-4 h-4" />
                </label>
                <input 
                    id="file" 
                    type="file"
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
                                {previewUrl ? (
                                    <div className="image-preview">
                                        <img src={previewUrl} alt="Preview" />
                                        <div className="image-overlay">
                                            <span className="file-info">
                                                {selectedFile.name} ({formatFileSize(selectedFile.size)})
                                            </span>
                                            <button 
                                                type="button" 
                                                className="clear-file" 
                                                onClick={clearFile}
                                                aria-label="Remove file"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="document-preview">
                                        <div className="file-info">
                                            {getFileIcon(selectedFile.type)}
                                            <div className="file-details">
                                                <span className="file-name">{selectedFile.name}</span>
                                                <span className="file-size">{formatFileSize(selectedFile.size)}</span>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            className="clear-file" 
                                            onClick={clearFile}
                                            aria-label="Remove file"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        <textarea 
                            id="text" 
                            placeholder="Ask me anything..." 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            ref={textInputRef}
                            rows={1}
                            className="multiline-input"
                            style={{ 
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
                    aria-label={isListening ? 'Stop recording' : 'Start recording'}
                >
                    <Mic className="w-4 h-4" />
                </button>
                <button type="submit" aria-label="Send message">
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};

export default NewPrompt;