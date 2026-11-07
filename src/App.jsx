import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PopularTemplates from './components/PopularTemplates';
import FeaturesBar from './components/FeaturesBar';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import TemplateEditor from './components/Editor/TemplateEditor';
import AdminPanel from './components/Admin/AdminPanel';
import DemoPreviewModal from './components/DemoPreviewModal';
import MyDesignsModal from './components/User/MyDesignsModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import ContactSection from './components/ContactSection';

export default function App() {
  const { user, token, openLogin, fetchWithAuth } = useAuth();

  const [currentView, setCurrentView] = useState('home'); // 'home' | 'editor' | 'admin'
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingDesign, setEditingDesign] = useState(null);
  
  // Modals
  const [demoTemplate, setDemoTemplate] = useState(null);
  const [myDesignsOpen, setMyDesignsOpen] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchTemplates();
    if (token) {
      fetchCartAndDesignsCount();
    }
  }, [token]);

  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const res = await fetch('/api/templates');
      const data = await res.json();
      if (data.success && data.templates) {
        setTemplates(data.templates);
      }
    } catch (err) {
      console.error('Failed to fetch templates', err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const fetchCartAndDesignsCount = async () => {
    try {
      const res = await fetchWithAuth('/api/designs');
      const data = await res.json();
      if (data.success && data.designs) {
        setCartCount(data.designs.length);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplate(tpl);
    setEditingDesign(null);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditSavedDesign = (design) => {
    const parentTpl = templates.find(t => t.id === design.template_id) || templates[0];
    setSelectedTemplate(parentTpl);
    setEditingDesign(design);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrder = async (template) => {
    if (!token) {
      openLogin();
      return;
    }

    try {
      const res = await fetchWithAuth('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: template.id,
          amount: template.price
        })
      });
      const data = await res.json();
      if (data.success) {
        setDemoTemplate(null);
        setOrderSuccessData({ order: data.order, template });
        setCartCount(prev => prev + 1);
      } else {
        alert(data.message || 'Payment simulation failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error completing order');
    }
  };

  const handleSearch = async (query) => {
    try {
      const res = await fetch(`/api/templates?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setTemplates(data.templates);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // View: Template Editor
  if (currentView === 'editor') {
    return (
      <>
        <TemplateEditor
          template={selectedTemplate || templates[0]}
          initialDesign={editingDesign}
          onBack={() => {
            setCurrentView('home');
            fetchCartAndDesignsCount();
          }}
        />
        <AuthModal />
      </>
    );
  }

  // View: Admin Panel
  if (currentView === 'admin') {
    return (
      <>
        <AdminPanel
          onBack={() => setCurrentView('home')}
          onOpenEditor={(tpl) => handleSelectTemplate(tpl)}
        />
        <AuthModal />
      </>
    );
  }

  // View: Main Landing Page (Matching screenshot)
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation matching screenshot */}
      <Navbar
        cartCount={cartCount}
        onOpenDesigns={() => {
          if (!token) openLogin();
          else setMyDesignsOpen(true);
        }}
        onOpenAdmin={() => setCurrentView('admin')}
        onSearch={handleSearch}
      />

      {/* Hero Section matching screenshot */}
      <Hero
        onBrowseClick={() => {
          const el = document.getElementById('templates-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onHowItWorksClick={() => {
          const el = document.getElementById('how-it-works-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Popular Templates matching screenshot */}
      <PopularTemplates
        templates={templates}
        onSelectTemplate={handleSelectTemplate}
        onViewDemo={(tpl) => setDemoTemplate(tpl)}
      />

      {/* Features Highlight Bar matching screenshot */}
      <FeaturesBar />

      {/* How It Works (4 Steps) matching screenshot */}
      <HowItWorks />

      {/* Testimonials matching screenshot */}
      <Testimonials />

      {/* Contact Section */}
      <ContactSection />
  
      {/* Footer matching screenshot */}
      <Footer />

      {/* Modals */}
      <AuthModal />

      <DemoPreviewModal
        template={demoTemplate}
        onClose={() => setDemoTemplate(null)}
        onSelectTemplate={handleSelectTemplate}
        onOrder={handleOrder}
      />

      <MyDesignsModal
        isOpen={myDesignsOpen}
        onClose={() => setMyDesignsOpen(false)}
        onEditDesign={handleEditSavedDesign}
      />

      <OrderSuccessModal
        order={orderSuccessData?.order}
        template={orderSuccessData?.template}
        onClose={() => setOrderSuccessData(null)}
        onOpenEditor={(tpl) => handleSelectTemplate(tpl)}
      />
    </div>
  );
}
