import React from 'react';
import { ArrowLeft, Phone, MessageCircle, HelpCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Support: React.FC = () => {
  const faqs = [
    {
      q: 'How does FarmDirect guarantee farmgate freshness?',
      a: 'Farmers do not store produce in prolonged cold storage. Once your order is confirmed, produce is harvested from the field and packed within hours for local dispatch.'
    },
    {
      q: 'Can I order from multiple farmers at the same time?',
      a: 'Yes! You can add produce from different farmers into a single basket. At checkout, sub-orders are generated for each individual farmer so each farm can prepare their items fresh.'
    },
    {
      q: 'What is the delivery fee policy?',
      a: 'Orders above ₹500 from a farm qualify for FREE local delivery. Standard delivery is ₹40 for smaller orders, or ₹0 if you choose farmgate pickup.'
    },
    {
      q: 'How does FarmDirect verify organic claims?',
      a: 'We never label a product organic without certified lab documentation (NPOP / PGS-India). Farmers who practice natural residue-free farming are labeled "Natural Farmgate" to preserve complete honesty.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 pb-24 sm:pb-12 text-stone-700">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Help Desk & FAQs
        </h1>
        <p className="text-xs text-stone-500 mt-1">Frequently asked questions and direct assistance</p>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-earth-200 shadow-soft space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-stone-900">WhatsApp Helpline</h3>
          <p className="text-xs text-stone-500">Fast assistance for orders, farmer inquiries, and returns.</p>
          <a
            href="https://wa.me/919822000000?text=Hello%20FarmDirect%20Support"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs font-bold text-emerald-700 hover:underline pt-1"
          >
            Chat with Desk (+91 98220 00000) →
          </a>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-earth-200 shadow-soft space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-stone-900">Voice Support</h3>
          <p className="text-xs text-stone-500">Operating hours: 7:00 AM - 8:00 PM IST (All 7 days).</p>
          <a
            href="tel:+919822000000"
            className="inline-block text-xs font-bold text-blue-700 hover:underline pt-1"
          >
            Call Support Desk →
          </a>
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-earth-200 shadow-soft space-y-5">
        <h2 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-earth-100 space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="pt-4 first:pt-0 space-y-1 text-xs sm:text-sm">
              <h4 className="font-bold text-stone-900 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-agri-600 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-stone-600 pl-6 text-xs leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
