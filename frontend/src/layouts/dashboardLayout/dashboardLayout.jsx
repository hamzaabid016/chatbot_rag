import { Outlet, Link } from 'react-router-dom'; // Import Link, Outlet
import './dashboardLayout.css'
import ChatList from '../../components/chatList/ChatList.jsx';
const DashboardLayout=()=>{
    return(
        <div className='dashboardlayout'>
            <div className="menu"><ChatList /></div>
            <div className="content">
                <Outlet />
                <img src='/orbital.png' alt='' className='orbital' />
                
            </div>
        </div>
    )
}

export default DashboardLayout