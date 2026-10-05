import React, { useState } from 'react';
import { useBrandTheme, THEME_A_TOKENS, THEME_B_TOKENS, BrandTheme } from '../context/BrandThemeContext.tsx';
import { Logo, TwoSidedGSymbol } from '../components/Logo.tsx';
import {
  Sparkles,
  Check,
  Copy,
  LayoutDashboard,
  Calendar,
  Compass,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Palette,
  ShieldCheck,
  Building2,
  Users,
  Search,
  ExternalLink,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';

interface BrandPreviewPageProps {
  onNavigate?: (path: string) => void;
}

export const BrandPreviewPage: React.FC<BrandPreviewPageProps> = ({ onNavigate }) => {
  const { theme, setTheme, tokens } = useBrandTheme();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'logo' | 'colors' | 'components' | 'comparison'>('overview');
  
  // Interactive UI preview states
  const [formInputVal, setFormInputVal] = useState('Acme Wellness & Spa');
  const [toggleState, setToggleState] = useState(true);
  const [selectedRadio, setSelectedRadio] = useState('pro');
  const [selectedTableRow, setSelectedTableRow] = useState<number>(1);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isThemeB = theme === 'theme-b';

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#18181B] pb-24">
      {/* Top Banner: Brand Exploration Mode Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  Visual Identity & Brand System
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-300 font-medium">Interactive Exploration</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                GetListed Brand System & Logo Exploration
              </h1>
              <p className="mt-1 text-sm sm:text-base text-slate-300 max-w-2xl">
                Comparing the previous Turquoise identity against the new <span className="text-blue-400 font-semibold">Royal Blue (#2563EB)</span> + <span className="text-rose-400 font-semibold">Coral (#F97371)</span> direction with the interlocking <span className="text-white font-semibold">Two-Sided G</span> symbol.
              </p>
            </div>

            {/* Main Theme Switcher Switch Tabs */}
            <div className="bg-slate-950/80 p-1.5 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 shrink-0 shadow-lg">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 py-1 sm:py-0">
                Active Theme:
              </span>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg">
                <button
                  id="theme-btn-turquoise"
                  onClick={() => setTheme('theme-a')}
                  className={`px-3.5 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    theme === 'theme-a'
                      ? 'bg-[#0F766E] text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#0F766E] border border-white/40"></span>
                  <span>Theme A: Turquoise</span>
                </button>
                <button
                  id="theme-btn-royal-coral"
                  onClick={() => setTheme('theme-b')}
                  className={`px-3.5 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    theme === 'theme-b'
                      ? 'bg-gradient-to-r from-[#2563EB] to-[#F97371] text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center -space-x-1">
                    <span className="w-3 h-3 rounded-full bg-[#2563EB] border border-white/40"></span>
                    <span className="w-3 h-3 rounded-full bg-[#F97371] border border-white/40"></span>
                  </div>
                  <span>Theme B: Royal Blue + Coral</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Bar inside Brand Preview */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-700/60 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: '1. Executive Overview' },
              { id: 'logo', label: '2. Two-Sided G Logo' },
              { id: 'colors', label: '3. Brand Color Palette' },
              { id: 'components', label: '4. UI Component Library' },
              { id: 'comparison', label: '5. Side-by-Side Comparison' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {(activeTab === 'overview' || activeTab === 'comparison') && (
          <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-6 border-b border-stone-200">
              <div>
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <span>Brand Architecture & Strategic Shift</span>
                </h2>
                <p className="text-sm text-stone-500 mt-0.5">
                  Transitioning GetListed from a single-hue utility tool into a vibrant, dual-sided marketplace platform.
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isThemeB ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'
              }`}>
                Active: {tokens.label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Concept 1 */}
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200/80">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-3">
                  🔵
                </div>
                <h3 className="font-bold text-stone-900 text-base">Business Dimension</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Represented by <strong>Royal Blue (#2563EB)</strong> and <strong>Deep Blue (#1E3A8A)</strong>. Communicates enterprise reliability, structure, inventory management, and business stability.
                </p>
              </div>

              {/* Concept 2 */}
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200/80">
                <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold mb-3">
                  🪸
                </div>
                <h3 className="font-bold text-stone-900 text-base">Customer Dimension</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Represented by <strong>Coral (#F97371)</strong> and <strong>Soft Coral (#FFF1F2)</strong>. Communicates discovery, friendly interaction, spontaneous booking, and consumer energy.
                </p>
              </div>

              {/* Concept 3 */}
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200/80">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mb-3">
                  🏹
                </div>
                <h3 className="font-bold text-stone-900 text-base">Two Arrows Meeting in the "G"</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Two complementary dynamic arrows form the letter <strong>G</strong>: the business arrow sweeps down the spine while the customer arrow loops inwards into the core, capturing the exact feel of <strong>Customer Meets Business</strong>.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: TWO-SIDED G LOGO SYSTEM */}
        {(activeTab === 'logo' || activeTab === 'overview') && (
          <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
              <div>
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <span>Two-Sided G — Logo Variant Family</span>
                </h2>
                <p className="text-sm text-stone-500 mt-0.5">
                  Clean, geometric vector implementation scalable from 16px favicon up to billboards.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-500">Render Context:</span>
                <span className="px-2.5 py-1 bg-stone-100 rounded-md text-xs font-medium text-stone-700">
                  Theme: {tokens.label}
                </span>
              </div>
            </div>

            {/* Variant Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 1. Full Logo with Tagline */}
              <div className="p-6 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col items-center justify-between min-h-[200px] text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 self-start">
                  1. Full Logo + Tagline
                </span>
                <div className="py-4">
                  <Logo variant="full" size="md" tagline="Bring Your Business to the World" />
                </div>
                <span className="text-2xs text-stone-500 font-mono">
                  &lt;Logo variant="full" tagline /&gt;
                </span>
              </div>

              {/* 2. Horizontal Logo */}
              <div className="p-6 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col items-center justify-between min-h-[200px] text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 self-start">
                  2. Horizontal Logo
                </span>
                <div className="py-4">
                  <Logo variant="horizontal" size="md" />
                </div>
                <span className="text-2xs text-stone-500 font-mono">
                  &lt;Logo variant="horizontal" /&gt;
                </span>
              </div>

              {/* 3. Stacked Logo */}
              <div className="p-6 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col items-center justify-between min-h-[200px] text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 self-start">
                  3. Stacked Logo
                </span>
                <div className="py-4">
                  <Logo variant="stacked" size="md" />
                </div>
                <span className="text-2xs text-stone-500 font-mono">
                  &lt;Logo variant="stacked" /&gt;
                </span>
              </div>

              {/* 4. Symbol Only */}
              <div className="p-6 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col items-center justify-between min-h-[200px] text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 self-start">
                  4. Symbol Only
                </span>
                <div className="py-4">
                  <Logo variant="symbol" size={48} />
                </div>
                <span className="text-2xs text-stone-500 font-mono">
                  &lt;Logo variant="symbol" size=&#123;48&#125; /&gt;
                </span>
              </div>
            </div>

            {/* Small Scale & Favicon Test */}
            <div className="p-6 rounded-xl border border-stone-200 bg-stone-50">
              <h3 className="text-sm font-bold text-stone-900 mb-2">
                Scalability & Optical Clarity (16px, 20px, 24px, 32px, 48px, 64px, 80px)
              </h3>
              <p className="text-xs text-stone-500 mb-6">
                Verifying the two-part connection remains immediately recognizable even at micro favicon resolutions.
              </p>
              <div className="flex flex-wrap items-end gap-6 sm:gap-10 p-4 bg-white rounded-lg border border-stone-200/80">
                {[16, 20, 24, 32, 48, 64, 80].map((s) => (
                  <div key={s} className="flex flex-col items-center gap-2">
                    <TwoSidedGSymbol size={s} />
                    <span className="text-3xs font-mono text-stone-400">{s}px</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contrast & Surface Compatibility Matrix */}
            <div>
              <h3 className="text-sm font-bold text-stone-900 mb-2">
                Surface & Background Compatibility Matrix
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                The logo is engineered to thrive across pure white, warm white, dark navy, solid royal blue, and monochrome black/white contexts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. Pure White */}
                <div className="p-5 rounded-xl border border-stone-200 bg-white shadow-2xs flex flex-col items-center justify-center min-h-[140px] text-center">
                  <span className="text-3xs font-bold uppercase text-stone-400 mb-3">Pure White (#FFFFFF)</span>
                  <Logo variant="horizontal" size="sm" />
                </div>

                {/* 2. Warm White */}
                <div className="p-5 rounded-xl border border-stone-200 bg-[#FAFAF9] flex flex-col items-center justify-center min-h-[140px] text-center">
                  <span className="text-3xs font-bold uppercase text-stone-400 mb-3">Warm White (#FAFAF9)</span>
                  <Logo variant="horizontal" size="sm" />
                </div>

                {/* 3. Dark Navy */}
                <div className="p-5 rounded-xl bg-[#0F172A] text-white flex flex-col items-center justify-center min-h-[140px] text-center shadow-inner">
                  <span className="text-3xs font-bold uppercase text-slate-400 mb-3">Dark Navy (#0F172A)</span>
                  <Logo variant="horizontal" size="sm" themeMode="white" />
                </div>

                {/* 4. Solid Royal Blue */}
                <div className="p-5 rounded-xl bg-[#2563EB] text-white flex flex-col items-center justify-center min-h-[140px] text-center shadow-inner">
                  <span className="text-3xs font-bold uppercase text-blue-100 mb-3">Solid Royal Blue (#2563EB)</span>
                  <Logo variant="horizontal" size="sm" themeMode="blue" />
                </div>

                {/* 5. High-Contrast Monochrome */}
                <div className="p-5 rounded-xl border border-stone-200 bg-stone-100 flex flex-col items-center justify-center min-h-[140px] text-center">
                  <span className="text-3xs font-bold uppercase text-stone-500 mb-3">Monochrome Black</span>
                  <Logo variant="horizontal" size="sm" themeMode="dark" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: BRAND COLOR PALETTE & DESIGN TOKENS */}
        {(activeTab === 'colors' || activeTab === 'overview') && (
          <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
              <div>
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <span>Brand Color Tokens & Semantic Specification</span>
                </h2>
                <p className="text-sm text-stone-500 mt-0.5">
                  Independent semantic status tokens paired with high-intent brand anchors.
                </p>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(tokens, null, 2), 'tokens_json')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              >
                {copiedCode === 'tokens_json' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied Token JSON!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON Tokens</span>
                  </>
                )}
              </button>
            </div>

            {/* Brand Colors - Theme B Specification */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-stone-900">
                  Theme B: GetListed Royal Blue + Coral System
                </h3>
                <span className="text-xs text-stone-500">Click swatch to copy hex code</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {[
                  { label: 'Primary (Royal Blue)', hex: THEME_B_TOKENS.primary, textColor: 'text-white' },
                  { label: 'Deep Brand', hex: THEME_B_TOKENS.deepBrand, textColor: 'text-white' },
                  { label: 'Accent (Coral)', hex: THEME_B_TOKENS.accent, textColor: 'text-white' },
                  { label: 'Soft Coral', hex: THEME_B_TOKENS.accentSoft, textColor: 'text-stone-900', border: true },
                  { label: 'Warm White (Bg)', hex: THEME_B_TOKENS.bgApp, textColor: 'text-stone-900', border: true },
                  { label: 'Surface (White)', hex: THEME_B_TOKENS.bgSurface, textColor: 'text-stone-900', border: true },
                  { label: 'Primary Text', hex: THEME_B_TOKENS.textPrimary, textColor: 'text-white' },
                  { label: 'Border', hex: THEME_B_TOKENS.border, textColor: 'text-stone-900', border: true },
                ].map((swatch) => (
                  <button
                    key={swatch.label}
                    onClick={() => handleCopy(swatch.hex, swatch.label)}
                    style={{ backgroundColor: swatch.hex }}
                    className={`p-3 rounded-xl flex flex-col justify-between h-28 text-left transition-transform hover:scale-102 cursor-pointer relative group ${
                      swatch.textColor
                    } ${swatch.border ? 'border border-stone-200' : 'shadow-2xs'}`}
                  >
                    <span className="text-3xs font-semibold leading-tight opacity-90">{swatch.label}</span>
                    <div>
                      <span className="text-xs font-mono font-bold block">{swatch.hex}</span>
                      <span className="text-3xs opacity-75 font-sans">
                        {copiedCode === swatch.label ? '✓ Copied' : 'Copy Hex'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Semantic Status Colors (Independent from Coral) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-stone-900">Semantic Colors</h3>
                  <span className="text-2xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                    Independent from Brand Coral
                  </span>
                </div>
                <span className="text-xs text-stone-500">Crucial: Coral is never used as an error state</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Success', hex: '#16A34A', desc: 'Active, Confirmed, Paid', bg: 'bg-[#16A34A]' },
                  { label: 'Warning', hex: '#D97706', desc: 'Pending, Expiring, Low Stock', bg: 'bg-[#D97706]' },
                  { label: 'Error', hex: '#DC2626', desc: 'Cancelled, Failed, Overdue', bg: 'bg-[#DC2626]' },
                  { label: 'Info', hex: '#0284C7', desc: 'Details, Notices, Notes', bg: 'bg-[#0284C7]' },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleCopy(s.hex, s.label)}
                    className={`${s.bg} text-white p-4 rounded-xl flex flex-col justify-between h-24 text-left transition-transform hover:scale-102 cursor-pointer shadow-2xs`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{s.label}</span>
                      <span className="text-3xs font-mono font-bold bg-black/20 px-1.5 py-0.5 rounded">{s.hex}</span>
                    </div>
                    <span className="text-3xs opacity-85">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: UI COMPONENT LIBRARY PREVIEW */}
        {(activeTab === 'components' || activeTab === 'overview') && (
          <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
              <div>
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <span>Interactive UI Component Library</span>
                </h2>
                <p className="text-sm text-stone-500 mt-0.5">
                  Live preview of GetListed design system components under the active theme (<span className="font-semibold text-stone-700">{tokens.label}</span>).
                </p>
              </div>

              {/* In-view quick toggle */}
              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg">
                <button
                  onClick={() => setTheme('theme-a')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                    theme === 'theme-a' ? 'bg-white text-teal-800 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Turquoise
                </button>
                <button
                  onClick={() => setTheme('theme-b')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                    theme === 'theme-b' ? 'bg-white text-blue-600 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Royal Blue + Coral
                </button>
              </div>
            </div>

            {/* 1. Header & Navigation Simulation */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">1. Header & Navigation States</h3>
              <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs overflow-hidden">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <Logo variant="horizontal" size="sm" />
                    <div className="hidden sm:flex items-center gap-1 text-xs font-medium">
                      <span className="px-3 py-1.5 rounded-lg text-stone-500 hover:text-stone-900">Home</span>
                      <span
                        className="px-3 py-1.5 rounded-lg font-semibold"
                        style={{
                          backgroundColor: tokens.primaryLight,
                          color: tokens.primary,
                        }}
                      >
                        Explore Businesses
                      </span>
                      <span className="px-3 py-1.5 rounded-lg text-stone-500 hover:text-stone-900">My Bookings</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-2xs transition-colors"
                      style={{ backgroundColor: tokens.primary }}
                    >
                      Business Portal
                    </button>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-stone-100 text-xs font-semibold text-stone-700">
                      <div
                        className="w-5 h-5 rounded-full text-white flex items-center justify-center text-3xs font-bold"
                        style={{ backgroundColor: tokens.primary }}
                      >
                        S
                      </div>
                      <span>Sivakrishna</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Button Hierarchy */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">2. Button Hierarchy & Interactive States</h3>
              <div className="p-6 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-wrap items-center gap-3">
                {/* Primary Button */}
                <button
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white shadow-2xs transition-all hover:opacity-95 active:scale-98 cursor-pointer"
                  style={{ backgroundColor: tokens.primary }}
                >
                  Primary Action
                </button>

                {/* Accent Coral CTA (in Theme B) / Secondary Action */}
                <button
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white shadow-2xs transition-all hover:opacity-95 active:scale-98 cursor-pointer"
                  style={{ backgroundColor: isThemeB ? tokens.accent : tokens.primaryHover }}
                >
                  {isThemeB ? 'Coral Brand CTA' : 'Accent Button'}
                </button>

                {/* Secondary Button */}
                <button
                  className="px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  style={{
                    backgroundColor: tokens.primarySubtle,
                    color: tokens.primary,
                    border: `1px solid ${tokens.primaryLight}`,
                  }}
                >
                  Secondary Light
                </button>

                {/* Outline Button */}
                <button className="px-4 py-2 rounded-lg text-xs font-bold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 transition-colors cursor-pointer">
                  Outline Neutral
                </button>

                {/* Ghost Button */}
                <button className="px-4 py-2 rounded-lg text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer">
                  Ghost Action
                </button>

                {/* Destructive Button */}
                <button className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-2xs transition-colors cursor-pointer">
                  Destructive
                </button>
              </div>
            </div>

            {/* 3. Cards Matrix */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">3. Cards (KPI, Normal, Highlight)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* KPI Card */}
                <div className="p-5 rounded-xl border border-stone-200 bg-white shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span>Monthly Gross Bookings</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-3xs flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +18.4%
                    </span>
                  </div>
                  <div className="text-2xl font-black text-stone-900 tabular-nums">$14,850.00</div>
                  <div className="mt-3 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: '72%', backgroundColor: tokens.primary }}></div>
                  </div>
                </div>

                {/* Normal Content Card */}
                <div className="p-5 rounded-xl border border-stone-200 bg-white shadow-2xs">
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Service Listing</div>
                  <h4 className="font-bold text-stone-900 text-sm">Deep Tissue & Cryo Recovery</h4>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    60-minute targeted sports recovery session with licensed physiotherapists.
                  </p>
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-stone-100">
                    <span className="text-sm font-bold text-stone-900">$120.00</span>
                    <span className="text-xs font-medium" style={{ color: tokens.primary }}>
                      Book Session →
                    </span>
                  </div>
                </div>

                {/* Highlight / Featured Card */}
                <div
                  className="p-5 rounded-xl border relative overflow-hidden"
                  style={{
                    borderColor: isThemeB ? '#FECDD3' : '#CCFBF1',
                    backgroundColor: isThemeB ? '#FFF1F2' : '#F0FDFA',
                  }}
                >
                  <div
                    className="inline-block px-2 py-0.5 rounded text-3xs font-extrabold uppercase tracking-wide text-white mb-2"
                    style={{ backgroundColor: isThemeB ? tokens.accent : tokens.primary }}
                  >
                    Featured Program
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">VIP Unlimited Wellness Pass</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    Includes monthly spa, infrared sauna sessions, and 15% discount on products.
                  </p>
                  <button
                    className="mt-4 w-full py-2 rounded-lg text-xs font-bold text-white shadow-2xs"
                    style={{ backgroundColor: isThemeB ? tokens.primary : tokens.primary }}
                  >
                    Upgrade Membership
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Status Notifications */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">4. Status Banners & Feedback States</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Appointment Confirmed</strong>
                    Your booking for Tuesday at 10:00 AM has been reserved.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Low Inventory Alert</strong>
                    Only 2 slots remaining for Saturday afternoon.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2.5 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Payment Failed</strong>
                    Please update your payment method to avoid cancellation.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 flex items-start gap-2.5 text-xs">
                  <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Operating Hours Update</strong>
                    Special holiday schedules are now in effect.
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Forms & Inputs */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">5. Forms, Interactive Controls & Focus Rings</h3>
              <div className="p-6 rounded-xl border border-stone-200 bg-stone-50/40 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Business Name (Focused)
                  </label>
                  <input
                    type="text"
                    value={formInputVal}
                    onChange={(e) => setFormInputVal(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border bg-white text-stone-900 transition-all outline-none"
                    style={{
                      borderColor: tokens.primary,
                      boxShadow: `0 0 0 3px ${tokens.primaryLight}`,
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Service Category Select
                  </label>
                  <select className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white text-stone-900 outline-none">
                    <option>Health & Wellness</option>
                    <option>Fitness & Training</option>
                    <option>Beauty & Salons</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Interactive Toggle Switch
                  </label>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => setToggleState(!toggleState)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        toggleState ? '' : 'bg-stone-300'
                      }`}
                      style={{ backgroundColor: toggleState ? tokens.primary : undefined }}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform absolute top-0.5 ${
                          toggleState ? 'translate-x-5.5' : 'translate-x-0.5'
                        }`}
                      ></div>
                    </button>
                    <span className="text-xs text-stone-600 font-medium">
                      {toggleState ? 'Online Bookings Active' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Table & Active Row */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">6. Data Table & Row Selection</h3>
              <div className="rounded-xl border border-stone-200 overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-3xs">
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {[
                      { id: 1, name: 'Emma Watson', service: 'Full Body Cryo', time: 'Today, 2:30 PM', price: '$85.00', status: 'CONFIRMED' },
                      { id: 2, name: 'David Miller', service: 'Deep Tissue Massage', time: 'Tomorrow, 11:00 AM', price: '$120.00', status: 'COMPLETED' },
                      { id: 3, name: 'Sophia Chen', service: 'Personal Training (1hr)', time: 'Fri, Oct 10, 9:00 AM', price: '$95.00', status: 'PENDING' },
                    ].map((row) => {
                      const isSelected = selectedTableRow === row.id;
                      return (
                        <tr
                          key={row.id}
                          onClick={() => setSelectedTableRow(row.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? ''
                              : 'hover:bg-stone-50/70'
                          }`}
                          style={{
                            backgroundColor: isSelected ? tokens.primarySubtle : undefined,
                          }}
                        >
                          <td className="py-3 px-4 font-semibold text-stone-900">{row.name}</td>
                          <td className="py-3 px-4 text-stone-600">{row.service}</td>
                          <td className="py-3 px-4 text-stone-500">{row.time}</td>
                          <td className="py-3 px-4 font-bold text-stone-900 tabular-nums">{row.price}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-3xs font-bold ${
                                row.status === 'CONFIRMED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : row.status === 'COMPLETED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 7. Badges Showcase */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">7. Badges (Category, Roles, Plans)</h3>
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-wrap gap-3 items-center">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-stone-200/80 text-stone-800">
                  Category: Wellness
                </span>
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-bold text-white shadow-2xs"
                  style={{ backgroundColor: tokens.primary }}
                >
                  Role: Owner
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Plan: PRO BUSINESS
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Business
                </span>
              </div>
            </div>

            {/* 8. Empty State Presentation */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">8. Illustrated Empty State</h3>
              <div className="p-8 rounded-xl border border-dashed border-stone-300 bg-white flex flex-col items-center justify-center text-center">
                <TwoSidedGSymbol size={56} className="mb-3 opacity-90" />
                <h4 className="font-bold text-stone-900 text-base">No Customer Appointments Scheduled</h4>
                <p className="text-xs text-stone-500 max-w-sm mt-1">
                  Share your public booking link with clients or create your first scheduled appointment now.
                </p>
                <button
                  className="mt-4 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-2xs"
                  style={{ backgroundColor: tokens.primary }}
                >
                  Create New Booking
                </button>
              </div>
            </div>
          </section>
        )}

        {/* TAB 5: SIDE-BY-SIDE THEME COMPARISON */}
        {(activeTab === 'comparison' || activeTab === 'overview') && (
          <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                Direct Side-by-Side Theme Comparison
              </h2>
              <p className="text-sm text-stone-500 mt-0.5">
                Compare Theme A (Turquoise) vs. Theme B (Royal Blue + Coral) across all core metrics and surfaces.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* THEME A COLUMN */}
              <div className="p-6 rounded-2xl border-2 border-teal-600 bg-teal-50/20 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-teal-200">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#0F766E]"></span>
                    <h3 className="font-bold text-stone-900 text-base">Theme A — Current Turquoise</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-teal-800">#0F766E</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-teal-200 space-y-3">
                  <Logo variant="horizontal" size="md" themeMode="theme-a" />
                  <p className="text-xs text-stone-600">
                    Single dominant teal/turquoise palette. Highly clean and readable, but lacks distinct consumer resonance.
                  </p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0F766E]">
                      Primary Action
                    </button>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0F766E] bg-[#CCFBF1]">
                      Secondary
                    </button>
                  </div>
                </div>

                <div className="text-xs text-stone-600 space-y-1">
                  <div><strong>Primary Color:</strong> #0F766E (Turquoise)</div>
                  <div><strong>Background:</strong> #FAFAF9 (Warm White)</div>
                  <div><strong>Accent:</strong> #14B8A6 (Medium Teal)</div>
                </div>
              </div>

              {/* THEME B COLUMN */}
              <div className="p-6 rounded-2xl border-2 border-blue-600 bg-blue-50/20 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-blue-200">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      <span className="w-4 h-4 rounded-full bg-[#2563EB]"></span>
                      <span className="w-4 h-4 rounded-full bg-[#F97371]"></span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-base">Theme B — Royal Blue + Coral (Recommended)</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-800">#2563EB + #F97371</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-blue-200 space-y-3">
                  <Logo variant="horizontal" size="md" themeMode="theme-b" />
                  <p className="text-xs text-stone-600">
                    Dual-sided brand energy: Royal Blue for business operations + Coral for customer booking & discovery.
                  </p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#2563EB] shadow-2xs">
                      Business Portal
                    </button>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#F97371] shadow-2xs">
                      Book Now (Coral)
                    </button>
                  </div>
                </div>

                <div className="text-xs text-stone-600 space-y-1">
                  <div><strong>Primary (Business):</strong> #2563EB (Royal Blue)</div>
                  <div><strong>Accent (Customer):</strong> #F97371 (Coral)</div>
                  <div><strong>Soft Accent:</strong> #FFF1F2 (Soft Coral)</div>
                  <div><strong>Background:</strong> #FAFAF9 (Warm White)</div>
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
