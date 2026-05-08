import { useState } from 'react';
import { Award, Heart, Users, Target, BookOpen, Tag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  const values = [
    { icon: <Award size={24} style={{ color: '#3b82f6' }} />, label: 'Excellence', bg: '#eff6ff' },
    { icon: <Heart size={24} style={{ color: '#ef4444' }} />, label: 'Service', bg: '#fef2f2' },
    { icon: <Users size={24} style={{ color: '#22c55e' }} />, label: 'Community', bg: '#f0fdf4' },
    { icon: <Target size={24} style={{ color: '#f5c518' }} />, label: 'Integrity', bg: '#fffbeb' },
  ];

  const offerings = [
    { icon: <span style={{ fontSize: '2rem' }}>👕</span>, title: 'Uniforms', desc: 'Official QCU uniforms, PE attire, and department-specific clothing at competitive prices.' },
    { icon: <BookOpen size={32} style={{ color: '#22c55e' }} />, title: 'School Supplies', desc: 'Notebooks, pens, folders, art materials, and all academic essentials.' },
    { icon: <Tag size={32} style={{ color: '#f5c518' }} />, title: 'ID & Lanyards', desc: 'ID card holders, lanyards, and personalized accessories for QCU students.' },
  ];

  const partners = [
    { name: 'Logo 1', image: '/logo1.png' },
    { name: 'Logo 2', image: '/logo2.png' },
    { name: 'Logo 3', image: '/logo3.png' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        position: 'relative', padding: '80px 20px', textAlign: 'center',
        background: 'linear-gradient(135deg, #0f1e3d 0%, #1a2e5a 100%)', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/QCU_shots_2.png)',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12,
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: 'white', fontWeight: '800', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', marginBottom: '12px' }}>
            About QCU Cooperative
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
            Serving the Quezon City University community since 1994
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: <Target size={28} style={{ color: 'white' }} />,
              iconBg: '#1a2e5a',
              title: 'Our Mission',
              text: 'To provide quality, affordable school supplies, uniforms, and accessories to QCU students, faculty, and staff — promoting a cooperative spirit of service and community within the university.',
            },
            {
              icon: <Heart size={28} style={{ color: 'white' }} />,
              iconBg: '#f5c518',
              title: 'Our Vision',
              text: 'To become the trusted go-to destination for all student needs at QCU, known for quality, affordability, and outstanding customer service.',
            },
          ].map(sec => (
            <div key={sec.title} style={{ padding: '32px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ width: '56px', height: '56px', background: sec.iconBg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                {sec.icon}
              </div>
              <h3 style={{ color: '#1a2e5a', fontWeight: '700', fontSize: '1.375rem', marginBottom: '12px' }}>{sec.title}</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.7', margin: 0 }}>{sec.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section style={{ background: '#f8fafc', padding: '60px 20px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h2 style={{ color: '#1a2e5a', fontWeight: '800', fontSize: '1.875rem', textAlign: 'center', marginBottom: '12px' }}>Our Core Values</h2>
          <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '40px' }}>The principles guiding every decision we make</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {values.map(v => (
              <div key={v.label} style={{ background: v.bg, padding: '24px 16px', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>{v.icon}</div>
                <p style={{ color: '#1a2e5a', fontWeight: '700', margin: 0 }}>{v.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <h2 style={{ color: '#1a2e5a', fontWeight: '800', fontSize: '1.875rem', textAlign: 'center', marginBottom: '40px' }}>What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offerings.map(offer => (
            <div key={offer.title} style={{ background: 'white', padding: '32px 24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>{offer.icon}</div>
              <h3 style={{ color: '#1a2e5a', fontWeight: '700', fontSize: '1.125rem', marginBottom: '8px' }}>{offer.title}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>{offer.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}