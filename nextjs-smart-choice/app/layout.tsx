import type { Metadata } from "next";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Header from "../components/Header";
import { CartProvider } from "../context/CartContext";
import { Providers } from "../components/Providers";
import { DevIndicator } from "../components/DevIndicator";
import DraggableTurboToast from "../components/DraggableTurboToast";
import "./globals.css";

export const metadata: Metadata = {
    title: "Smart Choice | Your Online Shopping Destination",
    description: "Smart Choice - Premium products for the Mongolian market. Shop the best selection online.",
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <CartProvider>
                        <DevIndicator />
                        <DraggableTurboToast />
                        {/* Header */}
                        <Header />

                        {/* Main Content */}
                        <main>{children}</main>

                        {/* Footer */}
                        <footer className="footer">
                            <div className="container">
                                <div className="footer-content">
                                    {/* Column 1: Help */}
                                    <div className="footer-column">
                                        <h4>ТУСЛАМЖ</h4>
                                        <ul className="footer-links">
                                            <li><a href="#">FAQ</a></li>
                                            <li><a href="#">Хүргэлтийн мэдээлэл</a></li>
                                            <li><a href="#">Буцаалтын нөхцөл</a></li>
                                            <li><a href="#">Буцаалт хийх</a></li>
                                            <li><a href="#">Захиалгууд</a></li>
                                            <li><a href="#">Хуурамч бараа мэдээлэх</a></li>
                                        </ul>
                                    </div>

                                    {/* Column 2: My Account */}
                                    <div className="footer-column">
                                        <h4>МИНИЙ БҮРТГЭЛ</h4>
                                        <ul className="footer-links">
                                            <li><a href="/login">Нэвтрэх</a></li>
                                            <li><a href="/signup">Бүртгүүлэх</a></li>
                                        </ul>
                                    </div>

                                    {/* Column 3: Pages */}
                                    <div className="footer-column">
                                        <h4>ХУУДСУУД</h4>
                                        <ul className="footer-links">
                                            <li><a href="#">Smart Choice төв</a></li>
                                            <li><a href="#">Лоялти хөтөлбөр</a></li>
                                            <li><a href="#">Ажлын байр</a></li>
                                            <li><a href="/about">Бидний тухай</a></li>
                                            <li><a href="#">Оюутны хямдрал</a></li>
                                            <li><a href="#">Аппликейшн</a></li>
                                            <li><a href="#">Үйлдвэрүүд</a></li>
                                        </ul>
                                    </div>

                                    {/* Column 4: More About */}
                                    <div className="footer-column footer-column-wide">
                                        <h4>МӨН СОНИРХОХ</h4>
                                        <div className="footer-promo-grid">
                                            <a href="#" className="footer-promo-card">
                                                <div className="footer-promo-img flex-center bg-black text-white" style={{ height: '100px', fontWeight: 'bold' }}>
                                                    SMART CHOICE BLOG
                                                </div>
                                                <div className="footer-promo-text">БЛОГ</div>
                                            </a>
                                            <a href="#" className="footer-promo-card">
                                                <div className="footer-promo-img flex-center bg-black text-white" style={{ height: '100px', fontWeight: 'bold' }}>
                                                    STUDENTS
                                                </div>
                                                <div className="footer-promo-text">15% ОЮУТНЫ ХЯМДРАЛ</div>
                                            </a>
                                            <a href="#" className="footer-promo-card">
                                                <div className="footer-promo-img flex-center bg-black text-white" style={{ height: '100px' }}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                                </div>
                                                <div className="footer-promo-text">ИМЭЙЛ БҮРТГҮҮЛЭХ</div>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Middle: Payments & Socials */}
                                <div className="footer-middle">
                                    <div className="footer-payments">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" />
                                        <div className="qpay-icon">QPay</div>
                                    </div>
                                    <div className="footer-socials">
                                        <a href="#" aria-label="Discord">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" /></svg>
                                        </a>
                                        <a href="#" aria-label="Facebook">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-1.127 0-2.703.432-2.703 1.865v2.113h4.32l-.252 3.667h-4.068v7.98h-4.378z" /></svg>
                                        </a>
                                        <a href="#" aria-label="Instagram">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                                        </a>
                                        <a href="#" aria-label="YouTube">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                        </a>
                                    </div>
                                </div>

                                {/* Footer Bottom */}
                                <div className="footer-bottom">
                                    <div className="footer-copyright">
                                        &copy; {new Date().getFullYear()} Smart Choice Limited | Бүх эрх хуулиар хамгаалагдсан. | Таны ухаалаг худалдан авалтын гүүр.
                                    </div>
                                    <div className="footer-bottom-links">
                                        <a href="#">Үйлчилгээний нөхцөл</a>
                                        <a href="#">Нууцлалын бодлого</a>
                                        <a href="#">Cookie бодлого</a>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </CartProvider>
                </Providers>
            </body>
        </html>
    );
}
