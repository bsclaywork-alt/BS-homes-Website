import React, { useState, useEffect } from 'react';
import { ChevronDown, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface CountryInfo {
  code: string;       // Dialing code e.g. "+91"
  iso: string;        // ISO code e.g. "IN"
  name: string;       // Country name
  flag: string;       // Emoji flag
  digits: number;     // Expected mobile number length (digits only)
  placeholder: string;
}

export const SUPPORTED_COUNTRIES: CountryInfo[] = [
  { code: '+91', iso: 'IN', name: 'India', flag: '🇮🇳', digits: 10, placeholder: '98765 43210' },
  { code: '+1', iso: 'US', name: 'USA / Canada', flag: '🇺🇸', digits: 10, placeholder: '415 555 2671' },
  { code: '+44', iso: 'GB', name: 'United Kingdom', flag: '🇬🇧', digits: 10, placeholder: '7911 123456' },
  { code: '+971', iso: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', digits: 9, placeholder: '50 123 4567' },
  { code: '+65', iso: 'SG', name: 'Singapore', flag: '🇸🇬', digits: 8, placeholder: '8123 4567' },
  { code: '+61', iso: 'AU', name: 'Australia', flag: '🇦🇺', digits: 9, placeholder: '412 345 678' },
  { code: '+966', iso: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', digits: 9, placeholder: '50 123 4567' },
  { code: '+974', iso: 'QA', name: 'Qatar', flag: '🇶🇦', digits: 8, placeholder: '3312 3456' },
  { code: '+965', iso: 'KW', name: 'Kuwait', flag: '🇰🇼', digits: 8, placeholder: '9123 4567' },
  { code: '+973', iso: 'BH', name: 'Bahrain', flag: '🇧🇭', digits: 8, placeholder: '3912 3456' },
  { code: '+968', iso: 'OM', name: 'Oman', flag: '🇴🇲', digits: 8, placeholder: '9123 4567' },
  { code: '+49', iso: 'DE', name: 'Germany', flag: '🇩🇪', digits: 10, placeholder: '151 2345678' },
  { code: '+60', iso: 'MY', name: 'Malaysia', flag: '🇲🇾', digits: 10, placeholder: '12 345 6789' },
  { code: '+33', iso: 'FR', name: 'France', flag: '🇫🇷', digits: 9, placeholder: '6 12 34 56 78' },
  { code: '+81', iso: 'JP', name: 'Japan', flag: '🇯🇵', digits: 10, placeholder: '90 1234 5678' },
];

export const validateMobileNumber = (
  countryCode: string,
  rawPhone: string
): { isValid: boolean; message?: string; cleanDigits: string; expectedDigits: number } => {
  const country = SUPPORTED_COUNTRIES.find(c => c.code === countryCode) || SUPPORTED_COUNTRIES[0];
  const cleanDigits = (rawPhone || '').replace(/\D/g, '');
  const expectedDigits = country.digits;

  if (!cleanDigits) {
    return {
      isValid: false,
      message: `Mobile number is required (${expectedDigits} digits for ${country.name}).`,
      cleanDigits,
      expectedDigits
    };
  }

  if (cleanDigits.length < expectedDigits) {
    return {
      isValid: false,
      message: `Please enter a valid ${expectedDigits}-digit mobile number for ${country.name}. Currently entered ${cleanDigits.length} digits.`,
      cleanDigits,
      expectedDigits
    };
  }

  if (cleanDigits.length > expectedDigits) {
    return {
      isValid: false,
      message: `Mobile number must be exactly ${expectedDigits} digits for ${country.name}. Currently entered ${cleanDigits.length} digits.`,
      cleanDigits,
      expectedDigits
    };
  }

  return { isValid: true, cleanDigits, expectedDigits };
};

interface PhoneInputWithCountryProps {
  value: string;
  countryCode?: string;
  onChange: (fullNumber: string, countryCode: string, rawDigits: string) => void;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
  inputClassName?: string;
  showValidationAlert?: boolean;
  autoValidateOnBlur?: boolean;
}

export const PhoneInputWithCountry: React.FC<PhoneInputWithCountryProps> = ({
  value,
  countryCode = '+91',
  onChange,
  required = true,
  disabled = false,
  label,
  className = '',
  inputClassName = '',
  showValidationAlert = true,
  autoValidateOnBlur = true
}) => {
  const [selectedCode, setSelectedCode] = useState<string>(() => {
    // Check if initial value already starts with a supported country code
    if (value && value.startsWith('+')) {
      const matched = SUPPORTED_COUNTRIES.find(c => value.startsWith(c.code));
      if (matched) return matched.code;
    }
    return countryCode || '+91';
  });

  const [digits, setDigits] = useState<string>(() => {
    if (value) {
      const clean = value.replace(/\D/g, '');
      const matched = SUPPORTED_COUNTRIES.find(c => value.startsWith(c.code));
      if (matched) {
        const codeDigits = matched.code.replace(/\D/g, '');
        if (clean.startsWith(codeDigits)) {
          return clean.slice(codeDigits.length).slice(0, matched.digits);
        }
      }
      return clean.slice(0, 10);
    }
    return '';
  });

  const [isTouched, setIsTouched] = useState(false);

  const activeCountry = SUPPORTED_COUNTRIES.find(c => c.code === selectedCode) || SUPPORTED_COUNTRIES[0];
  const validation = validateMobileNumber(selectedCode, digits);
  const showError = isTouched && !validation.isValid && digits.length > 0;
  const isComplete = validation.isValid;

  // Sync internal state if parent changes value prop externally
  useEffect(() => {
    if (!value) {
      setDigits('');
      return;
    }
    const clean = value.replace(/\D/g, '');
    const matched = SUPPORTED_COUNTRIES.find(c => value.startsWith(c.code));
    if (matched) {
      setSelectedCode(matched.code);
      const codeDigits = matched.code.replace(/\D/g, '');
      if (clean.startsWith(codeDigits)) {
        setDigits(clean.slice(codeDigits.length).slice(0, matched.digits));
        return;
      }
    }
    if (clean.length <= activeCountry.digits) {
      setDigits(clean);
    }
  }, [value]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setSelectedCode(newCode);
    const newCountry = SUPPORTED_COUNTRIES.find(c => c.code === newCode) || SUPPORTED_COUNTRIES[0];
    const sliced = digits.slice(0, newCountry.digits);
    setDigits(sliced);
    onChange(`${newCode} ${sliced}`.trim(), newCode, sliced);
  };

  const handleDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, activeCountry.digits);
    setDigits(raw);
    setIsTouched(true);
    onChange(`${selectedCode} ${raw}`.trim(), selectedCode, raw);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-bold text-white/70">
          <span>{label} {required && <span className="text-art-gold">*</span>}</span>
          <span className="font-mono text-[9px] text-white/40">
            {digits.length}/{activeCountry.digits} digits
          </span>
        </div>
      )}

      <div className="flex rounded-sm overflow-hidden border border-white/15 focus-within:border-art-gold transition-all bg-white/[0.04]">
        {/* Country Code Dropdown */}
        <div className="relative shrink-0 flex items-center bg-white/10 border-r border-white/15 hover:bg-white/15 transition-colors">
          <select
            value={selectedCode}
            onChange={handleCountryChange}
            disabled={disabled}
            aria-label="Select Country Code"
            className="appearance-none bg-transparent pl-3 pr-7 py-3 text-xs font-mono font-bold text-art-gold outline-none cursor-pointer"
          >
            {SUPPORTED_COUNTRIES.map(country => (
              <option 
                key={country.iso} 
                value={country.code} 
                className="bg-[#1a1a1a] text-white font-sans text-xs py-1"
              >
                {country.flag} {country.name} ({country.code})
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 text-art-gold pointer-events-none opacity-80" />
        </div>

        {/* Mobile Number Input */}
        <div className="relative flex-1 flex items-center">
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={activeCountry.digits}
            value={digits}
            onChange={handleDigitsChange}
            onBlur={() => {
              if (autoValidateOnBlur) setIsTouched(true);
            }}
            placeholder={`e.g. ${activeCountry.placeholder}`}
            disabled={disabled}
            required={required}
            className={`w-full bg-transparent px-3.5 py-3 text-xs sm:text-sm font-mono text-white placeholder-white/25 outline-none transition-all ${inputClassName}`}
          />
          {isComplete && (
            <span className="pr-3 text-emerald-400" title="Valid mobile number">
              <CheckCircle2 size={15} />
            </span>
          )}
        </div>
      </div>

      {/* Validation Alert */}
      {showValidationAlert && showError && (
        <div className="flex items-center gap-1.5 p-2 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-[10px] font-mono animate-fadeIn">
          <AlertCircle size={13} className="shrink-0 text-red-400" />
          <span>{validation.message}</span>
        </div>
      )}
    </div>
  );
};
