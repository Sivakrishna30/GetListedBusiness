import React, { createContext, useContext, useState, useEffect } from 'react';

export type BrandTheme = 'theme-b' | 'theme-a';

export interface ThemeTokens {
  name: string;
  label: string;
  description: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primarySubtle: string;
  deepBrand: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  bgApp: string;
  bgSurface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  // Semantic Colors (Identical across themes)
  success: string;
  warning: string;
  error: string;
  info: string;
}

export const THEME_B_TOKENS: ThemeTokens = {
  name: 'theme-b',
  label: 'Royal Blue + Coral',
  description: 'Modern, vibrant identity connecting businesses (Royal Blue) & customers (Coral) via an interlocking G',
  primary: '#2563EB', // Royal Blue
  primaryHover: '#1D4ED8',
  primaryLight: '#DBEAFE',
  primarySubtle: '#EFF6FF',
  deepBrand: '#1E3A8A', // Deep Blue
  accent: '#F97371', // Coral
  accentHover: '#E05654',
  accentSoft: '#FFF1F2', // Soft Coral
  bgApp: '#FAFAF9', // Warm White
  bgSurface: '#FFFFFF',
  textPrimary: '#18181B',
  textSecondary: '#52525B',
  border: '#E4E4E7',
  // Semantic
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  info: '#0284C7',
};

export const THEME_A_TOKENS: ThemeTokens = {
  name: 'theme-a',
  label: 'Current — Turquoise',
  description: 'Original turquoise and white visual theme preserved for baseline comparison',
  primary: '#0F766E', // Turquoise
  primaryHover: '#115E59',
  primaryLight: '#CCFBF1',
  primarySubtle: '#F0FDFA',
  deepBrand: '#134E4A',
  accent: '#14B8A6',
  accentHover: '#0D9488',
  accentSoft: '#F0FDFA',
  bgApp: '#FAFAF9',
  bgSurface: '#FFFFFF',
  textPrimary: '#18181B',
  textSecondary: '#52525B',
  border: '#E4E4E7',
  // Semantic
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  info: '#0284C7',
};

interface BrandThemeContextType {
  theme: BrandTheme;
  setTheme: (theme: BrandTheme) => void;
  toggleTheme: () => void;
  tokens: ThemeTokens;
}

const BrandThemeContext = createContext<BrandThemeContextType | undefined>(undefined);

export const BrandThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<BrandTheme>(() => {
    const saved = localStorage.getItem('glb_brand_theme');
    return saved === 'theme-a' ? 'theme-a' : 'theme-b';
  });

  const setTheme = (newTheme: BrandTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('glb_brand_theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'theme-b' ? 'theme-a' : 'theme-b');
  };

  const tokens = theme === 'theme-b' ? THEME_B_TOKENS : THEME_A_TOKENS;

  // Apply CSS custom properties to root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-brand-theme', theme);
    root.style.setProperty('--brand-primary', tokens.primary);
    root.style.setProperty('--brand-primary-hover', tokens.primaryHover);
    root.style.setProperty('--brand-primary-light', tokens.primaryLight);
    root.style.setProperty('--brand-primary-subtle', tokens.primarySubtle);
    root.style.setProperty('--brand-deep', tokens.deepBrand);
    root.style.setProperty('--brand-accent', tokens.accent);
    root.style.setProperty('--brand-accent-hover', tokens.accentHover);
    root.style.setProperty('--brand-accent-soft', tokens.accentSoft);
    root.style.setProperty('--brand-bg-app', tokens.bgApp);
    root.style.setProperty('--brand-bg-surface', tokens.bgSurface);
    root.style.setProperty('--brand-text-primary', tokens.textPrimary);
    root.style.setProperty('--brand-text-secondary', tokens.textSecondary);
    root.style.setProperty('--brand-border', tokens.border);
    root.style.setProperty('--semantic-success', tokens.success);
    root.style.setProperty('--semantic-warning', tokens.warning);
    root.style.setProperty('--semantic-error', tokens.error);
    root.style.setProperty('--semantic-info', tokens.info);
  }, [theme, tokens]);

  return (
    <BrandThemeContext.Provider value={{ theme, setTheme, toggleTheme, tokens }}>
      {children}
    </BrandThemeContext.Provider>
  );
};

export const useBrandTheme = (): BrandThemeContextType => {
  const context = useContext(BrandThemeContext);
  if (!context) {
    return {
      theme: 'theme-b',
      setTheme: () => {},
      toggleTheme: () => {},
      tokens: THEME_B_TOKENS,
    };
  }
  return context;
};
