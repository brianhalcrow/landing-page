export interface CountryCode {
  code: string;
  country: string;
}

export const countryCodes: CountryCode[] = [
  { code: "+44", country: "UK" },
  { code: "+1", country: "US/CA" },
  { code: "+61", country: "AU" },
  { code: "+49", country: "DE" },
  { code: "+33", country: "FR" },
  { code: "+34", country: "ES" },
  { code: "+39", country: "IT" },
  { code: "+31", country: "NL" },
  { code: "+41", country: "CH" },
  { code: "+65", country: "SG" },
  { code: "+852", country: "HK" },
  { code: "+81", country: "JP" },
  { code: "+82", country: "KR" },
  { code: "+86", country: "CN" },
  // Add more country codes as needed
]; 