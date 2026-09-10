import React, { useState, useRef, useEffect } from 'react';
import { COUNTRIES, DEFAULT_COUNTRY, findCountryByDialCode } from '../../data/countries';
import { FiChevronDown, FiSearch, FiPhone, FiCheck } from 'react-icons/fi';
import './PhoneInput.css';

export const PhoneInput = ({
  value = '',
  onChange,
  countryCode = 'IN',
  onCountryChange,
  placeholder = 'Enter phone number',
  label = 'Phone Number',
  required = false,
  id = 'phone-input'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) || DEFAULT_COUNTRY;

  // Filter countries by name, code or dialCode
  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dialCode.includes(search) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country) => {
    if (onCountryChange) onCountryChange(country.code);
    setIsOpen(false);
    setSearch('');
  };

  const handleInputChange = (e) => {
    let inputVal = e.target.value;

    // Check if user pasted full international number with +dialCode
    if (inputVal.startsWith('+')) {
      for (const country of COUNTRIES) {
        if (inputVal.startsWith(country.dialCode)) {
          if (onCountryChange) onCountryChange(country.code);
          inputVal = inputVal.slice(country.dialCode.length).trim();
          break;
        }
      }
    }

    if (onChange) onChange(inputVal);
  };

  return (
    <div className="phone-input-field-group">
      {label && <label htmlFor={id} className="phone-field-label">{label}{required && ' *'}</label>}
      
      <div className="phone-input-control-box" ref={dropdownRef}>
        {/* Country Selector Button */}
        <button
          type="button"
          className="country-picker-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          title={`Selected: ${selectedCountry.name} (${selectedCountry.dialCode})`}
        >
          <span className="country-flag">{selectedCountry.flag}</span>
          <span className="country-dial-code">{selectedCountry.dialCode}</span>
          <FiChevronDown className={`picker-chevron ${isOpen ? 'rotate' : ''}`} />
        </button>

        {/* Number Input */}
        <div className="phone-number-input-wrap">
          <FiPhone className="phone-box-icon" />
          <input
            id={id}
            type="tel"
            className="phone-raw-input"
            placeholder={selectedCountry.format || placeholder}
            value={value}
            onChange={handleInputChange}
            required={required}
            autoComplete="tel-national"
          />
        </div>

        {/* Country Search Dropdown */}
        {isOpen && (
          <div className="country-select-dropdown animate-pop-in">
            <div className="dropdown-search-box">
              <FiSearch className="dropdown-search-icon" />
              <input
                type="text"
                className="dropdown-search-input"
                placeholder="Search country or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div className="countries-scroll-list" role="listbox">
              {filteredCountries.map((c) => {
                const isSelected = c.code === selectedCountry.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    className={`country-option-item ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleCountrySelect(c)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="opt-flag">{c.flag}</span>
                    <span className="opt-name">{c.name}</span>
                    <span className="opt-dial">{c.dialCode}</span>
                    {isSelected && <FiCheck className="opt-check" />}
                  </button>
                );
              })}
              {filteredCountries.length === 0 && (
                <div className="no-country-found">No matching country found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
