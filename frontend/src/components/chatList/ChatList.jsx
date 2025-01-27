import {Link} from 'react-router-dom'
import './chatList.css'

const ChatList = ()=>{
    return(
        <div className="chatList">
            <span className='title'>DASHBOARD</span>
            <Link to="/">Create a new Chat </Link>
            <hr/>
            <span className='title'>RECENT CHATS</span>
            <div className="list">
                <Link to="/">My Chat no1 </Link>
                <Link to="/">My Chat no2 </Link>
                <Link to="/">My Chat no3 </Link>
                <Link to="/">My Chat no3 </Link>
                <Link to="/">My Chat no3 </Link>
                <Link to="/">My Chat no3 </Link>
                <Link to="/">My Chat no3 </Link>
                <Link to="/">My Chat no3 </Link>
                <Link to="/">My Chat no3 </Link>
                <Link to="/">My Chat no3 </Link>
                <Link to="/">My Chat no3 </Link>
                <Link to="/">My Chat no3 </Link>
                <Link to="/">My Chat no3 </Link>
                <Link to="/">My Chat no3 </Link>
                <Link to="/">My Chat no3 </Link>
                <Link to="/">My Chat no3 </Link>
                <Link to="/">My Chat no3 </Link>
                <Link to="/">My Chat no3 </Link>
                <Link to="/">My Chat no3 </Link>
                <Link to="/">My Chat no3 </Link>
            </div>
            <hr/>
        </div>
    )
}

export default ChatList