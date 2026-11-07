import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, LayoutDashboard, ShoppingCart, Layers, Plus, Trash2, Edit, 
  ArrowLeft, CheckCircle, TrendingUp, DollarSign, ShieldAlert, X, Eye, Lock, Unlock,
  Calendar, MapPin, Sparkles, Receipt
} from 'lucide-react';

export default function AdminPanel({ onBack, onOpenEditor }) {
  const { user, fetchWithAuth } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // overview, user_designs, sales_orders, templates, users
  const [stats, setStats] = useState(null);
  const [salesByTemplate, setSalesByTemplate] = useState([]);
  const [userDesigns, setUserDesigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Preview Design Modal
  const [previewDesign, setPreviewDesign] = useState(null);

  // Template Modal State
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [tplForm, setTplForm] = useState({
    title: '',
    price: 799,
    original_price: 1199,
    category: 'Royal',
    is_bestseller: false,
    description: ''
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, tplRes, usersRes, ordersRes, designsRes] = await Promise.all([
        fetchWithAuth('/api/admin/stats'),
        fetchWithAuth('/api/templates'),
        fetchWithAuth('/api/admin/users'),
        fetchWithAuth('/api/admin/orders'),
        fetchWithAuth('/api/admin/designs')
      ]);

      const statsData = await statsRes.json();
      const tplData = await tplRes.json();
      const usersData = await usersRes.json();
      const ordersData = await ordersRes.json();
      const designsData = await designsRes.json();

      if (statsData.success) {
        setStats(statsData.stats);
        setSalesByTemplate(statsData.sales_by_template || []);
      }
      if (tplData.success) setTemplates(tplData.templates);
      if (usersData.success) setUsers(usersData.users);
      if (ordersData.success) setOrders(ordersData.orders);
      if (designsData.success) setUserDesigns(designsData.designs);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const res = await fetchWithAuth(`/api/admin/templates/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTemplates(templates.filter(t => t.id !== id));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAddTemplate = () => {
    setEditingTemplate(null);
    setTplForm({
      title: '',
      price: 799,
      original_price: 1199,
      category: 'Royal',
      is_bestseller: false,
      description: ''
    });
    setTemplateModalOpen(true);
  };

  const handleOpenEditTemplate = (tpl) => {
    setEditingTemplate(tpl);
    setTplForm({
      title: tpl.title,
      price: tpl.price,
      original_price: tpl.original_price || tpl.price * 1.4,
      category: tpl.category || 'Royal',
      is_bestseller: tpl.is_bestseller,
      description: tpl.description || ''
    });
    setTemplateModalOpen(true);
  };

  const handleSaveTemplateForm = async (e) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        const res = await fetchWithAuth(`/api/admin/templates/${editingTemplate.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tplForm)
        });
        const data = await res.json();
        if (data.success) {
          setTemplateModalOpen(false);
          fetchAdminData();
        } else {
          alert(data.message);
        }
      } else {
        const res = await fetchWithAuth('/api/admin/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tplForm)
        });
        const data = await res.json();
        if (data.success) {
          setTemplateModalOpen(false);
          fetchAdminData();
        } else {
          alert(data.message);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#FDF7F5] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-red-200">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-xs text-gray-600 mb-6">
            You must be logged in as an administrator to access the admin panel.
          </p>
          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-[#6B1D2F] text-white text-xs font-semibold rounded-lg hover:bg-[#521321] transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF7F5] flex flex-col">
      
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Store Front</span>
          </button>

          <div className="h-5 w-[1px] bg-gray-200"></div>

          <div>
            <h1 className="font-serif font-bold text-lg text-gray-900 leading-tight flex items-center gap-2">
              <span>WeddInvites Admin Control Panel</span>
              <span className="text-[10px] bg-red-100 text-[#6B1D2F] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Admin
              </span>
            </h1>
            <p className="text-[11px] text-gray-500">
              User design monitoring, sales report & template management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-800">{user.name}</p>
            <p className="text-[10px] text-gray-500">{user.email}</p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-gray-200 mb-8 gap-y-2 space-x-2 sm:space-x-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#6B1D2F] text-[#6B1D2F]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          {/* User Designs Tab ("Kis user ne konsa template banaya") */}
          <button
            onClick={() => setActiveTab('user_designs')}
            className={`pb-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'user_designs'
                ? 'border-[#6B1D2F] text-[#6B1D2F]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>User Creations ({userDesigns.length})</span>
          </button>

          {/* Sales & Orders Tab ("Kitna ka maal bika") */}
          <button
            onClick={() => setActiveTab('sales_orders')}
            className={`pb-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'sales_orders'
                ? 'border-[#6B1D2F] text-[#6B1D2F]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Sales & Orders (₹ {stats?.total_revenue || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'templates'
                ? 'border-[#6B1D2F] text-[#6B1D2F]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Templates ({templates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'users'
                ? 'border-[#6B1D2F] text-[#6B1D2F]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users ({users.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & SALES BREAKDOWN */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Sales (कुल कमाई)</span>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl font-serif font-bold text-gray-900">
                  ₹ {stats?.total_revenue || 0}
                </div>
                <div className="text-[11px] text-green-700 font-medium mt-1">
                  From {stats?.total_orders || orders.length} completed purchases
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">User Created Designs</span>
                  <Sparkles className="w-5 h-5 text-[#6B1D2F]" />
                </div>
                <div className="text-3xl font-serif font-bold text-gray-900">
                  {userDesigns.length}
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  Customized by couples
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
                  <Users className="w-5 h-5 text-[#6B1D2F]" />
                </div>
                <div className="text-3xl font-serif font-bold text-gray-900">
                  {stats?.total_users || users.length}
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  Registered customer accounts
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Store Templates</span>
                  <Layers className="w-5 h-5 text-[#6B1D2F]" />
                </div>
                <div className="text-3xl font-serif font-bold text-gray-900">
                  {stats?.total_templates || templates.length}
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  Active in collection
                </div>
              </div>
            </div>

            {/* Template Sales Performance ("Kis template ka kitna maal bika") */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-gray-900">
                    Template Sales Performance (किस Template का कितना माल बिका)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Revenue breakdown and sales count for each wedding template
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('sales_orders')}
                  className="text-xs font-semibold text-[#6B1D2F] hover:underline cursor-pointer"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-[#FAF7F5] text-gray-700 uppercase font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3">Template Name</th>
                      <th className="px-5 py-3">Unit Price</th>
                      <th className="px-5 py-3">Copies Sold</th>
                      <th className="px-5 py-3 font-bold text-gray-900">Total Revenue Earned</th>
                      <th className="px-5 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {salesByTemplate.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3.5 font-bold text-gray-900">
                          {item.title}
                        </td>
                        <td className="px-5 py-3.5 font-medium">
                          ₹ {item.price}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-gray-800">
                          {item.total_sales_count} sales
                        </td>
                        <td className="px-5 py-3.5 font-bold text-gray-900">
                          ₹ {item.total_sales_revenue}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {item.total_sales_count > 0 ? (
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold rounded text-[10px]">
                              Active Sales
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[10px]">No orders yet</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Link to User Creations */}
            <div className="p-6 bg-[#FAF3F0] rounded-2xl border border-[#F2DDD3] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-base text-gray-900">
                  Live User Design Monitoring
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Inspect couple names, customized dates, venues, and watermark/license statuses for every user.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('user_designs')}
                className="px-5 py-2.5 bg-[#6B1D2F] text-white text-xs font-semibold rounded-lg hover:bg-[#521321] transition shadow-xs shrink-0 cursor-pointer"
              >
                View User Creations ({userDesigns.length}) →
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: USER CREATIONS ("Kis user ne konsa template banaya") */}
        {activeTab === 'user_designs' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-base text-gray-900">
                  User Customized Invitations (किस User ने कौनसा Template बनाया)
                </h3>
                <p className="text-xs text-gray-500">
                  Full logs of designs created by users, couple names, and purchase/watermark status
                </p>
              </div>

              <div className="text-xs font-medium text-gray-600 bg-[#FAF3F0] px-3 py-1.5 rounded-lg border border-[#F2DDD3]">
                Total Designs Created: <strong>{userDesigns.length}</strong>
              </div>
            </div>

            {userDesigns.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No custom user designs yet. Users will appear here as soon as they customize and save templates!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-[#FAF7F5] text-gray-700 uppercase font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3">Customer (User)</th>
                      <th className="px-5 py-3">Template Used</th>
                      <th className="px-5 py-3">Design Title & Couple</th>
                      <th className="px-5 py-3">Event Date & Venue</th>
                      <th className="px-5 py-3">Payment / Watermark Status</th>
                      <th className="px-5 py-3">Created Date</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {userDesigns.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50 transition">
                        {/* Customer Info */}
                        <td className="px-5 py-4">
                          <div className="font-bold text-gray-900">{d.user_name}</div>
                          <div className="text-[11px] text-gray-500 font-mono">{d.user_email}</div>
                          <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded font-mono">
                            User ID: #{d.user_id}
                          </span>
                        </td>

                        {/* Template Info */}
                        <td className="px-5 py-4">
                          <span className="font-semibold text-gray-900 block">{d.template_title}</span>
                          <span className="text-[10px] text-[#6B1D2F] font-bold">
                            ₹ {d.template_price}
                          </span>
                        </td>

                        {/* Design Title & Couple Names */}
                        <td className="px-5 py-4">
                          <div className="font-bold text-gray-800">{d.title}</div>
                          <div className="text-[11px] text-gray-600 font-serif italic">
                            {d.groom_name} <span className="text-[#6B1D2F] font-sans font-semibold">weds</span> {d.bride_name}
                          </div>
                        </td>

                        {/* Event Date & Venue */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 text-[11px] font-medium text-gray-800">
                            <Calendar className="w-3 h-3 text-[#6B1D2F]" />
                            <span>{d.wedding_date || 'Date not set'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5 truncate max-w-[160px]">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span>{d.venue || 'Venue not set'}</span>
                          </div>
                        </td>

                        {/* Watermark / License Status */}
                        <td className="px-5 py-4">
                          {d.is_purchased ? (
                            <div>
                              <span className="px-2.5 py-1 bg-green-100 text-green-800 font-bold rounded-full text-[10px] flex items-center gap-1 w-max">
                                <Unlock className="w-3 h-3" /> Paid & Licensed (₹ {d.amount_paid})
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono block mt-1">
                                {d.payment_id}
                              </span>
                            </div>
                          ) : (
                            <div>
                              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-full text-[10px] flex items-center gap-1 w-max">
                                <Lock className="w-3 h-3" /> Unpaid (Watermark Active)
                              </span>
                              <span className="text-[10px] text-gray-400 block mt-0.5">
                                Free draft preview
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Creation Date */}
                        <td className="px-5 py-4 text-gray-500 text-[11px]">
                          {d.created_at}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => setPreviewDesign(d)}
                            className="px-2.5 py-1.5 bg-[#FAF3F0] hover:bg-[#F2DDD3] text-[#6B1D2F] rounded text-xs font-semibold transition cursor-pointer flex items-center gap-1 ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SALES & ORDERS ("Kitna ka maal bika") */}
        {activeTab === 'sales_orders' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-base text-gray-900">
                  Sales & Orders Log (कितने का माल बिका)
                </h3>
                <p className="text-xs text-gray-500">
                  Complete ledger of payments made by couples for digital invitations
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-xl text-right">
                <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider block">Total Sales</span>
                <span className="text-xl font-bold font-serif text-green-800">₹ {stats?.total_revenue || 0}</span>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No completed sales yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-[#FAF7F5] text-gray-700 uppercase font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3">Order ID</th>
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3">Template Purchased</th>
                      <th className="px-5 py-3">Amount Paid</th>
                      <th className="px-5 py-3">Payment Reference</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3.5 font-mono text-gray-400">#{ord.id}</td>
                        <td className="px-5 py-3.5">
                          <span className="font-bold text-gray-900 block">{ord.user_name}</span>
                          <span className="text-[11px] text-gray-500 font-mono">{ord.user_email}</span>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-gray-800">
                          {ord.template_title}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-gray-900">
                          ₹ {ord.amount}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-gray-700">
                          {ord.payment_id}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold rounded text-[10px]">
                            COMPLETED ✓
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 font-mono text-[11px]">
                          {ord.created_at}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TEMPLATES MANAGEMENT */}
        {activeTab === 'templates' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-gray-900">Store Template Catalog</h3>
                <p className="text-xs text-gray-500">Edit titles, prices, categories, and bestseller tags</p>
              </div>

              <button
                onClick={handleOpenAddTemplate}
                className="px-4 py-2 bg-[#6B1D2F] hover:bg-[#521321] text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Template</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-[#FAF7F5] text-gray-700 uppercase font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">Template Name</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Price</th>
                    <th className="px-5 py-3">Bestseller</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {templates.map((tpl) => (
                    <tr key={tpl.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3.5 font-mono text-gray-400">#{tpl.id}</td>
                      <td className="px-5 py-3.5 font-bold text-gray-900">
                        {tpl.title}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 bg-[#FAF3F0] text-[#6B1D2F] font-semibold rounded text-[10px]">
                          {tpl.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gray-900">
                        ₹ {tpl.price}
                      </td>
                      <td className="px-5 py-3.5">
                        {tpl.is_bestseller ? (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 font-bold rounded text-[10px]">
                            ★ Bestseller
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[11px]">Regular</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditTemplate(tpl)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Edit Template"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(tpl.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete Template"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: USERS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-gray-200">
              <h3 className="font-serif font-bold text-base text-gray-900">Customer Accounts</h3>
              <p className="text-xs text-gray-500">Registered users, their customized designs count, and total spend</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-[#FAF7F5] text-gray-700 uppercase font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3">User ID</th>
                    <th className="px-5 py-3">Customer Name</th>
                    <th className="px-5 py-3">Email Address</th>
                    <th className="px-5 py-3">Designs Created</th>
                    <th className="px-5 py-3">Orders Placed</th>
                    <th className="px-5 py-3">Total Money Spent</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3.5 font-mono text-gray-400">#{u.id}</td>
                      <td className="px-5 py-3.5 font-bold text-gray-900">{u.name}</td>
                      <td className="px-5 py-3.5 font-mono text-xs">{u.email}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-800">
                        {u.designs_count || 0} designs
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gray-800">
                        {u.orders_count || 0} orders
                      </td>
                      <td className="px-5 py-3.5 font-bold text-green-700">
                        ₹ {u.total_spent || 0}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 font-bold rounded text-[10px] ${
                          u.role === 'admin' ? 'bg-red-100 text-[#6B1D2F]' : 'bg-green-100 text-green-800'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-[11px]">{u.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Inspect User Design Modal */}
      {previewDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
            <div className="bg-[#6B1D2F] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base">User Customized Design</h3>
                <p className="text-xs text-[#E5C07B]">Created by {previewDesign.user_name}</p>
              </div>
              <button
                onClick={() => setPreviewDesign(null)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-[#FAF3F0] p-4 rounded-xl border border-[#F2DDD3] space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Customer</span>
                  <span className="font-bold text-gray-900">{previewDesign.user_name} ({previewDesign.user_email})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Template Used</span>
                  <span className="font-bold text-[#6B1D2F]">{previewDesign.template_title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Couple</span>
                  <span className="font-bold text-gray-900">{previewDesign.groom_name} & {previewDesign.bride_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Wedding Date</span>
                  <span className="font-bold text-gray-900">{previewDesign.wedding_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Venue</span>
                  <span className="font-medium text-gray-800">{previewDesign.venue}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-gray-500">Watermark Status</span>
                  {previewDesign.is_purchased ? (
                    <span className="font-bold text-green-700">✓ Purchased & Watermark-Free (₹{previewDesign.amount_paid})</span>
                  ) : (
                    <span className="font-bold text-amber-700">🔒 Draft Preview (Watermark Active)</span>
                  )}
                </div>
              </div>

              {previewDesign.custom_data?.events && (
                <div>
                  <h5 className="font-bold text-gray-800 uppercase tracking-wider mb-2">Programmes / Events</h5>
                  <div className="space-y-1.5">
                    {previewDesign.custom_data.events.map((ev, i) => (
                      <div key={i} className="p-2 bg-gray-50 rounded border border-gray-100 flex justify-between">
                        <span className="font-semibold text-gray-800">{ev.name}</span>
                        <span className="text-gray-500">{ev.date} • {ev.time} ({ev.venue})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setPreviewDesign(null)}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Create / Edit Modal */}
      {templateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
            <div className="bg-[#6B1D2F] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-serif font-bold text-base">
                {editingTemplate ? 'Edit Template' : 'Add New Wedding Template'}
              </h3>
              <button
                onClick={() => setTemplateModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplateForm} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={tplForm.title}
                  onChange={(e) => setTplForm({ ...tplForm, title: e.target.value })}
                  placeholder="e.g. Royal Rajgharana"
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={tplForm.price}
                    onChange={(e) => setTplForm({ ...tplForm, price: parseFloat(e.target.value) })}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={tplForm.category}
                    onChange={(e) => setTplForm({ ...tplForm, category: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#6B1D2F]"
                  >
                    <option value="Royal">Royal</option>
                    <option value="Floral">Floral</option>
                    <option value="Modern">Modern</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Vintage">Vintage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tplForm.is_bestseller}
                    onChange={(e) => setTplForm({ ...tplForm, is_bestseller: e.target.checked })}
                    className="w-4 h-4 text-[#6B1D2F] rounded focus:ring-[#6B1D2F]"
                  />
                  <span className="text-xs font-semibold text-gray-700">Mark as Bestseller</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={tplForm.description}
                  onChange={(e) => setTplForm({ ...tplForm, description: e.target.value })}
                  placeholder="Details about motifs, colors, theme style..."
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setTemplateModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-xs font-semibold rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6B1D2F] text-white text-xs font-semibold rounded-lg hover:bg-[#521321] transition shadow-xs cursor-pointer"
                >
                  {editingTemplate ? 'Update Template' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
