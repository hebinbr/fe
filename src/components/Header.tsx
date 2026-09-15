import React from 'react';
import { BookOpen, Flame, Bell, Type, Sun, Moon, Sparkles } from 'lucide-react';
import { UserPreferences, AppTab } from '../types';

interface HeaderProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  unreadNotificationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  preferences,
  onUpdatePreferences,
  activeTab,
  onSelectTab,
  unreadNotificationsCount,
}) => {
  const todayFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const cycleFontSize = () => {
    const nextSize =
      preferences.fontSize === 'normal'
        ? 'large'
        : preferences.fontSize === 'large'
        ? 'xlarge'
        : 'normal';
    onUpdatePreferences({ fontSize: nextSize });
  };

  const cycleTheme = () => {
    const nextTheme =
      preferences.themeMode === 'parchment'
        ? 'warm'
        : preferences.themeMode === 'warm'
        ? 'clean'
        : 'parchment';
    onUpdatePreferences({ themeMode: nextTheme });
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E1D5] transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand & Logo */}
        <div
          id="brand-container"
          onClick={() => onSelectTab('devocional')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#8C6D3F] to-[#5C4524] text-white flex items-center justify-center shadow-sm shadow-[#8C6D3F]/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-[#FBF8F1]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-devotional text-lg sm:text-2xl font-semibold tracking-tight text-[#2B2620]">
                Devocional Diário
              </span>
              <span className="hidden sm:inline-block text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-[#EFE9DF] text-[#7A6B58]">
                Bíblia & Oração
              </span>
            </div>
            <p className="text-xs text-[#7A7165] font-medium capitalize hidden sm:block">
              {capitalize(todayFormatted)}
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div id="header-actions" className="flex items-center gap-2 sm:gap-3">
          {/* Streak Badge */}
          <div
            id="streak-badge"
            title={`Você tem ${preferences.streakDays} dias de constância espiritual!`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF4E5] border border-[#F3DFC1] text-[#9A5B18] text-xs font-semibold shadow-xs"
          >
            <Flame className="w-4 h-4 text-[#D97706] animate-pulse" />
            <span>{preferences.streakDays} {preferences.streakDays === 1 ? 'dia' : 'dias'}</span>
          </div>

          {/* Font Size Adjuster */}
          <button
            id="btn-font-size-adjust"
            onClick={cycleFontSize}
            title={`Tamanho da fonte: ${preferences.fontSize} (clique para alternar)`}
            className="p-2 rounded-lg text-[#61584C] hover:text-[#2B2620] hover:bg-[#EFE9DF] transition-colors flex items-center gap-1 text-xs font-medium"
            aria-label="Ajustar tamanho da fonte"
          >
            <Type className="w-4 h-4" />
            <span className="hidden md:inline uppercase text-[10px] font-bold">
              {preferences.fontSize === 'normal' ? 'A' : preferences.fontSize === 'large' ? 'A+' : 'A++'}
            </span>
          </button>

          {/* Color Palette Cycle */}
          <button
            id="btn-theme-cycle"
            onClick={cycleTheme}
            title={`Tema visual: ${preferences.themeMode} (clique para alternar)`}
            className="p-2 rounded-lg text-[#61584C] hover:text-[#2B2620] hover:bg-[#EFE9DF] transition-colors"
            aria-label="Alternar tema"
          >
            {preferences.themeMode === 'parchment' ? (
              <Sparkles className="w-4 h-4 text-[#8C6D3F]" />
            ) : preferences.themeMode === 'warm' ? (
              <Sun className="w-4 h-4 text-[#C27803]" />
            ) : (
              <Moon className="w-4 h-4 text-[#435366]" />
            )}
          </button>

          {/* Notification Quick Tab */}
          <button
            id="btn-header-notifications"
            onClick={() => onSelectTab('notificacoes')}
            title="Ver lembretes e notificações diárias"
            className={`relative p-2 rounded-lg transition-colors ${
              activeTab === 'notificacoes'
                ? 'bg-[#E5DCD0] text-[#2B2620]'
                : 'text-[#61584C] hover:text-[#2B2620] hover:bg-[#EFE9DF]'
            }`}
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span
                id="header-notification-indicator"
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C2410C] ring-2 ring-[#FAF8F5]"
              />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
