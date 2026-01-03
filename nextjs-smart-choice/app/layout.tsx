import type { Metadata } from "next";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Header from "../components/Header";
import { CartProvider } from "../context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
    title: "Smart Choice | Your Online Shopping Destination",
    description: "Smart Choice - Premium products for the Mongolian market. Shop the best selection online.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <CartProvider>
                    {/* Header */}
                    <Header />

                    {/* Main Content */}
                    <main>{children}</main>

                    {/* Footer */}
                    <footer className="footer">
                        <div className="container">
                            <div className="footer-content">
                                {/* Shop Column */}
                                <div className="footer-column">
                                    <h4>Shop</h4>
                                    <ul className="footer-links">
                                        <li><a href="#">All Products</a></li>
                                        <li><a href="#">Best Sellers</a></li>
                                        <li><a href="#">Active QX</a></li>
                                        <li><a href="#">Artisanal Collection</a></li>
                                        <li><a href="#">Kids Sneakers</a></li>
                                        <li><a href="#">New Arrivals</a></li>
                                    </ul>
                                </div>

                                {/* Policies Column */}
                                <div className="footer-column">
                                    <h4>Policies</h4>
                                    <ul className="footer-links">
                                        <li><a href="#">Privacy Policy</a></li>
                                        <li><a href="#">Terms of Service</a></li>
                                        <li><a href="#">Shipping Policy</a></li>
                                        <li><a href="#">Return Policy</a></li>
                                        <li><a href="#">Warranty</a></li>
                                    </ul>
                                </div>

                                {/* Contact Column */}
                                <div className="footer-column">
                                    <h4>Contact</h4>
                                    <ul className="footer-links">
                                        <li>123 Market Street</li>
                                        <li>San Francisco, CA 94103</li>
                                        <li>United States</li>
                                        <li><a href="mailto:hello@quenx.com">hello@quenx.com</a></li>
                                        <li><a href="tel:+14155551234">+1 (415) 555-1234</a></li>
                                    </ul>
                                </div>

                                {/* Newsletter Column */}
                                <div className="footer-column">
                                    <h4>Stay in the Loop</h4>
                                    <p className="newsletter-description">
                                        Subscribe to our newsletter for exclusive offers and updates.
                                    </p>
                                    <form className="newsletter-form">
                                        <input
                                            type="email"
                                            placeholder="Your email"
                                            className="newsletter-input"
                                            required
                                        />
                                        <button type="submit" className="newsletter-btn">
                                            Subscribe
                                        </button>
                                    </form>

                                    {/* Social Media */}
                                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                        <a href="#" className="icon-btn" title="Facebook" style={{ color: '#a0a0a0' }}>
                                            <Facebook size={18} />
                                        </a>
                                        <a href="#" className="icon-btn" title="Instagram" style={{ color: '#a0a0a0' }}>
                                            <Instagram size={18} />
                                        </a>
                                        <a href="#" className="icon-btn" title="Twitter" style={{ color: '#a0a0a0' }}>
                                            <Twitter size={18} />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Bottom */}
                            <div className="footer-bottom">
                                <p>&copy; 2026 Smart Choice. All rights reserved.</p>
                                <p>Your Online Shopping Destination</p>
                            </div>
                        </div>
                    </footer>
                </CartProvider>
            </body>
        </html>
    );
}
