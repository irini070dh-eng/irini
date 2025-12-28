
import React, { useContext } from 'react';
import { LanguageContext } from '../index';
import { TRANSLATIONS } from '../constants';

const Footer: React.FC = () => {
  const langCtx = useContext(LanguageContext);
  if (!langCtx) return null;
  const t = TRANSLATIONS[langCtx.language];

  return (
    <footer id="contact" className="pt-24 pb-12 bg-zinc-950 border-t border-zinc-900 overflow-hidden relative">
      {/* Abstract Design Elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-zinc-800/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 gold-bg rounded-full flex items-center justify-center">
                <span className="text-zinc-950 font-bold text-lg">I</span>
              </div>
              <span className="text-xl font-serif tracking-widest uppercase">
                Greek <span className="gold-gradient font-bold">Irini</span>
              </span>
            </div>
            <p className="text-zinc-500 max-w-sm mb-8 leading-relaxed">
              {t.heroSub}
            </p>
            <div className="flex gap-4">
              {['FB', 'IG', 'TW', 'YT'].map(social => (
                <button key={social} className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:gold-bg hover:text-zinc-950 transition-all">
                  <span className="text-[10px] font-bold">{social}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif font-bold text-xl mb-8 tracking-widest uppercase">{t.contact}</h4>
            <ul className="space-y-4 text-zinc-500">
              <li className="flex items-start gap-4">
                <span className="text-gold-400">A:</span>
                <span>Weimarstraat 174, 2562 HD<br/>Den Haag, Holandia</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="text-gold-400">T:</span>
                <span>+31 (0) 70 555 0123</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="text-gold-400">E:</span>
                <span>info@greekirini.nl</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-xl mb-8 tracking-widest uppercase">Opening</h4>
            <ul className="space-y-4 text-zinc-500">
              <li className="flex justify-between">
                <span>Mon - Thu:</span>
                <span className="text-zinc-300">12:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span>Fri - Sat:</span>
                <span className="text-zinc-300">12:00 - 00:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-600 text-xs tracking-widest uppercase">
            &copy; 2025 Greek Irini. All rights reserved.
          </p>
          <div className="flex gap-8 text-zinc-600 text-xs tracking-widest uppercase">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Delivery</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
