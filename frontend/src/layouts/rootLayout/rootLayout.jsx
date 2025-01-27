import { Outlet, Link } from 'react-router-dom'; // Import Link, Outlet
import './rootLayout.css'
const RootLayout=()=>{
    return(
        <div className='rootlayout'>
            <header>
                <div className="logo">
                    <img src="/logo.png" alt="" className='logo'/>
                    <span>React Chatbot</span>
                </div>
                <div className="user">User</div>
            </header>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}

export default RootLayout