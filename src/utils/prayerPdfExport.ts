import { jsPDF } from 'jspdf';
import { PrayerEntry, PrayerCategory } from '../types';
import { PRAYER_CATEGORIES } from '../data/prayersData';

export interface PdfExportOptions {
  scope: 'all' | 'answered_only' | 'active_only';
  categoryFilter?: string; // 'all' or category id
  includeStats: boolean;
  includeScripture: boolean;
}

const getCategoryLabel = (category: PrayerCategory): string => {
  const found = PRAYER_CATEGORIES.find((c) => c.id === category);
  return found ? found.label : category;
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

export const exportPrayersToPdf = (
  prayers: PrayerEntry[],
  options: PdfExportOptions = {
    scope: 'all',
    categoryFilter: 'all',
    includeStats: true,
    includeScripture: true,
  }
): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Filter prayers according to options
  let filtered = [...prayers];

  if (options.scope === 'answered_only') {
    filtered = filtered.filter((p) => p.status === 'respondido');
  } else if (options.scope === 'active_only') {
    filtered = filtered.filter((p) => p.type === 'pedido' && p.status === 'ativo');
  }

  if (options.categoryFilter && options.categoryFilter !== 'all') {
    filtered = filtered.filter((p) => p.category === options.categoryFilter);
  }

  // Sort: responded first with testimonies, then active
  filtered.sort((a, b) => {
    if (a.status === 'respondido' && b.status !== 'respondido') return -1;
    if (a.status !== 'respondido' && b.status === 'respondido') return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const totalAnswered = prayers.filter((p) => p.status === 'respondido').length;
  const totalActive = prayers.filter((p) => p.type === 'pedido' && p.status === 'ativo').length;
  const totalMoments = prayers.reduce((sum, p) => sum + (p.timesPrayed || 0), 0);

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      drawPageHeader();
    }
  };

  const drawPageHeader = () => {
    // Subtle top running header on pages > 1
    if (doc.getNumberOfPages() > 1) {
      doc.setFontSize(8);
      doc.setTextColor(140, 109, 63);
      doc.setFont('helvetica', 'bold');
      doc.text('DIÁRIO DE ORAÇÃO & MEMORIAL DE TESTEMUNHOS', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 140, 130);
      const todayStr = new Date().toLocaleDateString('pt-BR');
      doc.text(todayStr, pageWidth - margin, y, { align: 'right' });
      y += 4;
      doc.setDrawColor(229, 218, 203);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
    }
  };

  // --- Document Cover / Header (Page 1) ---
  // Background Header Card
  doc.setFillColor(250, 248, 244);
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'F');
  doc.setDrawColor(229, 218, 203);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'S');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(43, 35, 25);
  doc.text('Diário de Oração & Memorial de Testemunhos', margin + 6, y + 10);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(140, 109, 63);
  doc.text('Registro pessoal de clamores, súplicas e da fidelidade de Deus', margin + 6, y + 16);

  // Date and filter summary
  doc.setFontSize(8);
  doc.setTextColor(120, 110, 100);
  const dateFormatted = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Exportado em: ${dateFormatted}  |  Registros exportados: ${filtered.length}`, margin + 6, y + 23);

  // Small scope badge
  const scopeLabel =
    options.scope === 'answered_only'
      ? 'Apenas Testemunhos de Orações Respondidas'
      : options.scope === 'active_only'
      ? 'Apenas Pedidos Ativos em Oração'
      : 'Todos os Pedidos e Agradecimentos';
  doc.text(`Filtro selecionado: ${scopeLabel}`, margin + 6, y + 29);

  y += 38;

  // --- Biblical Scripture Box ---
  if (options.includeScripture) {
    checkPageBreak(22);
    doc.setFillColor(246, 240, 228);
    doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
    doc.setDrawColor(232, 220, 201);
    doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'S');

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(60, 50, 37);
    const scriptureText =
      '"Não andeis ansiosos de coisa alguma; em tudo, porém, sejam conhecidas diante de Deus as vossas petições, pela oração e pela súplica, com ações de graças."';
    const splitScripture = doc.splitTextToSize(scriptureText, contentWidth - 12);
    doc.text(splitScripture, margin + 6, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(140, 109, 63);
    doc.text('Filipenses 4:6', margin + 6, y + 14);

    y += 22;
  }

  // --- Stats Bar ---
  if (options.includeStats) {
    checkPageBreak(18);
    const boxWidth = (contentWidth - 6) / 3;

    // Box 1: Ativos
    doc.setFillColor(255, 253, 251);
    doc.roundedRect(margin, y, boxWidth, 15, 2, 2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 110, 100);
    doc.text('EM CLAMOR ATIVO', margin + 4, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(140, 109, 63);
    doc.text(`${totalActive}`, margin + 4, y + 11.5);

    // Box 2: Respondidas
    const box2X = margin + boxWidth + 3;
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(box2X, y, boxWidth, 15, 2, 2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(22, 101, 52);
    doc.text('ORAÇÕES RESPONDIDAS', box2X + 4, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(21, 128, 61);
    doc.text(`${totalAnswered}`, box2X + 4, y + 11.5);

    // Box 3: Momentos de oração
    const box3X = margin + (boxWidth + 3) * 2;
    doc.setFillColor(255, 253, 251);
    doc.roundedRect(box3X, y, boxWidth, 15, 2, 2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 110, 100);
    doc.text('MOMENTOS DE CLAMOR', box3X + 4, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(60, 50, 37);
    doc.text(`${totalMoments}`, box3X + 4, y + 11.5);

    y += 20;
  }

  // Section Header
  checkPageBreak(12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(43, 35, 25);
  doc.text('Registros de Oração & Testemunhos de Fé', margin, y);
  y += 2;
  doc.setDrawColor(229, 218, 203);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Empty state if no records
  if (filtered.length === 0) {
    checkPageBreak(20);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(130, 120, 110);
    doc.text('Nenhum registro encontrado para os critérios selecionados.', margin, y + 10);
    y += 20;
  }

  // --- Iterate and Render Each Prayer Entry ---
  filtered.forEach((prayer, index) => {
    const isAnswered = prayer.status === 'respondido';
    const hasTestimony = Boolean(prayer.testimony && prayer.testimony.trim());

    // Calculate approximate height needed for this card
    const titleLines = doc.splitTextToSize(prayer.title, contentWidth - 14);
    const descLines = prayer.description
      ? doc.splitTextToSize(prayer.description, contentWidth - 14)
      : [];
    const testimonyLines = hasTestimony
      ? doc.splitTextToSize(prayer.testimony!, contentWidth - 20)
      : [];

    let estimatedHeight = 16 + titleLines.length * 4.5 + descLines.length * 4;
    if (hasTestimony) {
      estimatedHeight += 12 + testimonyLines.length * 4;
    }
    estimatedHeight += 6; // padding bottom

    checkPageBreak(estimatedHeight);

    const cardY = y;

    // Card background
    if (isAnswered) {
      doc.setFillColor(252, 254, 252);
      doc.setDrawColor(187, 247, 208);
    } else {
      doc.setFillColor(255, 253, 250);
      doc.setDrawColor(229, 218, 203);
    }
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, cardY, contentWidth, estimatedHeight, 2.5, 2.5, 'FD');

    // Left color accent bar
    if (isAnswered) {
      doc.setFillColor(22, 163, 74);
    } else {
      doc.setFillColor(140, 109, 63);
    }
    doc.roundedRect(margin, cardY, 2.5, estimatedHeight, 1, 1, 'F');

    let currentY = cardY + 5.5;

    // Status & Category Tag
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);

    if (isAnswered) {
      doc.setTextColor(21, 128, 61);
      doc.text('[RESPONDIDO - TESTEMUNHO]', margin + 6, currentY);
    } else {
      doc.setTextColor(140, 109, 63);
      doc.text('[EM ORACAO ATIVA]', margin + 6, currentY);
    }

    // Category and Date
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 110, 100);
    const catLabel = getCategoryLabel(prayer.category);
    const dateFormatted = formatDate(prayer.date);
    doc.text(`Categoria: ${catLabel}  |  Registrado em: ${dateFormatted}`, margin + 55, currentY);

    if (prayer.timesPrayed && prayer.timesPrayed > 0) {
      doc.text(`Momentos: ${prayer.timesPrayed}x`, pageWidth - margin - 4, currentY, { align: 'right' });
    }

    currentY += 5;

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(43, 35, 25);
    doc.text(titleLines, margin + 6, currentY);
    currentY += titleLines.length * 4.5;

    // Description
    if (descLines.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(65, 55, 45);
      doc.text(descLines, margin + 6, currentY);
      currentY += descLines.length * 4 + 2;
    }

    // Testimony Box (if answered with testimony)
    if (hasTestimony) {
      const boxH = 9 + testimonyLines.length * 4;
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);
      doc.setLineWidth(0.25);
      doc.roundedRect(margin + 5, currentY, contentWidth - 10, boxH, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(21, 128, 61);
      const ansDateStr = prayer.answeredDate ? ` (${formatDate(prayer.answeredDate)})` : '';
      doc.text(`Como Deus respondeu${ansDateStr}:`, margin + 8, currentY + 4.5);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(20, 83, 45);
      doc.text(testimonyLines, margin + 8, currentY + 8.5);

      currentY += boxH + 2;
    }

    y = cardY + estimatedHeight + 4;
  });

  // --- Page Numbering Footers on all pages ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 130, 120);
    doc.setDrawColor(229, 218, 203);
    doc.setLineWidth(0.25);
    doc.line(margin, pageHeight - margin + 2, pageWidth - margin, pageHeight - margin + 2);

    doc.text(
      'Diário de Oração & Memorial - Arquivo Pessoal para Edificação e Memória',
      margin,
      pageHeight - margin + 6
    );
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth - margin,
      pageHeight - margin + 6,
      { align: 'right' }
    );
  }

  // Generate and trigger download
  const dateStamp = new Date().toISOString().split('T')[0];
  const filename = `diario-de-oracao-testemunhos-${dateStamp}.pdf`;
  doc.save(filename);
};
