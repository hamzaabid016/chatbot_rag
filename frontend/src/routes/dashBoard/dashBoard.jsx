import {Link} from 'react-router-dom'
import './dashBoard.css'
const DashBoard=()=>{
    return(
        <div className='dashboard'>
            <div className="texts">
                <div className="logo">
                    <img src="/logo.png" alt="" />
                    <h1>AI CHAT BOT</h1>
                </div>
                <div className="options">
                    <div className="option">
                        <img src="/file-upload.png" alt="" />
                        <span>Upload a file</span>
                    </div>
                    <div className="option">
                        <img src="/image.png" alt="" />
                        <span>Analyze an image</span>
                    </div>
                    <div className="option">
                        <img src="/mike.png" alt="" />
                        <span>Analyze an audio</span>
                    </div>
                </div>
            </div>
            <Link to="/chats/chatId">Get Started!</Link>
        </div>
    )
}

export default DashBoard