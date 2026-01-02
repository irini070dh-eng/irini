import React, { useState } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import { FolkArtFlourish, FlowerArtCorner } from '../components/icons/FolkArtIcons';
import { FacebookIcon } from '../components/icons/SocialIcons';
import { useAppContext } from '../hooks/useAppContext';
// Import any needed data/components for sliders
// import TeamSlider from '../components/TeamSlider';
// import AdsSlider from '../components/AdsSlider';

const AboutPage: React.FC = () => {
  const { t } = useAppContext();

  // Zakładki: 0 = O nas, 1 = Zespół, 2 = Reklamy
  const [tab, setTab] = useState(0);

  return (
    <div className="py-24 bg-primary-dark text-text-light min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Zakładki */}
        <div className="flex justify-center mb-12 gap-4">
          <button
            className={`px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 border-2 border-folk-red/60 bg-folk-red/10 hover:bg-folk-red/30 focus:outline-none ${tab === 0 ? 'bg-folk-red/80 text-white' : 'text-folk-red'}`}
            onClick={() => setTab(0)}
          >O nas</button>
          <button
            className={`px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 border-2 border-folk-blue/60 bg-folk-blue/10 hover:bg-folk-blue/30 focus:outline-none ${tab === 1 ? 'bg-folk-blue/80 text-white' : 'text-folk-blue'}`}
            onClick={() => setTab(1)}
          >Zespół</button>
          <button
            className={`px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 border-2 border-folk-yellow/60 bg-folk-yellow/10 hover:bg-folk-yellow/30 focus:outline-none ${tab === 2 ? 'bg-folk-yellow text-gray-900' : 'text-gray-900
            onClick={() => setTab(2)}
          >Reklamy</button>
        </div>

        {/* Karty */}
        {tab === 0 && (
          <AnimatedSection key="about" className="mb-16">
            <div className="flex flex-col md:flex-row items-center gap-10 bg-folk-blue/10 rounded-3xl p-8 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="relative flex-shrink-0">
                <img
                  src="/images/logo o nas.png"
                  alt="Leniwa Baba logo"
                  className="w-72 h-72 md:w-96 md:h-96 rounded-full border-8 border-folk-blue shadow-xl object-cover bg-white"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="flex-1 text-center md:text-left z-10">
                <h1 className="text-5xl md:text-6xl font-bold text-folk-red font-serif mb-6">O nas</h1>
                <p className="text-xl md:text-2xl text-text-light-secondary max-w-2xl mx-auto md:mx-0">
                  Witamy w Leniwej Babie, gdzie przenosimy kawałek Polski do serca Hagi. Nasza restauracja to rodzinne przedsięwzięcie, zrodzone z pasji do autentycznych polskich przepisów przekazywanych z pokolenia na pokolenie. Każde danie tworzone jest z miłością i z najlepszych składników, abyście mogli poczuć ciepło polskiej, domowej kuchni. Zapraszamy w kulinarną podróż po Polsce.
                </p>
              </div>
              <FlowerArtCorner className="absolute top-0 left-0 w-24 h-24 text-folk-red opacity-20 pointer-events-none" />
              <FlowerArtCorner className="absolute top-0 right-0 w-24 h-24 text-folk-red opacity-20 pointer-events-none transform rotate-90" />
              <FlowerArtCorner className="absolute bottom-0 left-0 w-24 h-24 text-folk-red opacity-20 pointer-events-none transform -rotate-90" />
              <FlowerArtCorner className="absolute bottom-0 right-0 w-24 h-24 text-folk-red opacity-20 pointer-events-none transform rotate-180" />
            </div>
          </AnimatedSection>
        )}

        {tab === 1 && (
          <AnimatedSection key="team" className="mb-16">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md bg-folk-blue/10 rounded-3xl p-8 shadow-xl">
                <div className="flex flex-col items-center">
                  <div className="relative w-72 h-72 rounded-3xl border-4 border-folk-red overflow-hidden mb-4">
                    <img
                      src="/images/Menedżer.jpg"
                      alt="Jacek Kowalski Szef Kuchni"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Jacek Kowalski</h2>
                  <div className="text-xl font-semibold text-amber-400 mb-2">Szef Kuchni</div>
                </div>
              </div>
              <div className="mt-8 text-2xl text-folk-red font-bold">Idealne na każdą okazję</div>
            </div>
          </AnimatedSection>
        )}

        {tab === 2 && (
          <AnimatedSection key="ads">
            <div className="flex flex-col items-center">
              <h2 className="text-4xl font-bold text-folk-red mb-8">Zobacz nasze reklamy</h2>
              <div className="flex gap-8 justify-center">
                <div className="w-60 h-80 bg-black rounded-2xl shadow-lg overflow-hidden flex flex-col items-end justify-end p-4 relative">
                  <img src="/images/Karminadel (kotlet mielony).jpg" alt="Smak Tradycji" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                  <div className="relative z-10 text-white text-lg font-bold">Smak Tradycji</div>
                </div>
                <div className="w-60 h-80 bg-black rounded-2xl shadow-lg overflow-hidden flex flex-col items-end justify-end p-4 relative">
                  <img src="/videos/konkurs .jpg" alt="Konkurs" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                  <div className="relative z-10 text-white text-lg font-bold">Konkurs</div>
                </div>
                <div className="w-60 h-80 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col items-end justify-end p-4 relative">
                  <img src="/images/okładka strony11.jpg" alt="Weekendowa Promocja" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                  <div className="relative z-10 text-black text-lg font-bold">Weekendowa Promocja</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
};

export default AboutPage;

