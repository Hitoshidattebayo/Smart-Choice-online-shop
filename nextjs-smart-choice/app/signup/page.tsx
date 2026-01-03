'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        setIsLoading(true);

        // TODO: Implement actual signup logic
        console.log('Signup attempt with:', formData);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert('Signup functionality will be implemented with backend');
        }, 1000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            padding: '2rem 1rem'
        }}>
            <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '450px',
                padding: '3rem 2.5rem'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="Smart Choice"
                            width={180}
                            height={60}
                            style={{ height: 'auto', maxHeight: '50px', width: 'auto', margin: '0 auto' }}
                        />
                    </Link>
                </div>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        color: '#1a1a1a'
                    }}>
                        Create Account
                    </h1>
                    <p style={{ color: '#666', fontSize: '15px' }}>
                        Join Smart Choice today
                    </p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333'
                        }}>
                            Full Name
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#999'
                            }} />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="John Doe"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 14px 12px 44px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#000'}
                                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333'
                        }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#999'
                            }} />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="you@example.com"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 14px 12px 44px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#000'}
                                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333'
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#999'
                            }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={8}
                                style={{
                                    width: '100%',
                                    padding: '12px 44px 12px 44px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#000'}
                                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#999',
                                    padding: '4px'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333'
                        }}>
                            Confirm Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#999'
                            }} />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 44px 12px 44px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#000'}
                                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#999',
                                    padding: '4px'
                                }}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: isLoading ? '#666' : '#000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s',
                            marginBottom: '1.5rem'
                        }}
                        onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#333')}
                        onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#000')}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    {/* Terms */}
                    <p style={{
                        fontSize: '13px',
                        color: '#999',
                        textAlign: 'center',
                        marginBottom: '1.5rem',
                        lineHeight: 1.5
                    }}>
                        By signing up, you agree to our{' '}
                        <a href="#" style={{ color: '#666', textDecoration: 'underline' }}>Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" style={{ color: '#666', textDecoration: 'underline' }}>Privacy Policy</a>
                    </p>
                </form>

                {/* Divider */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '1.5rem 0',
                    gap: '1rem'
                }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }} />
                    <span style={{ color: '#999', fontSize: '14px' }}>or</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }} />
                </div>

                {/* Login Link */}
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '15px', color: '#666' }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{
                            color: '#000',
                            fontWeight: '600',
                            textDecoration: 'none'
                        }}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
