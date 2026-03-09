/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Rocket, 
  Plus, 
  Trash2, 
  Save, 
  User, 
  FileText, 
  Calendar, 
  ShoppingCart,
  CheckCircle2,
  Globe,
  Store,
  X,
  Printer,
  ArrowLeft,
  Phone,
  Mail,
  Building2,
  CreditCard,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { InvoiceItem, CustomerDetails, InvoiceInfo, ShopDetails, Language, InvoiceTheme } from './types';
import { translations } from './translations';

export default function App() {
  const [lang, setLang] = useState<Language>('bn');
  const t = translations[lang];

  const [theme, setTheme] = useState<InvoiceTheme>('premium');
  const [customer, setCustomer] = useState<CustomerDetails>({ name: '', address: '', phone: '' });
  const [info, setInfo] = useState<InvoiceInfo>(() => {
    const saved = localStorage.getItem('invoice_info');
    return saved ? JSON.parse(saved) : { 
      number: `INV-${new Date().getFullYear()}-001`, 
      date: new Date().toISOString().split('T')[0] 
    };
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: crypto.randomUUID(), name: '', price: 0, qty: 1 }
  ]);
  const [totalGstPercent, setTotalGstPercent] = useState(5);
  const cgstPercent = useMemo(() => totalGstPercent / 2, [totalGstPercent]);
  const sgstPercent = useMemo(() => totalGstPercent / 2, [totalGstPercent]);
  const [showProfile, setShowProfile] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  
  const [shop, setShop] = useState<ShopDetails>(() => {
    const saved = localStorage.getItem('shop_details');
    return saved ? JSON.parse(saved) : {
      name: '',
      phone: '',
      gst: '',
      email: '',
      description: '',
      bankName: '',
      accountNo: '',
      ifsc: '',
      address: '',
      terms: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('shop_details', JSON.stringify(shop));
  }, [shop]);

  useEffect(() => {
    localStorage.setItem('invoice_info', JSON.stringify(info));
  }, [info]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }, [items]);

  const cgstAmount = useMemo(() => {
    return (subtotal * cgstPercent) / 100;
  }, [subtotal, cgstPercent]);

  const sgstAmount = useMemo(() => {
    return (subtotal * sgstPercent) / 100;
  }, [subtotal, sgstPercent]);

  const grandTotal = subtotal + cgstAmount + sgstAmount;

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), name: '', price: 0, qty: 1 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const qrData = useMemo(() => {
    return `Shop: ${shop.name}\nAddress: ${shop.address}\nPhone: ${shop.phone}\n\nCustomer: ${customer.name}\nAddress: ${customer.address}\nPhone: ${customer.phone}`;
  }, [shop, customer]);

  if (isPreview) {
    const themes: { id: InvoiceTheme; label: string }[] = [
      { id: 'premium', label: t.premium },
      { id: 'classic', label: t.classic },
      { id: 'modern', label: t.modern },
      { id: 'minimal', label: t.minimal },
      { id: 'retro', label: t.retro },
      { id: 'elegant', label: t.elegant },
      { id: 'industrial', label: t.industrial },
      { id: 'organic', label: t.organic },
      { id: 'brutalist', label: t.brutalist },
      { id: 'futuristic', label: t.futuristic },
      { id: 'corporate', label: t.corporate },
      { id: 'playful', label: t.playful },
      { id: 'darkLuxury', label: t.darkLuxury },
      { id: 'technical', label: t.technical },
    ];

    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 no-print">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsPreview(false)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.back}
              </button>
              
              <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto max-w-[280px] md:max-w-none">
                {themes.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setTheme(th.id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${theme === th.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              <Printer className="w-4 h-4" />
              {t.print}
            </button>
          </div>

          <motion.div 
            key={theme}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:border-none print:rounded-none ${
              theme === 'minimal' ? 'rounded-none border-none shadow-none' : 
              theme === 'darkLuxury' ? 'bg-black text-yellow-600 border-yellow-600/20' :
              theme === 'technical' ? 'bg-[#003366] text-white border-white/20' :
              theme === 'industrial' ? 'bg-[#1a1a1a] text-gray-300 border-gray-800' :
              theme === 'retro' ? 'rounded-none border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]' :
              theme === 'brutalist' ? 'rounded-none border-4 border-black' :
              theme === 'futuristic' ? 'bg-slate-950 text-white border-white/10' :
              ''
            }`}
          >
            {/* Theme Header */}
            {theme === 'premium' && (
              <div className="bg-slate-900 text-white p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-4">
                    <h1 className="text-4xl font-black tracking-tighter uppercase">{shop.name || t.appName}</h1>
                    <p className="text-slate-400 max-w-md text-sm leading-relaxed">{shop.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                      {shop.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {shop.phone}</span>}
                      {shop.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {shop.email}</span>}
                      {shop.gst && <span className="flex items-center gap-1 font-bold text-indigo-400 uppercase tracking-widest">GST: {shop.gst}</span>}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="inline-block bg-indigo-600 px-4 py-1 rounded text-xs font-bold uppercase tracking-widest mb-4">INVOICE</div>
                    <h2 className="text-2xl font-mono text-indigo-400">{info.number}</h2>
                    <p className="text-slate-400 text-sm">{info.date}</p>
                  </div>
                </div>
              </div>
            )}

            {theme === 'classic' && (
              <div className="p-8 md:p-12 border-b-4 border-slate-900">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-serif font-bold text-slate-900">{shop.name || t.appName}</h1>
                    <p className="text-slate-500 text-sm italic">{shop.description}</p>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p>{shop.address}</p>
                      <p>{shop.phone} | {shop.email}</p>
                      <p className="font-bold">GST: {shop.gst}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-5xl font-serif font-black text-slate-200 mb-2">INVOICE</h2>
                    <p className="text-slate-900 font-bold">#{info.number}</p>
                    <p className="text-slate-500 text-sm">{info.date}</p>
                  </div>
                </div>
              </div>
            )}

            {theme === 'modern' && (
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-8 md:p-12 rounded-b-[3rem]">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-left space-y-4">
                    <div className="inline-block p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-2">
                      <Store className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight">{shop.name || t.appName}</h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-white/80">
                      <span>{shop.phone}</span>
                      <span>{shop.email}</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded">GST: {shop.gst}</span>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 text-center min-w-[200px]">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">Invoice Amount</p>
                    <p className="text-4xl font-black">৳ {grandTotal.toLocaleString()}</p>
                    <div className="mt-4 pt-4 border-t border-white/10 text-xs font-mono">
                      {info.number} | {info.date}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {theme === 'minimal' && (
              <div className="p-8 md:p-12 border-b border-slate-100">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-light tracking-widest uppercase text-slate-900">{shop.name || t.appName}</h1>
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em]">{shop.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                    <p className="text-sm font-medium">{info.date}</p>
                  </div>
                </div>
              </div>
            )}

            {theme === 'retro' && (
              <div className="bg-yellow-400 p-8 md:p-12 border-b-8 border-black">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-left">
                    <h1 className="text-6xl font-black tracking-tighter uppercase text-black italic transform -skew-x-12 border-4 border-black px-4 bg-white inline-block mb-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">{shop.name || t.appName}</h1>
                    <p className="text-black font-bold uppercase tracking-widest bg-white inline-block px-2">{shop.description}</p>
                  </div>
                  <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-2xl font-black uppercase italic">Invoice</h2>
                    <p className="font-mono font-bold">#{info.number}</p>
                    <p className="text-xs font-bold">{info.date}</p>
                  </div>
                </div>
              </div>
            )}

            {theme === 'elegant' && (
              <div className="bg-[#fdfbf7] p-12 md:p-20 border-b border-[#e5d5c5]">
                <div className="text-center space-y-6">
                  <h1 className="text-5xl font-serif italic text-[#4a3728] tracking-tight">{shop.name || t.appName}</h1>
                  <div className="w-24 h-px bg-[#e5d5c5] mx-auto" />
                  <p className="text-[#8c7b6c] text-sm uppercase tracking-[0.4em] font-light">{shop.description}</p>
                  <div className="flex justify-center gap-8 text-[10px] text-[#8c7b6c] uppercase tracking-widest pt-4">
                    <span>{info.number}</span>
                    <span>{info.date}</span>
                  </div>
                </div>
              </div>
            )}

            {theme === 'industrial' && (
              <div className="bg-[#1a1a1a] p-8 md:p-12 border-b-2 border-orange-500">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <h1 className="text-4xl font-mono font-bold text-white tracking-tighter">{shop.name || t.appName}</h1>
                    <p className="text-orange-500 font-mono text-xs uppercase tracking-widest">{shop.description}</p>
                    <div className="text-[10px] font-mono text-gray-500 space-y-1">
                      <p>SYS_REF: {info.number}</p>
                      <p>TIMESTAMP: {info.date}</p>
                    </div>
                  </div>
                  <div className="w-16 h-16 border border-gray-800 flex items-center justify-center">
                    <div className="w-8 h-8 bg-orange-500 rotate-45" />
                  </div>
                </div>
              </div>
            )}

            {theme === 'organic' && (
              <div className="bg-[#f4f7f0] p-8 md:p-12 rounded-t-3xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      <Store className="w-8 h-8" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-emerald-900">{shop.name || t.appName}</h1>
                      <p className="text-emerald-600/70 text-sm">{shop.description}</p>
                    </div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl border border-emerald-100 text-center">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1">Invoice Date</p>
                    <p className="text-emerald-900 font-medium">{info.date}</p>
                  </div>
                </div>
              </div>
            )}

            {theme === 'brutalist' && (
              <div className="p-8 md:p-12 border-b-4 border-black">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="border-4 border-black p-6 bg-lime-300 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                    <h1 className="text-5xl font-black uppercase leading-none mb-2">{shop.name || t.appName}</h1>
                    <p className="font-bold border-t-2 border-black pt-2">{shop.description}</p>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <div className="text-right border-4 border-black p-4 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                      <h2 className="text-xl font-black uppercase">Invoice No.</h2>
                      <p className="text-2xl font-black">{info.number}</p>
                    </div>
                    <p className="font-black text-4xl mt-4">{info.date}</p>
                  </div>
                </div>
              </div>
            )}

            {theme === 'futuristic' && (
              <div className="bg-slate-950 p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px]" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="space-y-4">
                    <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 uppercase">{shop.name || t.appName}</h1>
                    <p className="text-cyan-400/60 text-xs font-mono tracking-[0.3em] uppercase">{shop.description}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-2xl text-center min-w-[200px]">
                    <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2">Transmission ID</div>
                    <div className="text-2xl font-mono text-white tracking-widest">{info.number}</div>
                    <div className="mt-2 text-[10px] text-white/40 font-mono">{info.date}</div>
                  </div>
                </div>
              </div>
            )}

            {theme === 'corporate' && (
              <div className="bg-slate-50 p-8 md:p-12 border-b border-slate-200">
                <div className="flex justify-between items-start">
                  <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-2xl font-bold text-slate-900">{shop.name || t.appName}</h1>
                      <p className="text-slate-500 text-xs">{shop.description}</p>
                      <div className="text-[10px] text-slate-400 space-y-0.5 pt-2">
                        <p>{shop.address}</p>
                        <p>{shop.phone} | {shop.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-3xl font-bold text-blue-600 mb-1 uppercase tracking-tight">Invoice</h2>
                    <p className="text-slate-900 font-semibold">{info.number}</p>
                    <p className="text-slate-400 text-xs">{info.date}</p>
                  </div>
                </div>
              </div>
            )}

            {theme === 'playful' && (
              <div className="bg-rose-50 p-8 md:p-12 rounded-t-[3rem] border-b-4 border-dashed border-rose-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-left">
                    <div className="inline-block p-4 bg-rose-400 rounded-[2rem] text-white mb-4 rotate-3">
                      <Rocket className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black text-rose-600 tracking-tight">{shop.name || t.appName}</h1>
                    <p className="text-rose-400 font-medium italic">{shop.description}</p>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border-4 border-rose-100 shadow-xl shadow-rose-100/50 text-center">
                    <p className="text-xs font-bold text-rose-300 uppercase mb-1">Hello! Here's your bill</p>
                    <p className="text-2xl font-black text-rose-600">{info.number}</p>
                    <p className="text-rose-400 text-sm font-bold mt-1">{info.date}</p>
                  </div>
                </div>
              </div>
            )}

            {theme === 'darkLuxury' && (
              <div className="bg-black p-12 md:p-20 border-b border-yellow-600/30">
                <div className="flex flex-col items-center text-center space-y-8">
                  <div className="w-px h-16 bg-gradient-to-b from-transparent to-yellow-600" />
                  <h1 className="text-5xl font-serif tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 uppercase">{shop.name || t.appName}</h1>
                  <p className="text-yellow-600/60 text-xs uppercase tracking-[0.5em] font-light">{shop.description}</p>
                  <div className="flex gap-12 text-[10px] text-yellow-600/40 uppercase tracking-[0.3em] pt-4">
                    <div className="space-y-1">
                      <p>Reference</p>
                      <p className="text-yellow-600 font-medium">{info.number}</p>
                    </div>
                    <div className="space-y-1">
                      <p>Issued</p>
                      <p className="text-yellow-600 font-medium">{info.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {theme === 'technical' && (
              <div className="bg-[#003366] p-8 md:p-12 border-b border-white/20 relative">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                <div className="relative z-10 flex justify-between items-start">
                  <div className="space-y-4">
                    <div className="inline-block border border-white/40 px-2 py-1 text-[10px] text-white/60 font-mono uppercase">Blueprint v1.0</div>
                    <h1 className="text-4xl font-mono font-bold text-white uppercase">{shop.name || t.appName}</h1>
                    <p className="text-white/60 font-mono text-xs italic">{shop.description}</p>
                  </div>
                  <div className="text-right font-mono text-white">
                    <div className="text-[10px] text-white/40 mb-1 uppercase tracking-widest">Document Ref</div>
                    <div className="text-xl font-bold border-b border-white/40 pb-1 mb-1">{info.number}</div>
                    <div className="text-xs text-white/60">{info.date}</div>
                  </div>
                </div>
              </div>
            )}

            <div className={`p-8 md:p-12 space-y-12 ${theme === 'modern' ? 'pt-16' : ''}`}>
              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className={`text-[10px] font-bold uppercase tracking-[0.2em] border-b pb-2 ${
                    theme === 'modern' ? 'text-indigo-600 border-indigo-50' : 
                    theme === 'darkLuxury' ? 'text-yellow-600 border-yellow-600/20' :
                    theme === 'technical' ? 'text-white/60 border-white/10' :
                    theme === 'industrial' ? 'text-orange-500 border-gray-800' :
                    theme === 'retro' ? 'text-black border-black border-b-4' :
                    'text-slate-400 border-slate-100'
                  }`}>{t.customerDetails}</h4>
                  <div className="space-y-1">
                    <p className={`text-lg font-bold ${
                      theme === 'darkLuxury' ? 'text-yellow-200' : 
                      theme === 'technical' ? 'text-white' :
                      theme === 'retro' ? 'text-black font-black uppercase' :
                      'text-slate-900'
                    }`}>{customer.name || '---'}</p>
                    <p className={`text-sm leading-relaxed ${
                      theme === 'darkLuxury' ? 'text-yellow-600/70' : 
                      theme === 'technical' ? 'text-white/60' :
                      theme === 'retro' ? 'text-black font-bold' :
                      'text-slate-500'
                    }`}>{customer.address || '---'}</p>
                    <p className={`text-sm ${
                      theme === 'darkLuxury' ? 'text-yellow-600/70' : 
                      theme === 'technical' ? 'text-white/60' :
                      theme === 'retro' ? 'text-black font-bold' :
                      'text-slate-500'
                    }`}>{customer.phone}</p>
                  </div>
                </div>
                {theme === 'minimal' && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Invoice Info</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-500"><span className="font-bold text-slate-900">No:</span> {info.number}</p>
                      <p className="text-sm text-slate-500"><span className="font-bold text-slate-900">GST:</span> {shop.gst}</p>
                      <p className="text-sm text-slate-500"><span className="font-bold text-slate-900">Contact:</span> {shop.phone}</p>
                    </div>
                  </div>
                )}
                {theme !== 'minimal' && (
                  <div className="space-y-4">
                  <h4 className={`text-[10px] font-bold uppercase tracking-[0.2em] border-b pb-2 ${
                      theme === 'modern' ? 'text-indigo-600 border-indigo-50' : 
                      theme === 'darkLuxury' ? 'text-yellow-600 border-yellow-600/20' :
                      theme === 'technical' ? 'text-white/60 border-white/10' :
                      theme === 'industrial' ? 'text-orange-500 border-gray-800' :
                      theme === 'retro' ? 'text-black border-black border-b-4' :
                      'text-slate-400 border-slate-100'
                    }`}>FROM</h4>
                    <div className="space-y-1">
                      <p className={`text-lg font-bold ${
                        theme === 'darkLuxury' ? 'text-yellow-200' : 
                        theme === 'technical' ? 'text-white' :
                        theme === 'retro' ? 'text-black font-black uppercase' :
                        'text-slate-900'
                      }`}>{shop.name || '---'}</p>
                      <p className={`text-sm leading-relaxed ${
                        theme === 'darkLuxury' ? 'text-yellow-600/70' : 
                        theme === 'technical' ? 'text-white/60' :
                        theme === 'retro' ? 'text-black font-bold' :
                        'text-slate-500'
                      }`}>{shop.address || '---'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b-2 ${
                      theme === 'premium' ? 'border-slate-900' : 
                      theme === 'modern' ? 'border-indigo-600' : 
                      theme === 'darkLuxury' ? 'border-yellow-600' :
                      theme === 'technical' ? 'border-white/40' :
                      theme === 'industrial' ? 'border-orange-500' :
                      theme === 'retro' ? 'border-black border-b-4' :
                      'border-slate-200'
                    }`}>
                      <th className={`py-4 text-[10px] font-bold uppercase tracking-widest ${
                        theme === 'darkLuxury' ? 'text-yellow-600/60' : 
                        theme === 'technical' ? 'text-white/40' :
                        theme === 'retro' ? 'text-black' :
                        'text-slate-400'
                      }`}>{t.productName}</th>
                      <th className={`py-4 text-[10px] font-bold uppercase tracking-widest text-center ${
                        theme === 'darkLuxury' ? 'text-yellow-600/60' : 
                        theme === 'technical' ? 'text-white/40' :
                        theme === 'retro' ? 'text-black' :
                        'text-slate-400'
                      }`}>{t.price}</th>
                      <th className={`py-4 text-[10px] font-bold uppercase tracking-widest text-center ${
                        theme === 'darkLuxury' ? 'text-yellow-600/60' : 
                        theme === 'technical' ? 'text-white/40' :
                        theme === 'retro' ? 'text-black' :
                        'text-slate-400'
                      }`}>{t.qty}</th>
                      <th className={`py-4 text-[10px] font-bold uppercase tracking-widest text-right ${
                        theme === 'darkLuxury' ? 'text-yellow-600/60' : 
                        theme === 'technical' ? 'text-white/40' :
                        theme === 'retro' ? 'text-black' :
                        'text-slate-400'
                      }`}>{t.total}</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${
                    theme === 'modern' ? 'divide-indigo-50' : 
                    theme === 'darkLuxury' ? 'divide-yellow-600/10' :
                    theme === 'technical' ? 'divide-white/10' :
                    theme === 'retro' ? 'divide-black' :
                    'divide-slate-100'
                  }`}>
                    {items.map((item) => (
                      <tr key={item.id} className="group">
                        <td className={`py-6 font-medium ${
                          theme === 'darkLuxury' ? 'text-yellow-100' : 
                          theme === 'technical' ? 'text-white' :
                          theme === 'retro' ? 'text-black font-bold uppercase' :
                          'text-slate-900'
                        }`}>{item.name || '---'}</td>
                        <td className={`py-6 text-center font-mono ${
                          theme === 'darkLuxury' ? 'text-yellow-600' : 
                          theme === 'technical' ? 'text-white/80' :
                          theme === 'retro' ? 'text-black font-bold' :
                          'text-slate-600'
                        }`}>৳ {item.price.toLocaleString()}</td>
                        <td className={`py-6 text-center ${
                          theme === 'darkLuxury' ? 'text-yellow-600' : 
                          theme === 'technical' ? 'text-white/80' :
                          theme === 'retro' ? 'text-black font-bold' :
                          'text-slate-600'
                        }`}>{item.qty}</td>
                        <td className={`py-6 text-right font-bold font-mono ${
                          theme === 'darkLuxury' ? 'text-yellow-500' : 
                          theme === 'technical' ? 'text-white' :
                          theme === 'retro' ? 'text-black font-black' :
                          'text-slate-900'
                        }`}>৳ {(item.price * item.qty).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Calculations */}
              <div className="flex flex-col md:flex-row justify-between gap-12 pt-8 border-t border-slate-100">
                <div className="space-y-6 max-w-xs">
                  <div className="space-y-2">
                    <h4 className={`text-[10px] font-bold uppercase tracking-widest ${
                      theme === 'modern' ? 'text-indigo-600' : 
                      theme === 'darkLuxury' ? 'text-yellow-600' :
                      theme === 'technical' ? 'text-white/60' :
                      theme === 'retro' ? 'text-black' :
                      'text-slate-400'
                    }`}>{t.bankDetails}</h4>
                    <div className={`text-xs space-y-1 p-4 rounded-xl border ${
                      theme === 'modern' ? 'bg-indigo-50 border-indigo-100 text-indigo-900' : 
                      theme === 'darkLuxury' ? 'bg-yellow-600/5 border-yellow-600/20 text-yellow-600' :
                      theme === 'technical' ? 'bg-white/5 border-white/10 text-white/80' :
                      theme === 'industrial' ? 'bg-gray-900 border-gray-800 text-gray-400' :
                      theme === 'retro' ? 'bg-white border-4 border-black text-black font-bold' :
                      'bg-slate-50 border-slate-100 text-slate-500'
                    }`}>
                      <p><span className="font-bold opacity-70">Bank:</span> {shop.bankName}</p>
                      <p><span className="font-bold opacity-70">A/C:</span> {shop.accountNo}</p>
                      <p><span className="font-bold opacity-70">IFSC:</span> {shop.ifsc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 bg-white border rounded-xl shadow-sm ${
                      theme === 'retro' ? 'border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'border-slate-200'
                    }`}>
                      <QRCodeSVG value={qrData} size={80} />
                    </div>
                    <p className={`text-[10px] leading-tight uppercase tracking-widest ${
                      theme === 'darkLuxury' ? 'text-yellow-600/40' : 
                      theme === 'technical' ? 'text-white/40' :
                      theme === 'retro' ? 'text-black font-black' :
                      'text-slate-400'
                    }`}>Scan for address & contact info</p>
                  </div>
                </div>

                <div className="space-y-3 min-w-[240px]">
                  <div className={`flex justify-between text-sm ${
                    theme === 'darkLuxury' ? 'text-yellow-600/60' : 
                    theme === 'technical' ? 'text-white/60' :
                    theme === 'retro' ? 'text-black font-bold' :
                    'text-slate-500'
                  }`}>
                    <span>{t.subtotal}</span>
                    <span className="font-mono">৳ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className={`flex justify-between text-sm ${
                    theme === 'darkLuxury' ? 'text-yellow-600/60' : 
                    theme === 'technical' ? 'text-white/60' :
                    theme === 'retro' ? 'text-black font-bold' :
                    'text-slate-500'
                  }`}>
                    <span>{t.cgst} ({cgstPercent}%)</span>
                    <span className="font-mono">৳ {cgstAmount.toLocaleString()}</span>
                  </div>
                  <div className={`flex justify-between text-sm ${
                    theme === 'darkLuxury' ? 'text-yellow-600/60' : 
                    theme === 'technical' ? 'text-white/60' :
                    theme === 'retro' ? 'text-black font-bold' :
                    'text-slate-500'
                  }`}>
                    <span>{t.sgst} ({sgstPercent}%)</span>
                    <span className="font-mono">৳ {sgstAmount.toLocaleString()}</span>
                  </div>
                  <div className={`h-px my-4 ${
                    theme === 'darkLuxury' ? 'bg-yellow-600/20' : 
                    theme === 'technical' ? 'bg-white/10' :
                    theme === 'retro' ? 'bg-black h-1' :
                    'bg-slate-100'
                  }`} />
                  <div className={`flex justify-between items-center p-6 rounded-2xl ${
                    theme === 'premium' ? 'bg-slate-900 text-white' : 
                    theme === 'modern' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 
                    theme === 'classic' ? 'bg-white border-2 border-slate-900 text-slate-900' :
                    theme === 'darkLuxury' ? 'bg-gradient-to-br from-yellow-600 to-yellow-800 text-black shadow-2xl shadow-yellow-900/20' :
                    theme === 'technical' ? 'bg-white text-[#003366]' :
                    theme === 'retro' ? 'bg-black text-yellow-400 rounded-none border-4 border-black' :
                    theme === 'brutalist' ? 'bg-black text-white rounded-none' :
                    'bg-slate-50 text-slate-900'
                  }`}>
                    <span className={`text-xs font-bold uppercase tracking-widest opacity-60 ${
                      theme === 'retro' ? 'opacity-100' : ''
                    }`}>{t.grandTotal}</span>
                    <span className="text-3xl font-black font-mono">৳ {grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions Display */}
              {shop.terms && (
                <div className={`pt-8 border-t ${
                  theme === 'darkLuxury' ? 'border-yellow-600/20' : 
                  theme === 'technical' ? 'border-white/10' :
                  theme === 'retro' ? 'border-black border-t-4' :
                  'border-slate-100'
                }`}>
                  <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${
                    theme === 'modern' ? 'text-indigo-600' : 
                    theme === 'darkLuxury' ? 'text-yellow-600' :
                    theme === 'technical' ? 'text-white/60' :
                    theme === 'retro' ? 'text-black' :
                    'text-slate-400'
                  }`}>{t.terms}</h4>
                  <p className={`text-xs leading-relaxed whitespace-pre-line italic ${
                    theme === 'darkLuxury' ? 'text-yellow-600/60' : 
                    theme === 'technical' ? 'text-white/60' :
                    theme === 'retro' ? 'text-black font-bold' :
                    'text-slate-500'
                  }`}>
                    {shop.terms}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowProfile(true)}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all group"
          >
            <Store className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
              <Rocket className="text-indigo-600 w-8 h-8" />
              {t.appName}
              <span className="text-sm font-normal text-slate-500 border-l border-slate-300 pl-3 ml-1">
                {t.tagline}
              </span>
            </h1>
            <p className="text-slate-500 mt-1">{shop.name || t.appName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            {(['bn', 'en', 'hi'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === l ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <Calendar className="w-4 h-4 text-indigo-500" />
            {new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : lang === 'hi' ? 'hi-IN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Info Section */}
          <div className="invoice-card grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                <User className="w-5 h-5 text-indigo-500" />
                📝 {t.customerDetails}
              </h3>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder={t.name}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                />
                <input 
                  type="text" 
                  placeholder={t.phone}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                />
                <textarea 
                  placeholder={t.address}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                <FileText className="w-5 h-5 text-indigo-500" />
                📊 {t.invoiceInfo}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t.invoiceNo}</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all pr-10"
                      value={info.number}
                      onChange={(e) => setInfo({ ...info, number: e.target.value })}
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const random = Math.floor(100 + Math.random() * 900);
                        setInfo({ ...info, number: `INV-${new Date().getFullYear()}-${random}` });
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Generate New Number"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t.date}</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={info.date}
                    onChange={(e) => setInfo({ ...info, date: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800 px-2">
              <ShoppingCart className="w-5 h-5 text-indigo-500" />
              🛒 {t.productDetails}
            </h3>
            
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="invoice-card !p-4 grid grid-cols-12 gap-4 items-end"
                  >
                    <div className="col-span-12 md:col-span-5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t.productName}</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t.price}</label>
                      <input 
                        type="number" 
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t.qty}</label>
                      <input 
                        type="number" 
                        min="1"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        value={item.qty}
                        onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="col-span-3 md:col-span-2 text-right pb-2">
                      <span className="text-[10px] text-slate-400 block mb-1 uppercase font-bold">{t.total}</span>
                      <span className="font-bold text-indigo-600">৳ {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                    <div className="col-span-1 flex justify-end pb-1">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={items.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button 
              onClick={addItem}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:border-indigo-400 hover:text-indigo-600 transition-all group"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {t.addItem}
            </button>

            {/* Terms and Conditions Input */}
            <div className="invoice-card space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                <FileText className="w-5 h-5 text-indigo-500" />
                📜 {t.terms}
              </h3>
              <textarea 
                placeholder={t.terms}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none bg-slate-50/50"
                value={shop.terms}
                onChange={(e) => setShop({ ...shop, terms: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="space-y-6">
          <div className="total-section sticky top-8">
            <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              {t.summary}
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-indigo-700">
                <span>{t.subtotal}:</span>
                <span className="font-semibold">৳ {subtotal.toLocaleString()}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-indigo-700 text-sm">
                  <span>{t.totalGst} ({totalGstPercent}%):</span>
                  <span className="font-semibold">৳ {(cgstAmount + sgstAmount).toLocaleString()}</span>
                </div>
                <div className="flex gap-4 items-center">
                  <input 
                    type="range" 
                    min="0" max="28" step="1"
                    className="flex-1 h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    value={totalGstPercent}
                    onChange={(e) => setTotalGstPercent(parseFloat(e.target.value))}
                  />
                  <input 
                    type="number"
                    min="0" max="100"
                    className="w-16 px-2 py-1 text-xs border border-indigo-200 rounded outline-none focus:ring-1 focus:ring-indigo-500"
                    value={totalGstPercent}
                    onChange={(e) => setTotalGstPercent(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-indigo-400 font-bold uppercase">
                  <span>{t.cgst}: {cgstPercent}%</span>
                  <span>{t.sgst}: {sgstPercent}%</span>
                </div>
              </div>

              <div className="h-px bg-indigo-200 my-4" />
              
              <div className="flex justify-between items-center text-indigo-900">
                <span className="text-lg font-bold italic">{t.grandTotal}:</span>
                <span className="text-2xl font-black">৳ {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => setIsPreview(true)}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {t.saveInvoice}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfile(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <Store className="w-6 h-6 text-indigo-600" />
                  {t.shopProfile}
                </h2>
                <button onClick={() => setShowProfile(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{t.customerDetails}</h4>
                    <div className="space-y-3">
                      <input 
                        type="text" placeholder={t.name}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={shop.name} onChange={(e) => setShop({...shop, name: e.target.value})}
                      />
                      <input 
                        type="text" placeholder={t.phone}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={shop.phone} onChange={(e) => setShop({...shop, phone: e.target.value})}
                      />
                      <input 
                        type="text" placeholder={t.gstNo}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={shop.gst} onChange={(e) => setShop({...shop, gst: e.target.value})}
                      />
                      <input 
                        type="email" placeholder={t.email}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={shop.email} onChange={(e) => setShop({...shop, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{t.bankDetails}</h4>
                    <div className="space-y-3">
                      <input 
                        type="text" placeholder={t.bankName}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={shop.bankName} onChange={(e) => setShop({...shop, bankName: e.target.value})}
                      />
                      <input 
                        type="text" placeholder={t.accountNo}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={shop.accountNo} onChange={(e) => setShop({...shop, accountNo: e.target.value})}
                      />
                      <input 
                        type="text" placeholder={t.ifsc}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={shop.ifsc} onChange={(e) => setShop({...shop, ifsc: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{t.description} & {t.address}</h4>
                  <textarea 
                    placeholder={t.description} rows={2}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    value={shop.description} onChange={(e) => setShop({...shop, description: e.target.value})}
                  />
                  <textarea 
                    placeholder={t.address} rows={2}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    value={shop.address} onChange={(e) => setShop({...shop, address: e.target.value})}
                  />
                  <textarea 
                    placeholder={t.terms} rows={3}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    value={shop.terms} onChange={(e) => setShop({...shop, terms: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setShowProfile(false)}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  {t.save}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
