import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, ChevronRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../sections/Header';
import Footer from '../sections/Footer';

export default function Contact() {
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 0);
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Our Office',
            details: 'B - 613, 6th floor, Suratwala Mark Plazzo, Hinjawadi Phase 1, Pimpri-Chinchwad, Maharashtra 411057',
            link: 'https://maps.google.com',
            color: '#8b5cf6'
        },
        {
            icon: Phone,
            title: 'Phone Number',
            details: '+91 8888806098',
            link: 'tel:+918888806098',
            color: '#06b6d4'
        },
        {
            icon: Mail,
            title: 'Email Address',
            details: 'skillbridge9@gmail.com',
            link: 'mailto:skillbridge9@gmail.com',
            color: '#8b5cf6'
        },
        {
            icon: Clock,
            title: 'Working Hours',
            details: 'Mon - Sat: 9:00 AM - 7:00 PM',
            link: null,
            color: '#06b6d4'
        }
    ];

    return (
        <div className="min-h-screen bg-[#f9f9f9]">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[#0f172a]">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8b5cf6]/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#06b6d4]/10 rounded-full blur-3xl animate-float-delayed" />

                <div className="container-custom relative z-10">
                    <div className="max-w-3xl">
                        <div
                            className="inline-flex items-center gap-2 px-3 py-1 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 rounded-full text-[#8b5cf6] text-xs font-medium mb-6 animate-fade-slide-up"
                            style={{ animationDelay: '100ms' }}
                        >
                            <MessageCircle className="w-3 h-3" />
                            Contact Us
                        </div>
                        <h1
                            className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-slide-up"
                            style={{ animationDelay: '200ms' }}
                        >
                            Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4]">Conversation</span>
                        </h1>
                        <p
                            className="text-white/70 text-lg md:text-xl leading-relaxed animate-fade-slide-up"
                            style={{ animationDelay: '300ms' }}
                        >
                            Have questions about our courses, placements, or mentorship? Our team is here to help you navigate your journey into tech.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-20 -mt-10">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-3 gap-12">

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div
                                className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-black/5 border border-black/5 relative overflow-hidden"
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                                    transition: 'all 0.8s var(--ease-expo-out)'
                                }}
                            >
                                {submitted ? (
                                    <div className="text-center py-12 animate-scale-pop">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Send className="w-10 h-10 text-green-600" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-black mb-4">Message Sent!</h2>
                                        <p className="text-[#333333]/70 mb-8 max-w-md mx-auto">
                                            Thank you for reaching out. Our team will get back to you within 24 hours.
                                        </p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="px-8 py-3 bg-[#8b5cf6] text-white rounded-full font-medium hover:bg-[#0f172a] transition-all duration-300"
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold text-black mb-8">Send us a Message</h2>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-black">Your Name</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/5 transition-all"
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-black">Email Address</label>
                                                    <input
                                                        required
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/5 transition-all"
                                                        placeholder="john@example.com"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-black">Subject</label>
                                                <select
                                                    value={formData.subject}
                                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/5 transition-all bg-white"
                                                >
                                                    <option value="">Select a subject</option>
                                                    <option value="Course Inquiry">Course Inquiry</option>
                                                    <option value="Placement Support">Placement Support</option>
                                                    <option value="Partnership">Partnership</option>
                                                    <option value="Technical Support">Technical Support</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-black">Message</label>
                                                <textarea
                                                    required
                                                    rows={6}
                                                    value={formData.message}
                                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/5 transition-all resize-none"
                                                    placeholder="How can we help you?"
                                                />
                                            </div>
                                            <button
                                                disabled={isSubmitting}
                                                className="btn-primary w-full md:w-auto min-w-[200px] flex items-center justify-center gap-2 group"
                                            >
                                                {isSubmitting ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        Send Message
                                                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Contact Info Cards */}
                        <div className="space-y-6">
                            {contactInfo.map((info, index) => {
                                const Icon = info.icon;
                                return (
                                    <div
                                        key={info.title}
                                        className="bg-white rounded-2xl p-6 border border-black/5 shadow-lg shadow-black/5 hover:-translate-y-1 transition-all duration-300"
                                        style={{
                                            opacity: isVisible ? 1 : 0,
                                            transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
                                            transition: 'all 0.8s var(--ease-expo-out)',
                                            transitionDelay: `${200 + index * 100}ms`
                                        }}
                                    >
                                        <div className="flex gap-4">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: `${info.color}15` }}
                                            >
                                                <Icon className="w-6 h-6" style={{ color: info.color }} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-black mb-1">{info.title}</h3>
                                                {info.link ? (
                                                    <a
                                                        href={info.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-[#333333]/70 hover:text-[#8b5cf6] transition-colors line-clamp-2 md:line-clamp-none"
                                                    >
                                                        {info.details}
                                                    </a>
                                                ) : (
                                                    <p className="text-sm text-[#333333]/70">{info.details}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Recruitment card */}
                            <div
                                className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl p-8 text-white relative overflow-hidden"
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
                                    transition: 'all 0.8s var(--ease-expo-out)',
                                    transitionDelay: '600ms'
                                }}
                            >
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-2">Hiring Partners</h3>
                                    <p className="text-white/70 text-sm mb-6">
                                        Looking to hire our top tech talent? Connect with our placement cell.
                                    </p>
                                    <Link
                                        to="/contact"
                                        className="inline-flex items-center gap-2 text-[#06b6d4] font-medium hover:translate-x-1 transition-transform"
                                    >
                                        Partner with us
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <Globe className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Map Section Wrapper */}
            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="rounded-3xl overflow-hidden border border-black/5 h-[400px] shadow-2xl relative bg-black/5 animate-pulse">
                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 text-[#333333]/40">
                            <MapPin className="w-12 h-12" />
                            <p className="font-medium">Interactive Map Loading...</p>
                        </div>
                        {/* Real Map Iframe (Optional, using a placeholder logic here) */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.2612040502206!2d73.74606707519266!3d18.573511482531634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bbc3696517a9%3A0xc6a89473d09e7c5!2sSuratwala%20Mark%20Plazzo!5e0!3m2!1sen!2sin!4v1706500000000!5m2!1sen!2sin"
                            className="w-full h-full border-0 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                            style={{ opacity: 1 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
