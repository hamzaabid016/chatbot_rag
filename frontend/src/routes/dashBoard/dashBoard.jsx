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
                        <img src="/chat.png" alt="" />
                        <span>Create a new Chat</span>
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
            <div className="formContainer">
                <form>
                    <input type="text" placeholder='Ask me anything...' />
                    <button>
                        <img src="/arrow.png" alt="" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default DashBoard