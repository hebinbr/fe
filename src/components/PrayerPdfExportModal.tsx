import React, { useState } from 'react';
import {
  FileDown,
  X,
  CheckCircle2,
  Trophy,
  Clock,
  Sparkles,
  BookOpen,
  Filter,
  Layers,
  Heart
} from 'lucide-react';
import { PrayerEntry } from '../types';
import { PRAYER_CATEGORIES } from '../data/prayersData';
import { exportPrayersToPdf, PdfExportOptions } from '../utils/prayerPdfExport';

interface PrayerPdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayers: PrayerEntry[];
  currentCategoryFilter?: string;
}

export const PrayerPdfExportModal: React.FC<PrayerPdfExportModalProps> = ({
  isOpen,
  onClose,
  prayers,
  currentCategoryFilter = 'all',
}) => {
  const [scope, setScope] = useState<'all' | 'answered_only' | 'active_only'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    currentCategoryFilter !== 'all' ? currentCategoryFilter : 'all'
  );
  const [includeStats, setIncludeStats] = useState(true);
  const [includeScripture, setIncludeScripture] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  // Calculate matching items count
  const matchingCount = prayers.filter((p) => {
    if (scope === 'answered_only' && p.status !== 'respondido') return false;
    if (scope === 'active_only' && (p.type !== 'pedido' || p.status !== 'ativo')) return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    return true;
  }).length;

  const answeredCount = prayers.filter((p) => p.status === 'respondido').length;
  const activeCount = prayers.filter((p) => p.type === 'pedido' && p.status === 'ativo').length;

  const handleExport = () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const options: PdfExportOptions = {
        scope,
        categoryFilter: selectedCategory,
        includeStats,
        includeScripture,
      };

      // Slight timeout to let user see feedback
      setTimeout(() => {
        exportPrayersToPdf(prayers, options);
        setIsExporting(false);
        setExportSuccess(true);
        setTimeout(() => {
          setExportSuccess(false);
          onClose();
        }, 1600);
      }, 350);
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
      setIsExporting(false);
    }
  };

  return (
    <div
      id="prayer-pdf-export-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DFC8] w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#EFE7DA] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#8C6D3F] text-white shadow-2xs">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-devotional text-xl font-bold text-[#2C2319]">
                Exportar Diário em PDF
              </h3>
              <p className="text-xs text-[#7A6D5D]">
                Arquivo pessoal para imprimir, guardar ou rememorar suas orações
              </p>
            </div>
          </div>
          <button
            id="btn-close-pdf-modal"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#9E9385] hover:text-[#2E281F] hover:bg-[#EFE7DA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Scope Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#736352] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#8C6D3F]" />
              <span>O que você deseja exportar?</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                id="btn-pdf-scope-all"
                onClick={() => setScope('all')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  scope === 'all'
                    ? 'bg-[#F4EFE6] border-[#8C6D3F] shadow-2xs'
                    : 'bg-[#FAF8F5] border-[#E2D8CC] hover:bg-[#F3EDE2]'
                }`}
              >
                <span className="text-xs font-bold text-[#2C2319]">Todos os Registros</span>
                <span className="text-[11px] text-[#7A6D5E] mt-1">
                  {prayers.length} orações e agradecimentos
                </span>
              </button>

              <button
                type="button"
                id="btn-pdf-scope-answered"
                onClick={() => setScope('answered_only')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  scope === 'answered_only'
                    ? 'bg-[#EAF8EE] border-[#16A34A] shadow-2xs'
                    : 'bg-[#FAF8F5] border-[#E2D8CC] hover:bg-[#F3EDE2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#14532D]">Só Respondidos</span>
                  <Trophy className="w-3.5 h-3.5 text-[#16A34A]" />
                </div>
                <span className="text-[11px] text-[#166534] mt-1">
                  {answeredCount} testemunhos de vitória
                </span>
              </button>

              <button
                type="button"
                id="btn-pdf-scope-active"
                onClick={() => setScope('active_only')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  scope === 'active_only'
                    ? 'bg-[#FAF4EB] border-[#8C6D3F] shadow-2xs'
                    : 'bg-[#FAF8F5] border-[#E2D8CC] hover:bg-[#F3EDE2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2C2319]">Em Oração</span>
                  <Clock className="w-3.5 h-3.5 text-[#8C6D3F]" />
                </div>
                <span className="text-[11px] text-[#7A6D5E] mt-1">
                  {activeCount} pedidos ativos
                </span>
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#736352] flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#8C6D3F]" />
              <span>Filtrar Categoria no Documento:</span>
            </label>
            <select
              id="select-pdf-category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D9CABE] bg-[#FAF8F5] text-xs font-medium text-[#2E281F] focus:outline-none focus:ring-1 focus:ring-[#8C6D3F]"
            >
              <option value="all">Todas as Categorias ({prayers.length} registros)</option>
              {PRAYER_CATEGORIES.map((cat) => {
                const count = prayers.filter((p) => p.category === cat.id).length;
                return (
                  <option key={cat.id} value={cat.id}>
                    {cat.label} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Document Content Options */}
          <div className="space-y-2.5 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#736352]">
              Opções de Composição do PDF:
            </span>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] cursor-pointer hover:bg-[#F3ECE0] transition-colors">
                <input
                  type="checkbox"
                  id="checkbox-pdf-include-stats"
                  checked={includeStats}
                  onChange={(e) => setIncludeStats(e.target.checked)}
                  className="rounded-sm text-[#8C6D3F] focus:ring-[#8C6D3F] w-4 h-4 accent-[#8C6D3F]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-[#2C2319] block">
                    Incluir Quadro de Estatísticas e Fidelidade
                  </span>
                  <span className="text-[11px] text-[#7A6D5E]">
                    Adiciona o total de orações respondidas, ativas e momentos clamados
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] cursor-pointer hover:bg-[#F3ECE0] transition-colors">
                <input
                  type="checkbox"
                  id="checkbox-pdf-include-scripture"
                  checked={includeScripture}
                  onChange={(e) => setIncludeScripture(e.target.checked)}
                  className="rounded-sm text-[#8C6D3F] focus:ring-[#8C6D3F] w-4 h-4 accent-[#8C6D3F]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-[#2C2319] block">
                    Incluir Versículo Bíblico de Abertura
                  </span>
                  <span className="text-[11px] text-[#7A6D5E]">
                    Adiciona Filipenses 4:6 em destaque no topo da página
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Live Preview Summary Badge */}
          <div className="p-3.5 rounded-2xl bg-[#F6F0E4] border border-[#E8DCC9] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#5A4934]">
              <Sparkles className="w-4 h-4 text-[#8C6D3F]" />
              <span>
                Pronto para gerar <strong>{matchingCount}</strong> {matchingCount === 1 ? 'registro' : 'registros'} em PDF.
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#8C6D3F] uppercase tracking-wider">
              Formato A4
            </span>
          </div>

          {exportSuccess && (
            <div className="p-3 rounded-xl bg-[#E8F8EE] border border-[#BBF7D0] text-[#166534] text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>Download iniciado com sucesso! Arquivo PDF salvo no seu dispositivo.</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#EFE7DA] bg-[#FAF7F2] flex items-center justify-end gap-2.5">
          <button
            type="button"
            id="btn-cancel-pdf-export"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#D9CABE] bg-white text-xs font-semibold text-[#5A4B3A] hover:bg-[#F5EFE6] transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            id="btn-confirm-pdf-export"
            onClick={handleExport}
            disabled={isExporting || matchingCount === 0}
            className="px-5 py-2.5 rounded-xl bg-[#8C6D3F] hover:bg-[#785C32] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <FileDown className="w-4 h-4" />
            <span>{isExporting ? 'Gerando PDF...' : 'Baixar Arquivo PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
