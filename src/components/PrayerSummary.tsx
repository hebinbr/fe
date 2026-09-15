import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Heart,
  Trophy,
  Filter,
  Check
} from 'lucide-react';
import { PrayerEntry } from '../types';
import { PRAYER_CATEGORIES } from '../data/prayersData';

interface PrayerSummaryProps {
  prayers: PrayerEntry[];
  onSelectFilterType?: (type: 'all' | 'pedido_ativo' | 'respondido' | 'agradecimento') => void;
}

const MONTH_NAMES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const FULL_MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const PrayerSummary: React.FC<PrayerSummaryProps> = ({
  prayers,
  onSelectFilterType,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar');
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>('all'); // 'all' or 'YYYY-MM'

  // Determine available months from data
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    prayers.forEach((p) => {
      if (p.date && p.date.length >= 7) {
        set.add(p.date.substring(0, 7));
      }
      if (p.answeredDate && p.answeredDate.length >= 7) {
        set.add(p.answeredDate.substring(0, 7));
      }
    });

    // Ensure current month (2026-09) is included
    set.add('2026-09');
    set.add('2026-08');
    set.add('2026-07');
    set.add('2026-06');
    set.add('2026-05');
    set.add('2026-04');

    return Array.from(set).sort().reverse();
  }, [prayers]);

  // Generate monthly aggregated comparison data
  const monthlyData = useMemo(() => {
    // Collect the last 6 months in chronological order
    const sortedChronological = [...availableMonths].sort();
    // take last 6
    const recent6 = sortedChronological.slice(-6);

    return recent6.map((monthKey) => {
      const [yearStr, monthStr] = monthKey.split('-');
      const monthIdx = parseInt(monthStr, 10) - 1;
      const monthLabel = `${MONTH_NAMES[monthIdx]} / ${yearStr.slice(2)}`;
      const fullLabel = `${FULL_MONTH_NAMES[monthIdx]} de ${yearStr}`;

      // Pedidos realizados in this month (type === 'pedido' and created in this month)
      const realizados = prayers.filter((p) => {
        return p.type === 'pedido' && p.date && p.date.startsWith(monthKey);
      }).length;

      // Pedidos respondidos in this month (answered in this month, or answeredDate in this month)
      const respondidos = prayers.filter((p) => {
        if (p.status !== 'respondido') return false;
        const targetDate = p.answeredDate || p.date;
        return targetDate && targetDate.startsWith(monthKey);
      }).length;

      // Total momentos de oração no mês
      const momentosOracao = prayers
        .filter((p) => (p.date && p.date.startsWith(monthKey)) || (p.answeredDate && p.answeredDate.startsWith(monthKey)))
        .reduce((sum, p) => sum + (p.timesPrayed || 0), 0);

      // Taxa de resposta
      const taxa = realizados > 0 ? Math.round((respondidos / realizados) * 100) : (respondidos > 0 ? 100 : 0);

      return {
        monthKey,
        month: monthLabel,
        fullLabel,
        realizados,
        respondidos,
        taxa,
        momentosOracao,
      };
    });
  }, [prayers, availableMonths]);

  // Overall calculations or filtered by selected month
  const metrics = useMemo(() => {
    let relevantPrayers = prayers;
    if (selectedMonthKey !== 'all') {
      relevantPrayers = prayers.filter((p) => {
        const inCreated = p.date && p.date.startsWith(selectedMonthKey);
        const inAnswered = p.answeredDate && p.answeredDate.startsWith(selectedMonthKey);
        return inCreated || inAnswered;
      });
    }

    const totalRealizados = relevantPrayers.filter((p) => p.type === 'pedido').length;
    const totalRespondidos = relevantPrayers.filter((p) => p.status === 'respondido' && (p.type === 'pedido' || p.testimony)).length;
    const totalEmOracao = relevantPrayers.filter((p) => p.type === 'pedido' && p.status === 'ativo').length;
    const totalAgradecimentos = relevantPrayers.filter((p) => p.type === 'agradecimento').length;
    const totalClamores = relevantPrayers.reduce((sum, p) => sum + (p.timesPrayed || 0), 0);

    const taxaGeral = totalRealizados > 0 ? Math.round((totalRespondidos / totalRealizados) * 100) : 0;

    return {
      totalRealizados,
      totalRespondidos,
      totalEmOracao,
      totalAgradecimentos,
      totalClamores,
      taxaGeral,
    };
  }, [prayers, selectedMonthKey]);

  // Category breakdown of answered vs total
  const categoryStats = useMemo(() => {
    return PRAYER_CATEGORIES.map((cat) => {
      const items = prayers.filter((p) => p.category === cat.id);
      const total = items.length;
      const respondidas = items.filter((p) => p.status === 'respondido').length;
      const ativas = items.filter((p) => p.status === 'ativo').length;
      return {
        ...cat,
        total,
        respondidas,
        ativas,
      };
    }).filter((c) => c.total > 0);
  }, [prayers]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#DED4C5] shadow-lg text-xs space-y-2 min-w-[200px]">
          <div className="border-b border-[#EFE8DC] pb-1.5 font-semibold text-[#2D2418] flex items-center justify-between">
            <span>{data.fullLabel || label}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F3EDE2] text-[#8C6D3F] font-bold">
              {data.taxa}% respondidos
            </span>
          </div>
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between gap-3 text-[#5A4934]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8C6D3F] inline-block" />
                <span>Pedidos Realizados:</span>
              </span>
              <span className="font-bold text-[#2B2319]">{data.realizados}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[#1E743A]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] inline-block" />
                <span>Pedidos Respondidos:</span>
              </span>
              <span className="font-bold text-[#14532D]">{data.respondidos}</span>
            </div>
            {data.momentosOracao > 0 && (
              <div className="flex items-center justify-between gap-3 text-[#786D5E] text-[11px] pt-1 border-t border-[#F2ECE1]">
                <span>Momentos de Clamor:</span>
                <span className="font-medium">{data.momentosOracao} vezes</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const formatMonthLabel = (key: string) => {
    if (key === 'all') return 'Todos os Meses';
    const [year, month] = key.split('-');
    const mIdx = parseInt(month, 10) - 1;
    return `${FULL_MONTH_NAMES[mIdx]} de ${year}`;
  };

  return (
    <section
      id="prayer-summary-component"
      className="bg-[#FFFDF8] rounded-3xl border border-[#E8DFC8] p-4 sm:p-6 shadow-xs space-y-5 transition-all"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E6D8] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#8C6D3F] text-white shadow-2xs">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-devotional text-xl sm:text-2xl font-bold text-[#2C2319]">
                Resumo de Oração
              </h3>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F3EDE2] text-[#8C6D3F] border border-[#E3D7C5]">
                Fidelidade de Deus
              </span>
            </div>
            <p className="text-xs text-[#7A6E5F]">
              Acompanhamento mensal de pedidos realizados versus orações respondidas
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Month Selector Filter */}
          <div className="relative">
            <select
              id="select-prayer-summary-month"
              value={selectedMonthKey}
              onChange={(e) => setSelectedMonthKey(e.target.value)}
              className="appearance-none bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#554636] border border-[#D9CDBF] rounded-xl px-3 py-1.5 pr-8 text-xs font-medium cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-[#8C6D3F]"
            >
              <option value="all">Visão Geral (Todos os Meses)</option>
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {formatMonthLabel(m)}
                </option>
              ))}
            </select>
            <Calendar className="w-3.5 h-3.5 text-[#8C6D3F] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Chart visual type toggle */}
          <div className="hidden sm:flex items-center bg-[#F3EEE5] rounded-xl p-0.5 border border-[#E3D9CC]">
            <button
              id="btn-chart-type-bar"
              onClick={() => setChartType('bar')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                chartType === 'bar'
                  ? 'bg-white text-[#2B2319] shadow-2xs font-semibold'
                  : 'text-[#7D6F5F] hover:text-[#2B2319]'
              }`}
              title="Gráfico de Barras"
            >
              Barras
            </button>
            <button
              id="btn-chart-type-area"
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                chartType === 'area'
                  ? 'bg-white text-[#2B2319] shadow-2xs font-semibold'
                  : 'text-[#7D6F5F] hover:text-[#2B2319]'
              }`}
              title="Gráfico de Área Suave"
            >
              Tendência
            </button>
          </div>

          {/* Toggle Expand/Collapse */}
          <button
            id="btn-toggle-prayer-summary"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl border border-[#D9CDBF] bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#6E5F50] transition-colors"
            title={isExpanded ? 'Recolher resumo' : 'Expandir resumo'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div id="prayer-kpi-cards" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Realizados */}
        <div
          onClick={() => onSelectFilterType && onSelectFilterType('all')}
          className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#E6DCCF] transition-all hover:border-[#8C6D3F] cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8C6D3F] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F604E]">
              Total Realizados
            </span>
            <Clock className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-serif-devotional text-2xl sm:text-3xl font-bold text-[#2A2218]">
            {metrics.totalRealizados}
          </div>
          <p className="text-[11px] text-[#7C6E5C] mt-0.5">
            {metrics.totalEmOracao} ativos em oração
          </p>
        </div>

        {/* Respondidos */}
        <div
          onClick={() => onSelectFilterType && onSelectFilterType('respondido')}
          className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#C6F6D5] transition-all hover:border-[#16A34A] cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#15803D] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534]">
              Respondidos
            </span>
            <Trophy className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-serif-devotional text-2xl sm:text-3xl font-bold text-[#14532D]">
            {metrics.totalRespondidos}
          </div>
          <p className="text-[11px] text-[#166534] mt-0.5 font-medium">
            Testemunhos de vitória
          </p>
        </div>

        {/* Taxa de Resposta */}
        <div className="p-3.5 rounded-2xl bg-[#FFF9EE] border border-[#F4E4C6]">
          <div className="flex items-center justify-between text-[#B45309] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#92400E]">
              Taxa de Resposta
            </span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="font-serif-devotional text-2xl sm:text-3xl font-bold text-[#78350F]">
            {metrics.taxaGeral}%
          </div>
          <p className="text-[11px] text-[#92400E] mt-0.5">
            Orações atendidas
          </p>
        </div>

        {/* Total Clamores */}
        <div className="p-3.5 rounded-2xl bg-[#FAF5FF] border border-[#E9D5FF]">
          <div className="flex items-center justify-between text-[#7E22CE] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B21A8]">
              Intercessões
            </span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="font-serif-devotional text-2xl sm:text-3xl font-bold text-[#581C87]">
            {metrics.totalClamores}
          </div>
          <p className="text-[11px] text-[#6B21A8] mt-0.5">
            Vezes que você clamou
          </p>
        </div>
      </div>

      {/* Expanded Chart Body */}
      {isExpanded && (
        <div className="space-y-6 pt-2">
          {/* Chart Container */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5DACB]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#30251A] flex items-center gap-1.5">
                  <span>Evolução Mensal: Realizados vs. Respondidos</span>
                </h4>
                <p className="text-xs text-[#7A6D5E]">
                  Compare a quantidade de pedidos entregues a Deus e as orações que já foram respondidas ao longo dos meses
                </p>
              </div>

              {/* Legend Badges */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-[#8C6D3F]">
                  <span className="w-3 h-3 rounded-xs bg-[#8C6D3F]" />
                  <span>Pedidos Realizados</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#15803D]">
                  <span className="w-3 h-3 rounded-xs bg-[#16A34A]" />
                  <span>Respondidos</span>
                </div>
              </div>
            </div>

            {/* Recharts Component */}
            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 10, right: 10, left: -18, bottom: 0 }}
                    barGap={6}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5DDD0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#6D5F50', fontSize: 11 }}
                      axisLine={{ stroke: '#D9CDBF' }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: '#6D5F50', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="realizados"
                      name="Pedidos Realizados"
                      fill="#8C6D3F"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={32}
                    />
                    <Bar
                      dataKey="respondidos"
                      name="Pedidos Respondidos"
                      fill="#16A34A"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={32}
                    />
                  </BarChart>
                ) : (
                  <AreaChart
                    data={monthlyData}
                    margin={{ top: 10, right: 10, left: -18, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRealizados" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8C6D3F" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8C6D3F" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorRespondidos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16A34A" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5DDD0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#6D5F50', fontSize: 11 }}
                      axisLine={{ stroke: '#D9CDBF' }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: '#6D5F50', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="realizados"
                      name="Pedidos Realizados"
                      stroke="#8C6D3F"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorRealizados)"
                    />
                    <Area
                      type="monotone"
                      dataKey="respondidos"
                      name="Pedidos Respondidos"
                      stroke="#16A34A"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorRespondidos)"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Encouraging Faith Banner under chart */}
            <div className="mt-3 pt-3 border-t border-[#EAE0D1] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#6F604F]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#8C6D3F] shrink-0" />
                <span>
                  <strong>Registro de Graça:</strong> Cada barra respondida representa uma intervenção e cuidado de Deus na sua história.
                </span>
              </div>
              <span className="text-[11px] text-[#8C6D3F] font-semibold italic">
                "Pedi, e dar-se-vos-á; buscai e achareis." — Mateus 7:7
              </span>
            </div>
          </div>

          {/* Categories Progress Bar Breakdown */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-[#E9E0D2] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#736352]">
                  Resumo por Categoria de Oração
                </h5>
                <p className="text-[11px] text-[#8A7C6D]">
                  Distribuição de pedidos e respostas em cada área da sua vida
                </p>
              </div>
              <span className="text-xs font-semibold text-[#8C6D3F]">
                {categoryStats.length} áreas registradas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {categoryStats.map((cat) => {
                const pctAnswered = cat.total > 0 ? Math.round((cat.respondidas / cat.total) * 100) : 0;
                return (
                  <div
                    key={cat.id}
                    className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFC0] flex flex-col justify-between gap-2 hover:border-[#D0BFA8] transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#2C2319]">{cat.label}</span>
                      <span className="text-[11px] text-[#15803D] font-bold bg-[#E8F8EE] px-2 py-0.5 rounded-md">
                        {cat.respondidas} / {cat.total} respondidas
                      </span>
                    </div>

                    {/* Progress visual */}
                    <div className="space-y-1">
                      <div className="w-full h-2 rounded-full bg-[#EAE1D3] overflow-hidden flex">
                        <div
                          className="h-full bg-[#16A34A] rounded-full transition-all duration-500"
                          style={{ width: `${pctAnswered}%` }}
                          title={`${pctAnswered}% respondidas`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#786C5E]">
                        <span>{cat.ativas} em intercessão ativa</span>
                        <span className="font-medium text-[#166534]">{pctAnswered}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
