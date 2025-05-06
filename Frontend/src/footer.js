import React from 'react';
import './CSS/Footer.css';
import logo from './images/logo.jpg';

const footer = () => {

	return (
		<div>
			<footer>
				<div className="frow">

					<div className="fcol">
						<img src={logo} className="flogo" alt='company logo' />
						<p> Tryfit is a retail establishment that specialization
							is selling a variety of products related to cloth needs. </p>
					</div>

					<div className="fcol">
						<h3>Office</h3>
						<p className="fp">Colombo </p>
						<p className="fp">Virtual sri lanka </p>
						<p className="fp">Sri Lanaka </p>
						<p className="email-id">virtualdressing@gmail.com </p>
						<h4>+94-71879557 </h4>
					</div>
					<div className="fcol">
						<h3>Links</h3>
						<ul>
							<li> <a href="#">Home </a></li>
							<li> <a href="#">Services </a></li>
							<li> <a href="#">About Us </a></li>
							<li> <a href="#">Features </a></li>
							<li> <a href="#">Contacts </a></li>
						</ul>

					</div>

					<div className="fcol">
						<h3>Newsletter</h3>
						<form>
							<i className="fa-regular fa-envelope fa-2xl"></i>
							<input type="email" placeholder="Enter your email id" />
							<button type="submit"><i className="fa-solid fa-paper-plane fa-lg"></i></button>
						</form>
					</div>

				</div>
			</footer>
		</div>

	);
};

export default footer;
