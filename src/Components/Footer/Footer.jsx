import React from 'react'
import './Footer.css'
import { Link } from 'react-router';
import footer_logo from '../Assets/logo_big.png'
import instagram_icon from '../Assets/instagram_icon.png'
import pintester_icon from '../Assets/pintester_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'

const Footer = () => {
  return (
    <div className='footer'>
        <div className="footer-logo">
            <img src={footer_logo} alt="" />
            <p>Dapur Bunda Bahagia</p>
        </div>
        <ul className="footer-links">
            <a href='https://maps.app.goo.gl/dzYeqt6JWnb2d7Hf7' target='blank'><li>Location</li></a>
            <li><Link style={{textDecoration: 'none'}} to='/about'>About</Link></li>
        </ul>
        <div className="footer-social-icon">
            <div className="footer-icons-container">
                <a href='https://www.instagram.com/rhd2414/' target='blank'><img src={instagram_icon} alt="" /></a>
            </div>
            <div className="footer-icons-container">
                <a href='https://api.whatsapp.com/send?phone=6281294374591' target='blank'><img src={whatsapp_icon} alt="" /></a>
            </div>
        </div>
        <div className="footer-copyright">
            <hr />
            <p>Copyright @ 2025 - All Right Reserved</p>
        </div>
    </div>
  )
}

export default Footer