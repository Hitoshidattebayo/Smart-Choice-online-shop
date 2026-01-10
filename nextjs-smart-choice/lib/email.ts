import nodemailer from 'nodemailer';

// Create reusable SMTP transporter
export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

// Verify SMTP connection configuration
export async function verifyEmailConfig() {
    try {
        await transporter.verify();
        console.log('✅ Email server is ready to send messages');
        return true;
    } catch (error) {
        console.error('❌ Email server configuration error:', error);
        return false;
    }
}

// Send email helper function
export async function sendEmail({
    to,
    subject,
    html,
    text,
}: {
    to: string;
    subject: string;
    html: string;
    text?: string;
}) {
    try {
        // Check if email is configured
        if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_USER) {
            console.warn('⚠️ Email not configured. Skipping email send.');
            return { success: false, error: 'Email not configured' };
        }

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER,
            to,
            subject,
            html,
            text: text || subject, // fallback to subject if no text provided
        });

        console.log('✅ Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        return { success: false, error };
    }
}
