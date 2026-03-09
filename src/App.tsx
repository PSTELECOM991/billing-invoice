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
  MapPin
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
  const [info, setInfo] = useState<InvoiceInfo>({ 
    number: `INV-${new Date().getFullYear()}-001`, 
    date: new Date().toISOString().split('T')[0] 
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
      address: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('shop_details', JSON.stringify(shop));
  }, [shop]);

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
              theme === 'minimal' ? 'rounded-none border-none shadow-none' : ''
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

            <div className={`p-8 md:p-12 space-y-12 ${theme === 'modern' ? 'pt-16' : ''}`}>
              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className={`text-[10px] font-bold uppercase tracking-[0.2em] border-b pb-2 ${
                    theme === 'modern' ? 'text-indigo-600 border-indigo-50' : 'text-slate-400 border-slate-100'
                  }`}>{t.customerDetails}</h4>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-slate-900">{customer.name || '---'}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{customer.address || '---'}</p>
                    <p className="text-sm text-slate-500">{customer.phone}</p>
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
                      theme === 'modern' ? 'text-indigo-600 border-indigo-50' : 'text-slate-400 border-slate-100'
                    }`}>FROM</h4>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-slate-900">{shop.name || '---'}</p>
                      <p className="text-sm text-slate-500 leading-relaxed">{shop.address || '---'}</p>
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
                      'border-slate-200'
                    }`}>
                      <th className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.productName}</th>
                      <th className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">{t.price}</th>
                      <th className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">{t.qty}</th>
                      <th className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{t.total}</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'modern' ? 'divide-indigo-50' : 'divide-slate-100'}`}>
                    {items.map((item) => (
                      <tr key={item.id} className="group">
                        <td className="py-6 font-medium text-slate-900">{item.name || '---'}</td>
                        <td className="py-6 text-center text-slate-600 font-mono">৳ {item.price.toLocaleString()}</td>
                        <td className="py-6 text-center text-slate-600">{item.qty}</td>
                        <td className="py-6 text-right font-bold text-slate-900 font-mono">৳ {(item.price * item.qty).toLocaleString()}</td>
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
                      theme === 'modern' ? 'text-indigo-600' : 'text-slate-400'
                    }`}>{t.bankDetails}</h4>
                    <div className={`text-xs space-y-1 p-4 rounded-xl border ${
                      theme === 'modern' ? 'bg-indigo-50 border-indigo-100 text-indigo-900' : 
                      'bg-slate-50 border-slate-100 text-slate-500'
                    }`}>
                      <p><span className="font-bold opacity-70">Bank:</span> {shop.bankName}</p>
                      <p><span className="font-bold opacity-70">A/C:</span> {shop.accountNo}</p>
                      <p><span className="font-bold opacity-70">IFSC:</span> {shop.ifsc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                      <QRCodeSVG value={qrData} size={80} />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight uppercase tracking-widest">Scan for address & contact info</p>
                  </div>
                </div>

                <div className="space-y-3 min-w-[240px]">
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span>{t.subtotal}</span>
                    <span className="font-mono">৳ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span>{t.cgst} ({cgstPercent}%)</span>
                    <span className="font-mono">৳ {cgstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span>{t.sgst} ({sgstPercent}%)</span>
                    <span className="font-mono">৳ {sgstAmount.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-slate-100 my-4" />
                  <div className={`flex justify-between items-center p-6 rounded-2xl ${
                    theme === 'premium' ? 'bg-slate-900 text-white' : 
                    theme === 'modern' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 
                    theme === 'classic' ? 'bg-white border-2 border-slate-900 text-slate-900' :
                    'bg-slate-50 text-slate-900'
                  }`}>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">{t.grandTotal}</span>
                    <span className="text-3xl font-black font-mono">৳ {grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
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
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={info.number}
                    onChange={(e) => setInfo({ ...info, number: e.target.value })}
                  />
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
