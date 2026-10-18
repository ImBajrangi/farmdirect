import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Heart, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-earth-900 text-earth-100 pt-12 pb-24 sm:pb-12 border-t border-earth-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-earth-800">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <span className="text-xl font-bold tracking-tight text-white">FarmDirect</span>
            </div>
            <p className="text-xs text-earth-300 leading-relaxed">
              Bridging the gap between hardworking Indian farmers and mindful buyers.
              Fresh harvest at fair farmgate rates with zero predatory middlemen.
            </p>
            <div className="pt-2 text-xs text-agri-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Pilot Active: Nashik – Pune Peri-Urban Corridor</span>
            </div>
          </div>

          {/* Column 2: Marketplace Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-earth-400 mb-3">Marketplace</h4>
            <ul className="space-y-2 text-xs text-earth-200">
              <li><Link to="/marketplace" className="hover:text-white transition">Browse All Produce</Link></li>
              <li><Link to="/marketplace?category=vegetables" className="hover:text-white transition">Fresh Vegetables</Link></li>
              <li><Link to="/marketplace?category=fruits" className="hover:text-white transition">Orchard Fruits</Link></li>
              <li><Link to="/marketplace?category=grains" className="hover:text-white transition">Native Grains & Pulses</Link></li>
              <li><Link to="/farmer/register" className="text-saffron-400 font-semibold hover:underline">Farmer Registration (शेतकरी नोंदणी)</Link></li>
            </ul>
          </div>

          {/* Column 3: Trust & Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-earth-400 mb-3">Trust & Policies</h4>
            <ul className="space-y-2 text-xs text-earth-200">
              <li><Link to="/about" className="hover:text-white transition">About FarmDirect</Link></li>
              <li><Link to="/cancellation-refund" className="hover:text-white transition">Cancellation & Refund Policy</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy (DPDP)</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link to="/support" className="hover:text-white transition">Help & FAQs</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Farmer Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-earth-400 mb-3">Farmer Helpline</h4>
            <div className="space-y-2.5 text-xs text-earth-200">
              <p className="text-earth-400">Field Operations & Support Desk:</p>
              <div className="flex items-center gap-2 text-white font-medium">
                <Phone className="w-4 h-4 text-agri-400" />
                <span>+91 9XXXX XXXXX</span>
              </div>
              <div className="bg-earth-800/80 p-3 rounded-xl border border-earth-700/60 mt-2">
                <div className="flex items-center gap-1.5 text-agri-400 font-semibold text-[11px] mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Honest Product Guarantee</span>
                </div>
                <p className="text-[11px] text-earth-300">
                  Products are certified organic only when proven by NPOP / PGS-India laboratory documentation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-earth-400 gap-3">
          <p>© {new Date().getFullYear()} FarmDirect. Built for Indian Farmers & Consumers.</p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Engineered with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>for rural empowerment in Maharashtra</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
