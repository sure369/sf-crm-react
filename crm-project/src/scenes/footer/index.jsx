import React from 'react'
import './footer.css'
import fb from '../assets/facebook.png'
import twitter from '../assets/twitter.png'
import linkedin from '../assets/linkedin.png'
import insta from '../assets/instagram.png' 

function FooterComponnet() {
    return (
        <div className='footer'>
            <div className='sb__footer section__padding'>
                <div className='sb_footer-links'>
                    <div className='sb__footer-links-div'>
                        <h4>For Businesses</h4>
                        <a href="/about">
                            <p>About</p>
                        </a>
                        <a href="/contact-us">
                            <p>contact us</p>
                        </a>
                    </div>
                    <div className='sb__footer-links_div'>
                        <h4>Resourcess</h4>
                        <a href="/about">
                            <p>Resource center</p>
                        </a>
                        <a href="/contact-us">
                            <p>contact us</p>
                        </a>
                    </div>
                    <div className='sb__footer-links_div'>
                        <h4>Coming soon on</h4>
                        <div className="socialmedia">
                            <p><img  src={fb} alt="" /></p>
                            <p><img  src={twitter} alt="" /></p>
                            <p><img  src={linkedin} alt="" /></p>
                            <p><img  src={insta} alt="" /></p>
                        </div>
                    </div>
                </div>
                <hr></hr>

                <div className='sb__footer-below'>
                    <div className='sb__footer-copyright'>
                            <p>
                                @{new Date().getFullYear()} codeInn. All right reserved.
                            </p>
                    </div>
                    <div className='"sb__footer-below-links'>
                        <a href="/terms"><div>Terms & condition</div></a>
                        <a href="/privarcy"><div>Privacy</div></a>                       
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FooterComponnet