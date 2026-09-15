import React, { useState, useMemo } from 'react';
import {
  Heart,
  Sparkles,
  Plus,
  Search,
  CheckCircle2,
  Check,
  Volume2,
  VolumeX,
  Trash2,
  Edit3,
  Star,
  Calendar,
  MessageSquare,
  BookOpen,
  Filter,
  X,
  HelpCircle,
  Clock,
  ArrowRight,
  BookmarkCheck,
  Trophy,
  Flame,
  Home,
  HeartPulse,
  Briefcase,
  Users,
  User,
  Bookmark,
  Send
} from 'lucide-react';
import { PrayerEntry, PrayerType, PrayerCategory, PrayerStatus, UserPreferences } from '../types';
import { PRAYER_CATEGORIES, PRAYER_GUIDE_TEMPLATES } from '../data/prayersData';
import { soundSynthesizer, devotionalTTS, TTSState } from '../utils/audioEngine';
import { PrayerSummary } from './PrayerSummary';

interface PrayerJournalViewProps {
  prayers: PrayerEntry[];
  onAddPrayer: (prayer: Omit<PrayerEntry, 'id' | 'timesPrayed'>) => void;
  onUpdatePrayer: (id: string, updated: Partial<PrayerEntry>) => void;
  onDeletePrayer: (id: string) => void;
  onIncrementPrayedCount: (id: string) => void;
  onMarkAsAnswered: (id: string, testimony: string, answeredDate: string) => void;
  preferences: UserPreferences;
  ttsState: TTSState;
}

export const PrayerJournalView: React.FC<PrayerJournalViewProps> = ({
  prayers,
  onAddPrayer,
  onUpdatePrayer,
  onDeletePrayer,
  onIncrementPrayedCount,
  onMarkAsAnswered,
  preferences,
  ttsState,
}) => {
  // Filters & Search
  const [filterType, setFilterType] = useState<'all' | 'pedido_ativo' | 'respondido' | 'agradecimento' | 'favoritos'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState<PrayerEntry | null>(null);

  // Mark as answered modal
  const [answeringPrayerId, setAnsweringPrayerId] = useState<string | null>(null);
  const [testimonyText, setTestimonyText] = useState('');
  const [answerDate, setAnswerDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Form State
  const [formType, setFormType] = useState<PrayerType>('pedido');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<PrayerCategory>('familia');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Flash message for "Orei hoje"
  const [prayedFlashId, setPrayedFlashId] = useState<string | null>(null);

  // Statistics
  const activeRequestsCount = prayers.filter((p) => p.type === 'pedido' && p.status === 'ativo').length;
  const answeredRequestsCount = prayers.filter((p) => p.status === 'respondido' && (p.type === 'pedido' || p.testimony)).length;
  const thanksgivingsCount = prayers.filter((p) => p.type === 'agradecimento').length;
  const totalMomentsCount = prayers.reduce((acc, p) => acc + (p.timesPrayed || 0), 0);

  // Category Icon helper
  const renderCategoryIcon = (category: PrayerCategory, className = 'w-3.5 h-3.5') => {
    switch (category) {
      case 'familia':
        return <Home className={className} />;
      case 'saude':
        return <HeartPulse className={className} />;
      case 'trabalho':
        return <Briefcase className={className} />;
      case 'espiritual':
        return <Sparkles className={className} />;
      case 'amigos':
        return <Users className={className} />;
      case 'pessoal':
        return <User className={className} />;
      default:
        return <Bookmark className={className} />;
    }
  };

  const getCategoryMeta = (cat: PrayerCategory) => {
    return PRAYER_CATEGORIES.find((c) => c.id === cat) || PRAYER_CATEGORIES[0];
  };

  // Filtered prayers
  const filteredPrayers = useMemo(() => {
    return prayers.filter((prayer) => {
      // Type filter
      if (filterType === 'pedido_ativo') {
        if (prayer.type !== 'pedido' || prayer.status !== 'ativo') return false;
      } else if (filterType === 'respondido') {
        if (prayer.status !== 'respondido' || (!prayer.testimony && prayer.type === 'agradecimento')) return false;
      } else if (filterType === 'agradecimento') {
        if (prayer.type !== 'agradecimento') return false;
      } else if (filterType === 'favoritos') {
        if (!prayer.isFavorite) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && prayer.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = prayer.title.toLowerCase().includes(q);
        const matchDesc = prayer.description.toLowerCase().includes(q);
        const matchTestimony = prayer.testimony ? prayer.testimony.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchDesc && !matchTestimony) return false;
      }

      return true;
    });
  }, [prayers, filterType, selectedCategory, searchQuery]);

  // Open Form for New
  const openNewForm = (initialType: PrayerType = 'pedido') => {
    setEditingPrayer(null);
    setFormType(initialType);
    setFormTitle('');
    setFormCategory('familia');
    setFormDescription('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setIsNewModalOpen(true);
  };

  // Open Form for Edit
  const openEditForm = (item: PrayerEntry) => {
    setEditingPrayer(item);
    setFormType(item.type);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormDescription(item.description);
    setFormDate(item.date);
    setIsNewModalOpen(true);
  };

  // Save Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    if (editingPrayer) {
      onUpdatePrayer(editingPrayer.id, {
        type: formType,
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim(),
        date: formDate,
      });
      soundSynthesizer.playChime();
    } else {
      onAddPrayer({
        type: formType,
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim(),
        date: formDate,
        status: formType === 'agradecimento' ? 'respondido' : 'ativo',
        isFavorite: false,
      });
      soundSynthesizer.playChime();
    }

    setIsNewModalOpen(false);
  };

  // Apply Template
  const handleApplyTemplate = (template: typeof PRAYER_GUIDE_TEMPLATES[0]) => {
    setFormType(template.type);
    setFormTitle(template.title);
    setFormCategory(template.category);
    setFormDescription(template.description);
    setFormDate(new Date().toISOString().split('T')[0]);
    setIsTemplatesOpen(false);
    setIsNewModalOpen(true);
  };

  // Handle "Orei Hoje" (+1 count)
  const handlePrayToday = (id: string) => {
    soundSynthesizer.playChime();
    onIncrementPrayedCount(id);
    setPrayedFlashId(id);
    setTimeout(() => {
      setPrayedFlashId(null);
    }, 2500);
  };

  // Handle Mark as Answered
  const handleConfirmAnswered = () => {
    if (!answeringPrayerId) return;
    onMarkAsAnswered(
      answeringPrayerId,
      testimonyText.trim() || 'Oração atendida e abençoada pelo Senhor!',
      answerDate
    );
    soundSynthesizer.playChime();
    setAnsweringPrayerId(null);
    setTestimonyText('');
  };

  // Voice narration toggle for a prayer
  const handleNarratePrayer = (item: PrayerEntry) => {
    if (ttsState.isSpeaking && ttsState.currentText.includes(item.title)) {
      devotionalTTS.stop();
    } else {
      const fullText = `${item.type === 'pedido' ? 'Pedido de Oração' : 'Ação de Graças'}: ${item.title}. ${item.description}${
        item.testimony ? `. Testemunho da Resposta de Deus: ${item.testimony}` : ''
      }`;
      devotionalTTS.speak(item.title, fullText);
    }
  };

  return (
    <div id="prayer-journal-view" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Banner & Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D3F]">
              Vida de Intimidade com Deus
            </span>
            <h2 className="font-serif-devotional text-2xl sm:text-3xl font-bold text-[#2B2319]">
              Diário de Oração & Agradecimentos
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-open-prayer-templates"
              onClick={() => setIsTemplatesOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-[#D9CABE] bg-[#FAF8F5] hover:bg-[#F3EDE2] text-[#6E5839] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <BookOpen className="w-4 h-4 text-[#8C6D3F]" />
              <span className="hidden sm:inline">Modelos de Oração</span>
              <span className="sm:hidden">Modelos</span>
            </button>

            <button
              id="btn-new-prayer-entry"
              onClick={() => openNewForm('pedido')}
              className="px-4 py-2 rounded-xl bg-[#8C6D3F] hover:bg-[#785C32] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Registro</span>
            </button>
          </div>
        </div>

        {/* Biblical Verse of Encouragement */}
        <div
          id="prayer-scripture-card"
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#F6F0E4] via-[#FDFBF7] to-[#F6F0E4] border border-[#E8DCC9] shadow-2xs flex items-start gap-3.5"
        >
          <div className="p-2 rounded-xl bg-[#8C6D3F] text-white shrink-0 mt-0.5">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <div className="space-y-1">
            <p className="font-serif-devotional italic text-sm sm:text-base text-[#3C3225] leading-relaxed">
              "Não andeis ansiosos de coisa alguma; em tudo, porém, sejam conhecidas diante de Deus as vossas petições, pela oração e pela súplica, com ações de graças."
            </p>
            <span className="text-xs font-semibold text-[#8C6D3F] block">
              Filipenses 4:6
            </span>
          </div>
        </div>
      </div>

      {/* Resumo de Oração com Gráficos Recharts (Pedidos Realizados vs. Respondidos) */}
      <PrayerSummary
        prayers={prayers}
        onSelectFilterType={(type) => setFilterType(type)}
      />

      {/* Filters & Search Controls */}
      <div id="prayer-filters-section" className="space-y-3">
        {/* Main Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            id="filter-tab-all"
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-[#8C6D3F] text-white shadow-2xs'
                : 'bg-[#FAF8F5] border border-[#E5DACD] text-[#6E6354] hover:bg-[#F3ECE0]'
            }`}
          >
            Todos ({prayers.length})
          </button>

          <button
            id="filter-tab-active"
            onClick={() => setFilterType('pedido_ativo')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filterType === 'pedido_ativo'
                ? 'bg-[#8C6D3F] text-white shadow-2xs'
                : 'bg-[#FAF8F5] border border-[#E5DACD] text-[#6E6354] hover:bg-[#F3ECE0]'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Pedidos Ativos ({activeRequestsCount})</span>
          </button>

          <button
            id="filter-tab-answered"
            onClick={() => setFilterType('respondido')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filterType === 'respondido'
                ? 'bg-[#2D6A3E] text-white shadow-2xs'
                : 'bg-[#FAF8F5] border border-[#E5DACD] text-[#6E6354] hover:bg-[#F3ECE0]'
            }`}
          >
            <Trophy className="w-3 h-3" />
            <span>Respondidas ({answeredRequestsCount})</span>
          </button>

          <button
            id="filter-tab-thanksgiving"
            onClick={() => setFilterType('agradecimento')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filterType === 'agradecimento'
                ? 'bg-[#B45309] text-white shadow-2xs'
                : 'bg-[#FAF8F5] border border-[#E5DACD] text-[#6E6354] hover:bg-[#F3ECE0]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Agradecimentos ({thanksgivingsCount})</span>
          </button>

          <button
            id="filter-tab-favorites"
            onClick={() => setFilterType('favoritos')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filterType === 'favoritos'
                ? 'bg-[#8C6D3F] text-white shadow-2xs'
                : 'bg-[#FAF8F5] border border-[#E5DACD] text-[#6E6354] hover:bg-[#F3ECE0]'
            }`}
          >
            <Star className="w-3 h-3" />
            <span>Favoritos</span>
          </button>
        </div>

        {/* Search and Category Filter Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#998D7C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="input-prayer-search"
              type="text"
              placeholder="Buscar por título, palavras da oração ou testemunho..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#D9CABE] bg-[#FAF8F5] text-xs font-medium text-[#2E281F] placeholder-[#9E9385] focus:outline-none focus:ring-1 focus:ring-[#8C6D3F]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#998D7C] hover:text-[#2E281F]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown/Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              id="select-prayer-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#D9CABE] bg-[#FAF8F5] text-xs font-medium text-[#3E3427] focus:outline-none focus:ring-1 focus:ring-[#8C6D3F]"
            >
              <option value="all">Todas as Categorias</option>
              {PRAYER_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Prayers List */}
      <div id="prayer-items-list" className="space-y-4">
        {filteredPrayers.length > 0 ? (
          filteredPrayers.map((item) => {
            const catMeta = getCategoryMeta(item.category);
            const isAnswered = item.status === 'respondido';
            const isGratitude = item.type === 'agradecimento';
            const isSpeakingThis = ttsState.isSpeaking && ttsState.currentText.includes(item.title);
            const isJustPrayed = prayedFlashId === item.id;

            return (
              <div
                key={item.id}
                id={`prayer-card-${item.id}`}
                className={`rounded-3xl p-5 sm:p-6 transition-all duration-300 border ${
                  isGratitude
                    ? 'bg-[#FDFCF7] border-[#E2E6D8] hover:border-[#CBD4BC] shadow-2xs'
                    : isAnswered
                    ? 'bg-[#F9FCFA] border-[#D1E7D7] hover:border-[#B7DBC0] shadow-2xs'
                    : 'bg-[#FFFDFB] border-[#E8E1D5] hover:border-[#D6C5AF] shadow-2xs'
                }`}
              >
                {/* Card Header: Type Badge, Category, Date, Actions */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Type Badge */}
                    {isGratitude ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EBF5EE] text-[#1E6B35] border border-[#CDE5D5]">
                        <Sparkles className="w-3 h-3" />
                        Agradecimento
                      </span>
                    ) : isAnswered ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E0EFE3] text-[#195C2B] border border-[#BFDFCA]">
                        <CheckCircle2 className="w-3 h-3" />
                        Oração Respondida
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FBF2E3] text-[#9A5B18] border border-[#F3DFC1]">
                        <Clock className="w-3 h-3" />
                        Em Oração
                      </span>
                    )}

                    {/* Category Badge */}
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${catMeta.color}`}
                    >
                      {renderCategoryIcon(item.category)}
                      {catMeta.label}
                    </span>

                    {/* Creation Date */}
                    <span className="text-[11px] text-[#9E9385] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(
                        new Date(item.date + 'T12:00:00')
                      )}
                    </span>
                  </div>

                  {/* Top-Right Quick Icons */}
                  <div className="flex items-center gap-1">
                    {/* Favorite Star */}
                    <button
                      id={`btn-fav-prayer-${item.id}`}
                      onClick={() => onUpdatePrayer(item.id, { isFavorite: !item.isFavorite })}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.isFavorite ? 'text-[#D97706] hover:bg-[#FFFBEB]' : 'text-[#A89D8F] hover:text-[#5C5042]'
                      }`}
                      title={item.isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
                    >
                      <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-[#D97706]' : ''}`} />
                    </button>

                    {/* Listen Audio */}
                    <button
                      id={`btn-narrate-prayer-${item.id}`}
                      onClick={() => handleNarratePrayer(item)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSpeakingThis
                          ? 'bg-[#8C6D3F] text-white'
                          : 'text-[#A89D8F] hover:text-[#5C5042] hover:bg-[#F3ECE0]'
                      }`}
                      title={isSpeakingThis ? 'Parar leitura' : 'Ouvir oração'}
                    >
                      {isSpeakingThis ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* Edit */}
                    <button
                      id={`btn-edit-prayer-${item.id}`}
                      onClick={() => openEditForm(item)}
                      className="p-1.5 rounded-lg text-[#A89D8F] hover:text-[#5C5042] hover:bg-[#F3ECE0] transition-colors"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      id={`btn-delete-prayer-${item.id}`}
                      onClick={() => {
                        if (window.confirm('Tem certeza que deseja remover este registro do diário?')) {
                          onDeletePrayer(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-[#A89D8F] hover:text-[#A82A2A] hover:bg-[#FBEBEB] transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Prayer Title */}
                <h3 className="font-serif-devotional text-lg sm:text-xl font-bold text-[#2B2319] mb-2 leading-snug">
                  {item.title}
                </h3>

                {/* Prayer Description */}
                <p className="text-sm text-[#4E4437] leading-relaxed mb-4 whitespace-pre-line">
                  {item.description}
                </p>

                {/* Answered Testimony Banner (If answered) */}
                {item.testimony && (
                  <div
                    id={`testimony-banner-${item.id}`}
                    className="mb-4 p-3.5 sm:p-4 rounded-2xl bg-[#EAF5ED] border border-[#C5E3CE] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F6E36]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Testemunho da Resposta de Deus:</span>
                      </div>
                      {item.answeredDate && (
                        <span className="text-[11px] font-medium text-[#2E7844]">
                          {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
                            new Date(item.answeredDate + 'T12:00:00')
                          )}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#245934] leading-relaxed italic">
                      "{item.testimony}"
                    </p>
                  </div>
                )}

                {/* Footer Controls: "Orei Hoje" & Status Toggle */}
                <div className="pt-3 border-t border-[#EAE3D6] flex flex-wrap items-center justify-between gap-3">
                  {/* Clamor Counter */}
                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-pray-today-${item.id}`}
                      onClick={() => handlePrayToday(item.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                        isJustPrayed
                          ? 'bg-[#2D6A3E] text-white ring-2 ring-[#B7DEC0]'
                          : 'bg-[#FAF8F5] border border-[#D9CABE] text-[#6E593B] hover:bg-[#F3EDE2]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isJustPrayed ? 'fill-white' : 'text-[#8C6D3F]'}`} />
                      <span>{isJustPrayed ? 'Oração Registrada! ✓' : 'Orei Hoje Por Isso'}</span>
                    </button>

                    <span className="text-[11px] text-[#8C8070] font-medium">
                      Orou {item.timesPrayed} {item.timesPrayed === 1 ? 'vez' : 'vezes'}
                      {item.lastPrayedAt && (
                        <span className="hidden sm:inline"> • {item.lastPrayedAt}</span>
                      )}
                    </span>
                  </div>

                  {/* Status Toggle Button */}
                  {item.type === 'pedido' && (
                    <div>
                      {item.status === 'ativo' ? (
                        <button
                          id={`btn-mark-answered-${item.id}`}
                          onClick={() => {
                            setAnsweringPrayerId(item.id);
                            setTestimonyText('');
                            setAnswerDate(new Date().toISOString().split('T')[0]);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#EAF5ED] hover:bg-[#DBEEE0] text-[#1E6B35] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#C5E3CE]"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Marcar como Respondido</span>
                        </button>
                      ) : (
                        <button
                          id={`btn-reopen-prayer-${item.id}`}
                          onClick={() => {
                            onUpdatePrayer(item.id, { status: 'ativo' });
                            soundSynthesizer.playChime();
                          }}
                          className="px-3 py-1.5 rounded-xl border border-[#D9CABE] text-[#6E6354] hover:bg-[#FAF8F5] text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <span>Reabrir Oração</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div
            id="prayers-empty-state"
            className="text-center py-12 px-4 rounded-3xl bg-[#FAF8F5] border border-[#EADBCC] space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#EFE6D8] text-[#8C6D3F] mx-auto flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif-devotional text-lg font-bold text-[#2B2319]">
              Nenhum registro encontrado
            </h3>
            <p className="text-xs text-[#7A7165] max-w-md mx-auto">
              {searchQuery || selectedCategory !== 'all' || filterType !== 'all'
                ? 'Tente remover os filtros ou buscar por outras palavras-chave.'
                : 'Seu diário de oração está pronto para receber suas súplicas e ações de graça.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => openNewForm('pedido')}
                className="px-4 py-2 rounded-xl bg-[#8C6D3F] hover:bg-[#785C32] text-white text-xs font-semibold shadow-xs"
              >
                Escrever Meu Primeiro Pedido ou Agradecimento
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: New / Edit Prayer or Thanksgiving */}
      {isNewModalOpen && (
        <div
          id="modal-prayer-form"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsNewModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-[#FFFDFB] border border-[#E8E1D5] shadow-2xl overflow-hidden p-5 sm:p-7 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-3.5">
              <div>
                <h3 className="font-serif-devotional text-xl font-bold text-[#2B2319]">
                  {editingPrayer ? 'Editar Registro' : 'Novo Registro no Diário'}
                </h3>
                <p className="text-xs text-[#7A7165]">
                  Coloque suas palavras, anseios e gratidão diante do Senhor.
                </p>
              </div>
              <button
                id="btn-close-prayer-modal"
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 rounded-lg text-[#9E9385] hover:text-[#2B2319] hover:bg-[#F3ECE0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type Switcher (Pedido vs Agradecimento) */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#F6F1E8] border border-[#E8DCC9]">
              <button
                type="button"
                id="type-btn-pedido"
                onClick={() => setFormType('pedido')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  formType === 'pedido'
                    ? 'bg-white text-[#9A5B18] shadow-xs'
                    : 'text-[#7A6F60] hover:text-[#2E281F]'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Pedido de Oração</span>
              </button>

              <button
                type="button"
                id="type-btn-agradecimento"
                onClick={() => setFormType('agradecimento')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  formType === 'agradecimento'
                    ? 'bg-white text-[#1E6B35] shadow-xs'
                    : 'text-[#7A6F60] hover:text-[#2E281F]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Agradecimento</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveForm} className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4E4437]">
                  {formType === 'pedido' ? 'Título do Pedido' : 'Motivo de Agradecimento'} *
                </label>
                <input
                  id="input-form-title"
                  type="text"
                  required
                  placeholder={
                    formType === 'pedido'
                      ? 'Ex: Pela restauração da saúde do meu irmão'
                      : 'Ex: Gratidão pela provisão financeira desta semana'
                  }
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CABE] bg-[#FAF8F5] text-xs sm:text-sm font-medium text-[#2E281F] focus:outline-none focus:ring-1 focus:ring-[#8C6D3F]"
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4E4437]">
                    Categoria
                  </label>
                  <select
                    id="select-form-category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as PrayerCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D9CABE] bg-[#FAF8F5] text-xs font-medium text-[#2E281F] focus:outline-none focus:ring-1 focus:ring-[#8C6D3F]"
                  >
                    {PRAYER_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4E4437]">
                    Data
                  </label>
                  <input
                    id="input-form-date"
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9CABE] bg-[#FAF8F5] text-xs font-medium text-[#2E281F] focus:outline-none focus:ring-1 focus:ring-[#8C6D3F]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4E4437]">
                  {formType === 'pedido' ? 'Oração & Detalhes da Petição' : 'Expressão de Gratidão'} *
                </label>
                <textarea
                  id="textarea-form-description"
                  required
                  rows={4}
                  placeholder={
                    formType === 'pedido'
                      ? 'Escreva sua oração com suas próprias palavras... "Senhor meu Deus, coloco em Tuas mãos..."'
                      : 'Descreva a bênção recebida ou a fidelidade de Deus que alegrou seu coração...'
                  }
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CABE] bg-[#FAF8F5] text-xs sm:text-sm font-medium text-[#2E281F] focus:outline-none focus:ring-1 focus:ring-[#8C6D3F] resize-y"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  id="btn-cancel-prayer-form"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D9CABE] text-xs font-semibold text-[#6E6354] hover:bg-[#F3ECE0]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-save-prayer-form"
                  className="px-5 py-2 rounded-xl bg-[#8C6D3F] hover:bg-[#785C32] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  {editingPrayer ? 'Salvar Alterações' : 'Registrar no Diário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Mark as Answered with Testimony */}
      {answeringPrayerId && (
        <div
          id="modal-mark-answered"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setAnsweringPrayerId(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-[#FFFDFB] border border-[#D1E7D7] shadow-2xl p-5 sm:p-7 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-[#E0EFE3] text-[#1E6B35] shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-serif-devotional text-xl font-bold text-[#195C2B]">
                  Celebrar Oração Respondida!
                </h3>
                <p className="text-xs text-[#52795E]">
                  Compartilhe como Deus atendeu a sua oração para fortalecer a sua fé no futuro.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2D5A39]">
                  Data da Resposta
                </label>
                <input
                  id="input-answer-date"
                  type="date"
                  value={answerDate}
                  onChange={(e) => setAnswerDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#BBDCBF] bg-[#FAFDFB] text-xs font-medium text-[#2E281F] focus:outline-none focus:ring-1 focus:ring-[#2D6A3E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2D5A39]">
                  Testemunho: Como Deus agiu?
                </label>
                <textarea
                  id="textarea-testimony"
                  rows={3}
                  placeholder="Ex: Deus abriu uma porta inesperada, os exames vieram limpos e Ele colocou pessoas abençoadoras no meu caminho..."
                  value={testimonyText}
                  onChange={(e) => setTestimonyText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#BBDCBF] bg-[#FAFDFB] text-xs sm:text-sm font-medium text-[#2E281F] focus:outline-none focus:ring-1 focus:ring-[#2D6A3E] resize-y"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setAnsweringPrayerId(null)}
                className="px-4 py-2 rounded-xl border border-[#C5E3CE] text-xs font-semibold text-[#52795E] hover:bg-[#F0FAF2]"
              >
                Cancelar
              </button>
              <button
                type="button"
                id="btn-confirm-answered"
                onClick={handleConfirmAnswered}
                className="px-5 py-2 rounded-xl bg-[#2D6A3E] hover:bg-[#235330] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Salvar Testemunho & Celebrar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL / DRAWER: Prayer Guide Templates */}
      {isTemplatesOpen && (
        <div
          id="modal-prayer-templates"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsTemplatesOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-3xl bg-[#FFFDFB] border border-[#E8E1D5] shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6 border-b border-[#EAE3D6] flex items-center justify-between">
              <div>
                <h3 className="font-serif-devotional text-xl font-bold text-[#2B2319]">
                  Modelos e Inspirações de Oração
                </h3>
                <p className="text-xs text-[#7A7165]">
                  Escolha um modelo bíblico para adaptar e registrar no seu diário.
                </p>
              </div>
              <button
                onClick={() => setIsTemplatesOpen(false)}
                className="p-1.5 rounded-lg text-[#9E9385] hover:text-[#2B2319]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 divide-y divide-[#F0EAE1]">
              {PRAYER_GUIDE_TEMPLATES.map((tmpl, idx) => (
                <div key={idx} className="pt-3.5 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif-devotional font-bold text-base text-[#2B2319]">
                      {tmpl.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tmpl.type === 'pedido'
                          ? 'bg-[#FBF2E3] text-[#9A5B18]'
                          : 'bg-[#EBF5EE] text-[#1E6B35]'
                      }`}
                    >
                      {tmpl.type === 'pedido' ? 'Pedido' : 'Agradecimento'}
                    </span>
                  </div>

                  <p className="text-xs text-[#635747] leading-relaxed italic bg-[#FAF8F5] p-3 rounded-xl border border-[#EFE9DF]">
                    "{tmpl.description}"
                  </p>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="px-3 py-1.5 rounded-xl bg-[#8C6D3F] hover:bg-[#785C32] text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Usar este modelo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
