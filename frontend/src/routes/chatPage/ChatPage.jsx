import { useEffect, useRef } from 'react'
import './chatpage.css'
import NewPrompt from '../../components/newPrompt/NewPrompt';
const ChatPage=()=>{

    
    return(
        <div className='chatpage'>
            <div className="wrapper">
                <div className="chat">
                    <div className="message-bot">Message from Ai</div>
                    <div className="message-user">Message from User</div>
                    <div className="message-bot">Message from Ai</div>
                    <div className="message-user">Message from User</div>
                    <div className="message-bot">Message from Ai</div>
                    <div className="message-user">Message from User</div>
                    <div className="message-bot">Message from Ai</div>
                    <div className="message-user">Message from User</div>
                    <div className="message-bot">Message from Ai</div>
                    <div className="message-user">Message from User</div>
                    <div className="message-bot">Message from Ai</div>
                    <div className="message-user">Message from User</div>
                    <div className="message-bot">Message from Ai</div>
                    <div className="message-user">Message from User</div>
                    <div className="message-bot">Message from Ai</div>
                    <div className="message-user">Message from User</div>
                    <NewPrompt/>

                </div>
            </div>
        </div>
    )
}

export default ChatPage