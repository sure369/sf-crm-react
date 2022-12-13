import React, { useState } from 'react';
import './Navbar.css';

import {Link} from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';

function Navbar() {
   
    const [showMediaIcons,setShowMediaIcons] =useState(false);

  

      
  return (
    <>
        <nav className='main-nav'>
            <div className='logo'>
                <h2>
                       Clouddesk
                   
                </h2>
            </div>
            <div
                className={showMediaIcons ? " mobile-menu-link" : "menu-link"} 
            >
                {/* style={{ color: 'blue', lineHeight : 10, padding: 20 }} */}
                <ul>
                    <Link to='/' className='home'>
                        <li> Home </li>
                    </Link>
                    <Link to='/leads' className='leads'>
                        <li> Leads </li>
                    </Link>
                    <Link to='/opportunities' className='opportunities'>
                        <li> Opportunities </li>
                    </Link>
                    <Link to='/inventories' className='inventories'>
                        <li> Inventories </li>
                    </Link>
                    <Link to='/accounts' className='accounts'>
                        <li> Accounts </li>
                    </Link>
                    <Link to='/contacts' className='contacts'>
                        <li> Contacts </li>
                    </Link>
                   
                    <Link to='/users' className='users'>
                        <li> Users </li>
                    </Link>
                </ul>
            </div>
            {/* 3rd social media links */}
            <div className='social-media'>
                {/* <ul className='social-media-desktop'>
                    <li>
                        <a href='https://www.youtube.com/' target="_youtube"> 
                            <YouTubeIcon className='youtube'/>
                        </a>
                    </li>
                    <li>
                        <a href='https://www.facebook.com/' target="-facebook"> 
                             <FacebookIcon className='facebook'/>
                        </a>
                    </li>
                    <li>
                        <a href='https://www.instagram.com/' target="-insta">
                            <InstagramIcon className='instagram'/>
                            </a>
                    </li>
                </ul> */}
                    {/* hamburget menu start */}
                    <div className='hamburger-menu'>
                       
                            <MenuIcon onClick={()=>setShowMediaIcons(!showMediaIcons)}/>

                    </div>
            </div>
            </nav>

          
          
        
    </>

  )
}

export default Navbar