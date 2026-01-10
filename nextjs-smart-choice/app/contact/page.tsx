'use client';

export default function ContactPage() {
    return (
        <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Холбоо барих</h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>
                Бидэнтэй холбогдохыг хүсвэл доорх мэдээллийг ашиглана уу.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <a href="mailto:info@smartchoice.mn" style={{ color: '#000', textDecoration: 'underline' }}>info@smartchoice.mn</a>
                <a href="tel:+97600000000" style={{ color: '#000', textDecoration: 'none' }}>+976 0000 0000</a>
            </div>
        </div>
    );
}
