import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {NavLink, useLocation} from 'react-router-dom'
import { handleSidebar } from '../../../redux/AdminDataSlice'
import { hanldeStatusActive } from '../../../redux/ServiceDataSlice'

const Sidebar = () => {

    const location = useLocation()
    const dispatch = useDispatch()
    const [active, setActive] = useState('/')

    const itemActive = useSelector(state => state.ServiceDataSlice.itemActive)

    useEffect(()=>{
        setActive(location.pathname)
    }, [location])

    const closeSidebar = () => {
        document.getElementById('cs-sidebar').classList.remove('show-sidebar')
        dispatch(handleSidebar(false))
    }

  return (
    <>
        <aside id='cs-sidebar' className="background-white cs-sidebar">
                <div className="sidebar">
                <NavLink onClick={closeSidebar} to='/'>
                    <div className="logo">
                        <img src="assets/img/logo.svg" />
                    </div>
                </NavLink>
                <div className="menu">
                    <ul>
                    <li className={active === '/' && 'active'}>
                        <NavLink onClick={closeSidebar} to="/">
                        <img src="assets/img/m-1.svg" />
                        Dashboard
                        </NavLink>
                    </li>
                    <li className={active === '/customer-list' && 'active'}>
                        <NavLink onClick={closeSidebar} to="/customer-list">
                        <img src="assets/img/list.png" />
                        Customer List
                        </NavLink>
                    </li>
                    <li className={active === '/proposal' && 'active'}>
                        <NavLink onClick={closeSidebar} to="/proposal">
                        <img src="assets/img/file.svg" />
                        Proposal
                        </NavLink>
                    </li>
                    <li className={active === '/services' && 'active'}>
                        <NavLink onClick={closeSidebar} to="/services">
                        <img src="assets/img/service.svg" />
                        Services
                        </NavLink>
                    </li>
                    <li className={active === '/schedule' && 'active'}>
                        <NavLink onClick={closeSidebar} to="/schedule">
                        <img src="assets/img/schedule.svg" />
                        Schedule
                        </NavLink>
                    </li>
                    <li className={active === '/calendar' && 'active'}>
                        <NavLink onClick={closeSidebar} to="/calendar">
                        <img src="assets/img/schedule.svg" />
                        Calender
                        </NavLink>
                    </li>
                    <li className={active === '/active-overview' && 'active'}>
                        <NavLink className='message-tag' onClick={()=>{closeSidebar(), dispatch(hanldeStatusActive(false))}} to="/active-overview">
                        <img src="assets/img/active.svg" />
                        Active Overview
                        {itemActive && <div className="cs-status status-bg-active"></div>}
                        </NavLink>
                    </li>
                    </ul>
                    <ul className="other-menu">
                    <li className={active === '/setting' && 'active'}>
                        <NavLink onClick={closeSidebar} to="/setting">
                        <img src="assets/img/setting.svg" />
                        Settings
                        </NavLink>
                    </li>
                    <li className={active === '/profile' && 'active'}>
                        <NavLink onClick={closeSidebar} to="/profile">
                        <img src="assets/img/profile.svg" />
                        My Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink onClick={closeSidebar} to="/logout">
                        <img src="assets/img/logout.svg" />
                        Logout
                        </NavLink>
                    </li>
                    </ul>
                </div>
                </div>
            </aside>

    </>
  )
}

export default Sidebar