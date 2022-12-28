import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div class="footer-section mt-5">
            <div class="footer-bottom">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="footer-bottom-content text-center">
                                <p>&copy; 2023 <Link to="/">Mingle</Link> -Best Dating Website.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;