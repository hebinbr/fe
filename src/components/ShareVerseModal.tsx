import React, { useState } from 'react';
import { X, Copy, Check, Share2, Sparkles } from 'lucide-react';

interface ShareVerseModalProps {
  reference: string;
  text: string;
  themeName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareVerseModal: React.FC<ShareVerseModalProps> = ({
  reference,
  text,
  themeName = 'Inspiração',
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'golden' | 'olive' | 'night' | 'rose'>('golden');

  if (!isOpen) return null;

  const themes = {
    golden: 'bg-gradient-to-br from-[#FAF5EA] via-[#F4E9D5] to-[#EBD7B7] text-[#3D2F1D] border-[#DECEB3]',
    olive: 'bg-gradient-to-br from-[#F2F6F3] via-[#E4ECE6] to-[#CFDED3] text-[#1E3324] border-[#BCCFC2]',
    night: 'bg-gradient-to-br from-[#1E2430] via-[#2A3446] to-[#161C26] text-[#F3F4F6] border-[#374357]',
    rose: 'bg-gradient-to-br from-[#FDF4F2] via-[#FBE5E2] to-[#F3CCC7] text-[#422120] border-[#E8BCB6]',
  };

  const copyVerseToClipboard = async () => {
    const formatted = `"${text}"\n— ${reference} • Devocional Diário`;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      id="share-verse-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="share-verse-modal-container"
        className="bg-[#FAF8F5] rounded-2xl max-w-lg w-full border border-[#E8E1D5] shadow-2xl p-6 sm:p-7 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D5]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8C6D3F]" />
            <h3 className="font-serif-devotional text-xl font-semibold text-[#2B2620]">
              Cartão de Bênção & Compartilhamento
            </h3>
          </div>
          <button
            id="btn-close-share-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7A7165] hover:text-[#2B2620] hover:bg-[#EFE9DF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Picker */}
        <div className="mt-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#7A7165] block mb-2">
            Escolha o Estilo do Cartão:
          </label>
          <div className="grid grid-cols-4 gap-2">
            <button
              id="theme-btn-golden"
              onClick={() => setSelectedTheme('golden')}
              className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                selectedTheme === 'golden'
                  ? 'border-[#8C6D3F] ring-2 ring-[#8C6D3F]/30 bg-[#FAF5EA] text-[#3D2F1D] font-semibold'
                  : 'border-[#E2D8C9] bg-[#FAF8F5] text-[#6C6356]'
              }`}
            >
              Papiro Dourado
            </button>
            <button
              id="theme-btn-olive"
              onClick={() => setSelectedTheme('olive')}
              className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                selectedTheme === 'olive'
                  ? 'border-[#2D5A3A] ring-2 ring-[#2D5A3A]/30 bg-[#F2F6F3] text-[#1E3324] font-semibold'
                  : 'border-[#E2D8C9] bg-[#FAF8F5] text-[#6C6356]'
              }`}
            >
              Olival de Paz
            </button>
            <button
              id="theme-btn-night"
              onClick={() => setSelectedTheme('night')}
              className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                selectedTheme === 'night'
                  ? 'border-[#4B5E7C] ring-2 ring-[#4B5E7C]/40 bg-[#2A3446] text-white font-semibold'
                  : 'border-[#E2D8C9] bg-[#FAF8F5] text-[#6C6356]'
              }`}
            >
              Céu Noturno
            </button>
            <button
              id="theme-btn-rose"
              onClick={() => setSelectedTheme('rose')}
              className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                selectedTheme === 'rose'
                  ? 'border-[#945855] ring-2 ring-[#945855]/30 bg-[#FDF4F2] text-[#422120] font-semibold'
                  : 'border-[#E2D8C9] bg-[#FAF8F5] text-[#6C6356]'
              }`}
            >
              Alvorecer
            </button>
          </div>
        </div>

        {/* Visual Share Card Preview */}
        <div className="mt-5">
          <div
            id="verse-share-card"
            className={`p-6 sm:p-8 rounded-2xl border shadow-md flex flex-col justify-between min-h-[220px] transition-all ${themes[selectedTheme]}`}
          >
            <div>
              <div className="flex items-center justify-between mb-4 opacity-75">
                <span className="text-[11px] font-semibold tracking-wider uppercase">
                  {themeName}
                </span>
                <span className="text-[11px] font-medium tracking-wide">
                  ✦ Palavra Viva
                </span>
              </div>
              <blockquote className="font-serif-devotional text-lg sm:text-xl leading-relaxed italic">
                "{text}"
              </blockquote>
            </div>

            <div className="mt-6 pt-4 border-t border-current/15 flex items-center justify-between">
              <span className="text-sm font-semibold tracking-wide">
                {reference}
              </span>
              <span className="text-xs opacity-75">
                Devocional Diário
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            id="btn-copy-verse-card"
            onClick={copyVerseToClipboard}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#8C6D3F] hover:bg-[#785C32] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm shadow-[#8C6D3F]/20 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Copiado com Sucesso!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Texto Formatado</span>
              </>
            )}
          </button>

          <button
            id="btn-share-verse-native"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: reference,
                  text: `"${text}" — ${reference}`,
                }).catch(() => {});
              } else {
                copyVerseToClipboard();
              }
            }}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-[#D9CEBF] bg-[#FAF8F5] hover:bg-[#EFE9DF] text-[#3D3428] font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Share2 className="w-4 h-4 text-[#8C6D3F]" />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
