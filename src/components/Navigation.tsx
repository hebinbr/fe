import React from 'react';
import { BookOpen, Sparkles, Headphones, BookmarkCheck, Bell, HeartHandshake } from 'lucide-react';
import { AppTab } from '../types';

interface NavigationProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  unreadNotificationsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  unreadNotificationsCount,
}) => {
  const tabs: { id: AppTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'devocional', label: 'Devocional', icon: BookOpen },
    { id: 'versiculos', label: 'Versículos', icon: Sparkles },
    { id: 'diario-oracao', label: 'Diário de Oração', icon: HeartHandshake },
    { id: 'audios', label: 'Áudios & Sons', icon: Headphones },
    { id: 'plano', label: 'Plano de Leitura', icon: BookmarkCheck },
    { id: 'notificacoes', label: 'Notificações', icon: Bell, badge: unreadNotificationsCount },
  ];

  return (
    <nav
      id="main-navigation"
      aria-label="Navegação principal"
      className="bg-[#FAF8F5] border-b border-[#E8E1D5]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#EFE6D8] text-[#3D301F] shadow-xs font-semibold'
                    : 'text-[#6C6356] hover:text-[#2B2620] hover:bg-[#F3EFE7]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#8C6D3F]' : 'text-[#8C8375]'}`} />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span
                    id={`nav-badge-${tab.id}`}
                    className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#C2410C] text-white"
                  >
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
