import React from 'react';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CancellationRefund: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 pb-24 sm:pb-12 text-stone-700">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Cancellation & Refund Policy
        </h1>
        <p className="text-xs text-stone-500 mt-1">Last revised: October 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-earth-200 shadow-soft space-y-5 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-bold text-stone-900 text-base">1. Cancellation by Customer</h2>
          <p>
            Because fresh produce is picked and packaged directly at the farm upon your request, orders can only be cancelled while in the <strong>"Pending Confirmation"</strong> status before the farmer begins morning harvest packaging.
          </p>
          <p>
            Once an order is marked <strong>"Preparing"</strong> or <strong>"Out for Delivery"</strong>, cancellation is no longer possible as the perishable produce has already been segregated.
          </p>
        </section>

        <section className="space-y-2 border-t border-earth-100 pt-4">
          <h2 className="font-bold text-stone-900 text-base">2. Rejection or Inability to Fulfill by Farmer</h2>
          <p>
            If adverse weather, pest damage, or sudden stock depletion prevents a farmer from fulfilling an order, the farmer will decline the order. Any advance online payment will be refunded 100% via the original payment source within 24 to 48 banking hours.
          </p>
        </section>

        <section className="space-y-2 border-t border-earth-100 pt-4">
          <h2 className="font-bold text-stone-900 text-base">3. Freshness Guarantee & Doorstep Returns</h2>
          <p>
            Customers are encouraged to inspect produce upon arrival. If any item is damaged or substandard, notify our delivery partner or WhatsApp support within <strong>4 hours</strong> with a photo. A replacement or instant UPI refund will be issued.
          </p>
        </section>
      </div>
    </div>
  );
};
