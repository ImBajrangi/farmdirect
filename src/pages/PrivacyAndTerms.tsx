import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 pb-24 sm:pb-12 text-stone-700">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>

      <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
        Privacy Policy & Data Protection (DPDP)
      </h1>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-earth-200 shadow-soft space-y-4 text-xs sm:text-sm leading-relaxed">
        <p>
          FarmDirect adheres strictly to India's Digital Personal Data Protection (DPDP) Act. We collect only the data required to facilitate direct farmer-buyer transactions:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-stone-600">
          <li><strong>Contact Details:</strong> Name and phone number for delivery verification and farmer coordination.</li>
          <li><strong>Delivery Address:</strong> Used solely to calculate serviceability and route delivery.</li>
          <li><strong>Payment Information:</strong> Handled securely by RBI-licensed payment aggregators (e.g. Razorpay). We never store raw debit/credit card numbers or UPI PINs.</li>
          <li><strong>Farmer KYC:</strong> 7/12 Land records and Aadhaar numbers are stored encrypted and accessible only to authorized verification officers.</li>
        </ul>
      </div>
    </div>
  );
};

export const Terms: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 pb-24 sm:pb-12 text-stone-700">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>

      <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
        Marketplace Terms & Conditions
      </h1>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-earth-200 shadow-soft space-y-4 text-xs sm:text-sm leading-relaxed">
        <h2 className="font-bold text-stone-900 text-base">Honest Agricultural Claims</h2>
        <p>
          Farmers agree not to mark produce as "Certified Organic" without valid NPOP / PGS documentation. Misleading buyers regarding harvest dates or chemical usage will result in immediate suspension of selling privileges and forfeiture of escrow earnings.
        </p>
        <h2 className="font-bold text-stone-900 text-base pt-3 border-t border-earth-100">Service Corridors</h2>
        <p>
          Delivery is currently restricted to active serviceable pincodes across Maharashtra (Nashik and Western Pune). Orders placed outside active service areas cannot be fulfilled via local delivery.
        </p>
      </div>
    </div>
  );
};
