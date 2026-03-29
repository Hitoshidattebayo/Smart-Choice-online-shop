'use client';

export default function ContactPage() {
    return (
        <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Холбоо барих</h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>
                Бидэнтэй холбогдохыг хүсвэл доорх мэдээллийг ашиглана уу.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <a href="mailto:mnsmartchoice@gmail.com" style={{ color: '#000', textDecoration: 'underline' }}>mnsmartchoice@gmail.com</a>
                <a href="tel:+97695579271" style={{ color: '#000', textDecoration: 'none' }}>+976 9557 9271</a>
            </div>
        </div>
    );
}
