import React, { useRef } from 'react';
import { Search, X, Sparkles, Filter, Tag } from 'lucide-react';

interface PrayerSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalResults: number;
  totalPrayers: number;
  onClearSearch: () => void;
  activeFilterLabel?: string;
}

const POPULAR_KEYWORDS = [
  'Família',
  'Saúde & Cura',
  'Trabalho',
  'Paz',
  'Sabedoria',
  'Provisão',
  'Gratidão',
  'Proteção',
];

export const PrayerSearchBar: React.FC<PrayerSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  totalResults,
  totalPrayers,
  onClearSearch,
  activeFilterLabel,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChipClick = (keyword: string) => {
    if (searchQuery.toLowerCase() === keyword.toLowerCase()) {
      onClearSearch();
    } else {
      onSearchChange(keyword);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div
      id="prayer-top-search-container"
      className="bg-[#FFFDF9] rounded-2xl border border-[#E8DFC8] p-3.5 sm:p-4 shadow-xs space-y-2.5 transition-all"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Main Search Input */}
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8C6D3F]">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={inputRef}
            id="prayer-top-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar pedidos por palavras-chave (ex: família, cura, trabalho, paz, sabedoria)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#D9CABE] bg-[#FAF8F4] text-xs sm:text-sm font-medium text-[#2C241B] placeholder-[#9B8F80] focus:outline-none focus:ring-2 focus:ring-[#8C6D3F]/30 focus:border-[#8C6D3F] transition-all"
          />
          {searchQuery && (
            <button
              id="btn-clear-prayer-top-search"
              onClick={() => {
                onClearSearch();
                inputRef.current?.focus();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-[#9B8F80] hover:text-[#2C241B] hover:bg-[#EFE7DA] transition-colors"
              title="Limpar pesquisa"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Counter / Clear Button */}
        {searchQuery && (
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            <span
              id="prayer-search-result-badge"
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-[#F4EFE6] text-[#6E593A] border border-[#E2D6C6]"
            >
              {totalResults === 1
                ? '1 pedido encontrado'
                : `${totalResults} de ${totalPrayers} encontrados`}
            </span>
            <button
              onClick={onClearSearch}
              className="text-xs font-semibold text-[#8C6D3F] hover:text-[#6E522B] hover:underline px-2 py-1"
            >
              Limpar busca
            </button>
          </div>
        )}
      </div>

      {/* Suggested Keyword Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
        <span className="text-[11px] font-bold text-[#8C8070] uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <Tag className="w-3 h-3 text-[#8C6D3F]" />
          <span>Palavras-chave:</span>
        </span>
        {POPULAR_KEYWORDS.map((kw) => {
          const isSelected = searchQuery.toLowerCase() === kw.toLowerCase();
          return (
            <button
              key={kw}
              id={`prayer-keyword-chip-${kw.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => handleChipClick(kw)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all text-xs flex items-center gap-1 ${
                isSelected
                  ? 'bg-[#8C6D3F] text-white shadow-2xs'
                  : 'bg-[#FAF7F2] text-[#635544] hover:bg-[#F2ECE0] border border-[#E5DACB]'
              }`}
            >
              <span>{kw}</span>
              {isSelected && <X className="w-3 h-3 ml-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
