import React from 'react';
import { ShieldCheck, HeartHandshake, Scale, Award, MapPin } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 pb-24 sm:pb-12">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-100 px-3 py-1 rounded-full">
          Our Agricultural Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          About FarmDirect (फार्मडायरेक्ट)
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto">
          Reinventing farmgate-to-fork commerce for rural farmers and conscious urban households in India.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-earth-200 shadow-soft space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-stone-900">The Problem with Traditional Produce Supply Chains</h2>
          <p>
            In conventional Indian agriculture, a tomato or onion travels through 4 to 6 tiers of middlemen—village commission agents, wholesale APMC traders, secondary transport distributors, and local cart vendors. By the time it arrives on a customer's plate 48 to 72 hours later:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-stone-600">
            <li>The farmer receives barely <strong>20% to 35%</strong> of the end retail price.</li>
            <li>Produce has lost its natural vitality, crispness, and nutritional value in transit.</li>
            <li>Unsubstantiated claims of "organic" are stamped on food without verifiable proof.</li>
          </ul>
        </div>

        <div className="space-y-3 border-t border-earth-100 pt-6">
          <h2 className="text-lg font-bold text-stone-900">The FarmDirect Commitment</h2>
          <p>
            FarmDirect was established in the fertile agriculture corridor of Maharashtra (Nashik – Pune) to restore direct dignity and transparency to agriculture:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-earth-50 border border-earth-200 space-y-1.5">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-agri-700" />
                <span>85%+ Direct Farmgate Realization</span>
              </span>
              <p className="text-xs text-stone-500">
                Payment goes straight into verified farmer bank/UPI accounts with minimal platform maintenance overhead.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-earth-50 border border-earth-200 space-y-1.5">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-700" />
                <span>Honest Verification Policy</span>
              </span>
              <p className="text-xs text-stone-500">
                Never call produce "certified organic" without laboratory verification documents. Farmers submit 7/12 land records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
