import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import { type CountryCode, COUNTRY_CODES } from '../../constants/countryCodes';
import { tactileAudio } from '../../utils/audio';

interface CountryCodeDropdownProps {
  selectedCountry: CountryCode;
  onSelectCountry: (country: CountryCode) => void;
  isAr?: boolean;
}

export const CountryCodeDropdown: React.FC<CountryCodeDropdownProps> = ({
  selectedCountry,
  onSelectCountry,
  isAr = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase().replace(/^\+/, '');
    if (!q) return COUNTRY_CODES;

    return COUNTRY_CODES.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(q);
      const nameArMatch = item.nameAr.includes(q);
      const dialCodeMatch = item.dialCode.replace(/^\+/, '').includes(q);
      const codeMatch = item.code.toLowerCase().includes(q);
      return nameMatch || nameArMatch || dialCodeMatch || codeMatch;
    });
  }, [searchQuery]);

  const handleToggle = () => {
    tactileAudio.playScrubTick(340);
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery('');
    }
  };

  const handleSelect = (country: CountryCode) => {
    tactileAudio.playScrubTick(420);
    onSelectCountry(country);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative shrink-0" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`flex items-center gap-1.5 py-3.5 px-3 hover:bg-brown-100/50 transition-colors cursor-pointer select-none text-brown-800 ${
          isAr ? 'border-l border-brown-200/50 pl-3' : 'border-r border-brown-200/50 pr-3'
        }`}
        title={isAr ? selectedCountry.nameAr : selectedCountry.name}
      >
        <span className="text-base leading-none" role="img" aria-label={selectedCountry.name}>
          {selectedCountry.flag}
        </span>
        <span className="text-xs sm:text-sm font-medium tracking-tight dir-ltr font-mono text-brown-800">
          {selectedCountry.dialCode}
        </span>
        <ChevronDown
          size={14}
          className={`text-brown-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-burgundy-600' : ''}`}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 w-72 sm:w-80 bg-[#FAF7F2] border border-brown-200/70 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in ${
            isAr ? 'right-0' : 'left-0'
          }`}
          style={{ animationDuration: '150ms' }}
        >
          {/* Search Header */}
          <div className="p-2.5 border-b border-brown-200/40 bg-[#F4EFEA]/80">
            <div className="relative flex items-center">
              <Search
                size={14}
                className={`absolute ${isAr ? 'right-3' : 'left-3'} text-brown-400 pointer-events-none`}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث عن الدولة أو الرمز...' : 'Search country or code...'}
                className={`w-full ${
                  isAr ? 'pr-8 pl-8' : 'pl-8 pr-8'
                } py-2 rounded-xl bg-[#FAF7F2] border border-brown-200/60 text-xs sm:text-sm text-brown-900 placeholder:text-brown-400 focus:outline-none focus:ring-1 focus:ring-burgundy-500/60 transition-all`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className={`absolute ${isAr ? 'left-2.5' : 'right-2.5'} text-brown-400 hover:text-brown-700 p-0.5`}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Countries List */}
          <div
            className="max-h-64 overflow-y-auto divide-y divide-brown-100/60 custom-scrollbar"
            role="listbox"
          >
            {filteredCountries.length === 0 ? (
              <div className="py-6 px-4 text-center text-xs text-brown-400">
                {isAr ? 'لم يتم العثور على أي دولة' : 'No countries found'}
              </div>
            ) : (
              filteredCountries.map((country) => {
                const isSelected = country.code === selectedCountry.code;
                return (
                  <button
                    key={`${country.code}-${country.dialCode}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(country)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blush-100/60 text-burgundy-900 font-medium'
                        : 'hover:bg-brown-100/40 text-brown-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="text-lg leading-none shrink-0" role="img" aria-label={country.name}>
                        {country.flag}
                      </span>
                      <div className="flex flex-col min-w-0 text-xs sm:text-sm truncate">
                        <span className="truncate text-brown-900 font-medium">
                          {isAr ? country.nameAr : country.name}
                        </span>
                        <span className="text-[10px] text-brown-400 truncate">
                          {isAr ? country.name : country.nameAr}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="dir-ltr font-mono text-xs font-semibold text-brown-600 bg-brown-200/40 px-2 py-0.5 rounded-full">
                        {country.dialCode}
                      </span>
                      {isSelected && (
                        <Check size={14} className="text-burgundy-600 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
