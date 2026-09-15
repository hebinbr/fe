import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  Sparkles,
  MessageCircle,
  Twitter,
  Instagram,
  ExternalLink,
  BookOpen,
  Heart
} from 'lucide-react';
import { Devotional } from '../types';
import {
  formatVerseForWhatsApp,
  formatVerseForTwitter,
  formatVerseForInstagram,
  formatDevotionalForWhatsApp,
  formatDevotionalForTwitter,
  formatDevotionalForInstagram,
  getWhatsAppShareUrl,
  getTwitterShareUrl,
  copyTextToClipboard,
  shareViaNative
} from '../utils/shareUtils';
import { soundSynthesizer } from '../utils/audioEngine';

export interface ShareVerseModalProps {
  reference: string;
  text: string;
  themeName?: string;
  isOpen: boolean;
  onClose: () => void;
  // Optional devotional data if sharing an entire devotional
  devotional?: Devotional;
  reflectionShort?: string;
}

export const ShareVerseModal: React.FC<ShareVerseModalProps> = ({
  reference,
  text,
  themeName = 'Inspiração',
  isOpen,
  onClose,
  devotional,
  reflectionShort
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<'golden' | 'olive' | 'night' | 'rose'>('golden');
  const [activeShareMode, setActiveShareMode] = useState<'verse' | 'devotional'>(
    devotional ? 'devotional' : 'verse'
  );
  const [instagramFeedback, setInstagramFeedback] = useState<boolean>(false);

  if (!isOpen) return null;

  const isDevotionalMode = activeShareMode === 'devotional' && !!devotional;

  const themes = {
    golden: 'bg-gradient-to-br from-[#FAF5EA] via-[#F4E9D5] to-[#EBD7B7] text-[#3D2F1D] border-[#DECEB3]',
    olive: 'bg-gradient-to-br from-[#F2F6F3] via-[#E4ECE6] to-[#CFDED3] text-[#1E3324] border-[#BCCFC2]',
    night: 'bg-gradient-to-br from-[#1E2430] via-[#2A3446] to-[#161C26] text-[#F3F4F6] border-[#374357]',
    rose: 'bg-gradient-to-br from-[#FDF4F2] via-[#FBE5E2] to-[#F3CCC7] text-[#422120] border-[#E8BCB6]',
  };

  // Text contents for each platform
  const whatsappText = isDevotionalMode
    ? formatDevotionalForWhatsApp(devotional!)
    : formatVerseForWhatsApp({ text, reference, reflectionShort, theme: themeName });

  const twitterText = isDevotionalMode
    ? formatDevotionalForTwitter(devotional!)
    : formatVerseForTwitter({ text, reference });

  const instagramText = isDevotionalMode
    ? formatDevotionalForInstagram(devotional!)
    : formatVerseForInstagram({ text, reference, reflectionShort });

  const whatsappUrl = getWhatsAppShareUrl(whatsappText);
  const twitterUrl = getTwitterShareUrl(twitterText);

  const handleCopyGeneral = async () => {
    const formatted = isDevotionalMode
      ? whatsappText
      : `"${text}"\n— ${reference} • Devocional Diário`;
    const success = await copyTextToClipboard(formatted);
    if (success) {
      soundSynthesizer.playChime();
      setCopiedType('general');
      setInstagramFeedback(false);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const handleCopyForInstagram = async () => {
    const success = await copyTextToClipboard(instagramText);
    if (success) {
      soundSynthesizer.playChime();
      setCopiedType('instagram');
      setInstagramFeedback(true);
      setTimeout(() => setCopiedType(null), 3500);
    }
  };

  const handleNativeShare = async () => {
    const title = isDevotionalMode ? devotional!.title : reference;
    const bodyText = isDevotionalMode ? whatsappText : `"${text}" — ${reference}`;
    const shared = await shareViaNative({
      title,
      text: bodyText
    });
    if (!shared) {
      // Fallback to general copy
      handleCopyGeneral();
    }
  };

  return (
    <div
      id="share-verse-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        id="share-verse-modal-container"
        className="bg-[#FAF8F5] rounded-3xl max-w-xl w-full border border-[#E8E1D5] shadow-2xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto space-y-5 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF0DE] text-[#8C6D3F] border border-[#EADBCC]">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-devotional text-xl sm:text-2xl font-bold text-[#2B2620]">
                Compartilhar Bênção & Palavra
              </h3>
              <p className="text-xs text-[#7A7165]">
                Envie para WhatsApp, Instagram, Twitter ou gere um cartão
              </p>
            </div>
          </div>
          <button
            id="btn-close-share-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A7165] hover:text-[#2B2620] hover:bg-[#EFE9DF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Mode Switcher (if devotional is provided) */}
        {devotional && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#EFE8DD] rounded-2xl border border-[#E2D8C9]">
            <button
              id="btn-share-mode-devotional"
              type="button"
              onClick={() => {
                setActiveShareMode('devotional');
                setInstagramFeedback(false);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeShareMode === 'devotional'
                  ? 'bg-white text-[#2B2419] shadow-xs'
                  : 'text-[#6D6254] hover:text-[#2B2419]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#8C6D3F]" />
              <span>Devocional Completo</span>
            </button>
            <button
              id="btn-share-mode-verse"
              type="button"
              onClick={() => {
                setActiveShareMode('verse');
                setInstagramFeedback(false);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeShareMode === 'verse'
                  ? 'bg-white text-[#2B2419] shadow-xs'
                  : 'text-[#6D6254] hover:text-[#2B2419]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8C6D3F]" />
              <span>Apenas Versículo</span>
            </button>
          </div>
        )}

        {/* Social Media One-Click Action Cards */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#735A34] block">
            Enviar Diretamente Para Redes Sociais:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* WhatsApp */}
            <a
              id="btn-share-whatsapp"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BE5A] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 group"
            >
              <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>WhatsApp</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            {/* Instagram */}
            <button
              id="btn-share-instagram"
              type="button"
              onClick={handleCopyForInstagram}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-[#E1306C] via-[#FD1D1D] to-[#F56040] hover:opacity-95 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 group"
            >
              <Instagram className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Instagram</span>
              {copiedType === 'instagram' ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <Copy className="w-3 h-3 opacity-70" />
              )}
            </button>

            {/* Twitter / X */}
            <a
              id="btn-share-twitter"
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-2xl bg-[#0F1419] hover:bg-[#262B30] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 group"
            >
              <Twitter className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Twitter / X</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>

          {/* Instagram instructions hint */}
          {instagramFeedback && (
            <div
              id="banner-instagram-guide"
              className="p-3.5 rounded-2xl bg-[#FFF3F1] border border-[#FCDAD6] text-xs text-[#83261E] space-y-1 animate-fade-in"
            >
              <div className="flex items-center gap-1.5 font-bold">
                <Check className="w-4 h-4 text-[#D93025]" />
                <span>Texto copiado e formatado para o Instagram!</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#7C3530]">
                Abra o Instagram no celular ou navegador e cole o texto na legenda do seu post ou no sticker de texto dos seus <strong>Stories</strong>.
              </p>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold underline text-[#C13584] hover:text-[#9B2366] pt-0.5"
              >
                <span>Ir para o Instagram agora</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Visual Card Style Picker */}
        <div className="space-y-2 pt-1 border-t border-[#E8E1D5]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#735A34]">
              Estilo Visual do Cartão de Bênção:
            </label>
            <span className="text-[11px] text-[#8C7F6F]">Ideal para print & stories</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'golden', label: 'Papiro Dourado', previewClass: 'bg-[#FAF5EA] text-[#3D2F1D] border-[#DECEB3]' },
              { id: 'olive', label: 'Olival de Paz', previewClass: 'bg-[#F2F6F3] text-[#1E3324] border-[#BCCFC2]' },
              { id: 'night', label: 'Céu Noturno', previewClass: 'bg-[#1E2430] text-[#F3F4F6] border-[#374357]' },
              { id: 'rose', label: 'Alvorecer', previewClass: 'bg-[#FDF4F2] text-[#422120] border-[#E8BCB6]' },
            ].map((th) => (
              <button
                key={th.id}
                id={`theme-btn-${th.id}`}
                type="button"
                onClick={() => setSelectedTheme(th.id as any)}
                className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                  selectedTheme === th.id
                    ? 'ring-2 ring-[#8C6D3F]/40 font-bold shadow-xs ' + th.previewClass
                    : 'border-[#E2D8C9] bg-white text-[#6C6356] hover:bg-[#FAF8F5]'
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Card Preview */}
        <div>
          <div
            id="verse-share-card"
            className={`p-6 sm:p-7 rounded-2xl border shadow-sm flex flex-col justify-between min-h-[220px] transition-all ${themes[selectedTheme]}`}
          >
            <div>
              <div className="flex items-center justify-between mb-3 opacity-80">
                <span className="text-[11px] font-bold tracking-wider uppercase">
                  {isDevotionalMode ? devotional!.theme : themeName}
                </span>
                <span className="text-[11px] font-medium tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Palavra Viva</span>
                </span>
              </div>

              {isDevotionalMode && (
                <h4 className="font-serif-devotional text-lg sm:text-xl font-bold mb-2">
                  {devotional!.title}
                </h4>
              )}

              <blockquote className="font-serif-devotional text-base sm:text-lg leading-relaxed italic">
                "{text}"
              </blockquote>

              {isDevotionalMode && devotional!.prayer && (
                <div className="mt-3 pt-3 border-t border-current/15">
                  <p className="text-xs italic opacity-90 line-clamp-2">
                    🙏 "{devotional!.prayer}"
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-current/15 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold tracking-wide">
                {reference}
              </span>
              <span className="text-[11px] opacity-75 font-medium">
                Devocional Diário • Palavra & Fé
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions: Copy Formatted & Native Share */}
        <div className="pt-2 border-t border-[#E8E1D5] flex flex-col sm:flex-row items-center gap-2.5">
          <button
            id="btn-copy-verse-card"
            type="button"
            onClick={handleCopyGeneral}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#8C6D3F] hover:bg-[#785C32] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            {copiedType === 'general' ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Texto Copiado com Sucesso!</span>
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
            type="button"
            onClick={handleNativeShare}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-[#D9CEBF] bg-white hover:bg-[#EFE9DF] text-[#3D3428] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            title="Abrir menu de compartilhamento do dispositivo"
          >
            <Share2 className="w-4 h-4 text-[#8C6D3F]" />
            <span>Compartilhar no Celular</span>
          </button>
        </div>
      </div>
    </div>
  );
};
