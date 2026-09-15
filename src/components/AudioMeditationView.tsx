import React, { useState, useEffect } from 'react';
import {
  Play,
  Square,
  Volume2,
  VolumeX,
  Sliders,
  CloudRain,
  Waves,
  Music,
  Wind,
  Bell,
  Sparkles,
  Heart,
  Timer,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { AudioAmbientTrack, UserPreferences } from '../types';
import { soundSynthesizer, devotionalTTS, TTSState } from '../utils/audioEngine';

interface AudioMeditationViewProps {
  preferences: UserPreferences;
  ttsState: TTSState;
  currentAmbient: string | null;
  isAmbientPlaying: boolean;
  onPlayAmbient: (type: 'pad' | 'rain' | 'stream' | 'harp' | 'wind') => void;
  onStopAmbient: () => void;
  ambientVolume: number;
  onChangeAmbientVolume: (vol: number) => void;
}

const AMBIENT_SOUNDS: AudioAmbientTrack[] = [
  {
    id: 'pad',
    name: 'Acordes de Adoração',
    description: 'Camadas sonoras suaves e aconchegantes para momentos de oração profunda',
    icon: 'music',
    type: 'pad',
  },
  {
    id: 'rain',
    name: 'Chuva Suave de Paz',
    description: 'Gotas tranquilizadoras que acalmam a mente e trazem refúgio interior',
    icon: 'rain',
    type: 'rain',
  },
  {
    id: 'stream',
    name: 'Águas de Descanso',
    description: 'Som constante de um riacho sereno, inspirado no Salmo 23',
    icon: 'stream',
    type: 'stream',
  },
  {
    id: 'harp',
    name: 'Harpa Celestial & Sinos',
    description: 'Harmônicos contemplativos que inspiram reverência e gratidão',
    icon: 'harp',
    type: 'harp',
  },
  {
    id: 'wind',
    name: 'Brisa Suave do Espírito',
    description: 'O murmúrio pacífico do vento, como na experiência de Elias no monte',
    icon: 'wind',
    type: 'wind',
  },
];

const SPOKEN_PASSAGES = [
  {
    id: 'spoken-psalm-23',
    title: 'Salmo 23 • O Bom Pastor',
    reference: 'Salmo 23:1-6',
    duration: '2 min',
    text: 'O Senhor é o meu pastor; nada me faltará. Ele me faz repousar em pastos verdejantes. Leva-me para junto das águas de descanso; refrigera a minha alma. Guia-me pelas veredas da justiça por amor do seu nome. Ainda que eu ande pelo vale da sombra da morte, não temerei mal nenhum, porque tu estás comigo; o teu bordão e o teu cajado me consolam. Preparas-me uma mesa na presença dos meus adversários, unges-me a cabeça com óleo; o meu cálice transborda. Bondade e misericórdia certamente me seguirão todos os dias da minha vida; e habitarei na Casa do Senhor para todo o sempre.'
  },
  {
    id: 'spoken-psalm-91',
    title: 'Salmo 91 • O Refúgio do Altíssimo',
    reference: 'Salmo 91:1-16',
    duration: '3 min',
    text: 'O que habita no esconderijo do Altíssimo e descansa à sombra do Onipotente diz ao Senhor: Meu refúgio e meu baluarte, Deus meu, em quem confio. Pois ele te livrará do laço do passarinheiro e da peste perniciosa. Cobrir-te-á com as suas penas, e, sob as suas asas, estarás seguro; a sua verdade é pavês e escudo. Não te assustarás do terror noturno, nem da seta que voa de dia, nem da peste que se propaga nas trevas, nem da mortandade que assola ao meio-dia. Caiam mil ao teu lado, e dez mil, à tua direita; tu não serás atingido.'
  },
  {
    id: 'spoken-lord-prayer',
    title: 'A Oração do Pai Nosso',
    reference: 'Mateus 6:9-13',
    duration: '1 min',
    text: 'Pai nosso, que estás nos céus, santificado seja o teu nome; venha o teu reino; faça-se a tua vontade, assim na terra como no céu; o pão nosso de cada dia dá-nos hoje; e perdoa-nos as nossas dívidas, assim como nós temos perdoado aos nossos devedores; e não nos deixes cair em tentação; mas livra-nos do mal; pois teu é o reino, o poder e a glória para sempre. Amém.'
  },
  {
    id: 'spoken-psalm-121',
    title: 'Salmo 121 • O Guarda de Israel',
    reference: 'Salmo 121:1-8',
    duration: '2 min',
    text: 'Elevo os olhos para os montes: de onde me virá o socorro? O meu socorro vem do Senhor, que fez o céu e a terra. Ele não permitirá que os teus pés vacilem; não dormitará aquele que te guarda. É certo que não dormita, nem dorme o guarda de Israel. O Senhor é quem te guarda; o Senhor é a tua sombra à tua direita. De dia não te molestará o sol, nem de noite, a lua. O Senhor te guardará de todo o mal; guardará a tua alma. O Senhor guardará a tua saída e a tua entrada, desde agora e para sempre.'
  }
];

export const AudioMeditationView: React.FC<AudioMeditationViewProps> = ({
  preferences,
  ttsState,
  currentAmbient,
  isAmbientPlaying,
  onPlayAmbient,
  onStopAmbient,
  ambientVolume,
  onChangeAmbientVolume,
}) => {
  // Meditation Timer State
  const [timerDuration, setTimerDuration] = useState<number>(300); // 5 min in sec
  const [timerRemaining, setTimerRemaining] = useState<number>(300);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inspire' | 'hold' | 'expire' | 'rest'>('inspire');
  const [breathCount, setBreathCount] = useState<number>(4);

  // Active Spoken Track
  const [activeSpokenId, setActiveSpokenId] = useState<string | null>(null);

  // Meditation timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            soundSynthesizer.playChime();
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerRemaining]);

  // Breathing 4-4-4-4 rhythm
  useEffect(() => {
    let breathInterval: NodeJS.Timeout;
    if (isTimerRunning) {
      breathInterval = setInterval(() => {
        setBreathCount((prev) => {
          if (prev <= 1) {
            setBreathPhase((current) => {
              if (current === 'inspire') return 'hold';
              if (current === 'hold') return 'expire';
              if (current === 'expire') return 'rest';
              return 'inspire';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(breathInterval);
  }, [isTimerRunning]);

  const handleStartTimer = (seconds: number) => {
    setTimerDuration(seconds);
    setTimerRemaining(seconds);
    setIsTimerRunning(true);
    soundSynthesizer.playChime();
    // Auto-start worship pad if no ambient is playing
    if (!isAmbientPlaying) {
      onPlayAmbient('pad');
    }
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerRemaining(timerDuration);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlaySpoken = (item: typeof SPOKEN_PASSAGES[0]) => {
    if (ttsState.isSpeaking && activeSpokenId === item.id) {
      devotionalTTS.stop();
      setActiveSpokenId(null);
    } else {
      setActiveSpokenId(item.id);
      devotionalTTS.speak(item.title, [item.title, item.text]);
      // Also gentle ambient if desired
      if (!isAmbientPlaying) {
        onPlayAmbient('pad');
      }
    }
  };

  return (
    <div id="audio-meditation-view" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
      {/* Intro Banner */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D3F]">
          Sons de Adoração & Reflexão Bíblica
        </span>
        <h2 className="font-serif-devotional text-2xl sm:text-3xl font-bold text-[#2B2319]">
          Espaço de Quietude & Áudios Sagrados
        </h2>
        <p className="text-sm sm:text-base text-[#6E6354]">
          Combine narrações das Escrituras com fundos sonoros relaxantes sintetizados em tempo real, ou pratique uma pausa de meditação e respiração guiada.
        </p>
      </div>

      {/* Guided Meditation Timer with Breathing Guide */}
      <div
        id="guided-meditation-box"
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#F6EFE5] via-[#EDE2D0] to-[#E5D5BF] border border-[#DECEB7] shadow-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#8C6D3F] text-white">
              <Heart className="w-5 h-5 text-[#FBF8F1]" />
            </div>
            <div>
              <h3 className="font-serif-devotional text-xl font-bold text-[#2D241A]">
                Pausa de Meditação & Oração Guiada
              </h3>
              <p className="text-xs text-[#7A6A55]">
                Sincronize sua respiração e acalme o coração na presença do Pai
              </p>
            </div>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-2">
            {[
              { label: '3 min', sec: 180 },
              { label: '5 min', sec: 300 },
              { label: '10 min', sec: 600 },
            ].map((preset) => (
              <button
                key={preset.sec}
                id={`btn-preset-${preset.sec}`}
                onClick={() => handleStartTimer(preset.sec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  timerDuration === preset.sec && isTimerRunning
                    ? 'bg-[#8C6D3F] text-white shadow-xs'
                    : 'bg-white/70 hover:bg-white text-[#4A3D2E]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Meditation Stage & Breathing Circle */}
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-5">
          {/* Animated Breathing Circle */}
          <div className="relative flex items-center justify-center">
            <div
              id="breathing-circle-outer"
              className={`w-44 h-44 rounded-full border-4 transition-all duration-1000 flex items-center justify-center ${
                breathPhase === 'inspire'
                  ? 'scale-110 border-[#8C6D3F] bg-[#FAF5EC]/80 shadow-lg shadow-[#8C6D3F]/20'
                  : breathPhase === 'hold'
                  ? 'scale-110 border-[#C27803] bg-[#FFF8EE]/90'
                  : breathPhase === 'expire'
                  ? 'scale-90 border-[#69826D] bg-[#F1F6F2]/80'
                  : 'scale-95 border-[#9C8F7E] bg-[#FAF8F5]/80'
              }`}
            >
              <div className="text-center space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#695843]">
                  {breathPhase === 'inspire' && 'Inspire Suavemente'}
                  {breathPhase === 'hold' && 'Segure a Respiração'}
                  {breathPhase === 'expire' && 'Expire Soltando o Peso'}
                  {breathPhase === 'rest' && 'Repouse em Paz'}
                </p>
                <p className="text-3xl font-serif-devotional font-bold text-[#2B2319]">
                  {breathCount}
                </p>
                <p className="text-[11px] text-[#8C8070]">
                  {formatTime(timerRemaining)} restante
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm font-serif-devotional italic text-[#4A3E31] max-w-md">
            "Aquietai-vos e sabei que eu sou Deus; sou exaltado entre as nações, sou exaltado na terra." — Salmo 46:10
          </p>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {isTimerRunning ? (
              <button
                id="btn-pause-meditation-timer"
                onClick={handlePauseTimer}
                className="px-5 py-2.5 rounded-xl bg-[#8C6D3F] text-white font-medium text-sm flex items-center gap-2 hover:bg-[#785C32] transition-colors shadow-xs"
              >
                <Square className="w-4 h-4" />
                <span>Pausar</span>
              </button>
            ) : (
              <button
                id="btn-start-meditation-timer"
                onClick={() => handleStartTimer(timerRemaining)}
                className="px-5 py-2.5 rounded-xl bg-[#8C6D3F] text-white font-medium text-sm flex items-center gap-2 hover:bg-[#785C32] transition-colors shadow-xs"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{timerRemaining === 0 ? 'Iniciar Novamente' : 'Iniciar Meditação'}</span>
              </button>
            )}

            <button
              id="btn-reset-meditation-timer"
              onClick={handleResetTimer}
              className="p-2.5 rounded-xl bg-white/70 hover:bg-white text-[#574B3C] transition-colors"
              title="Reiniciar tempo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Ambient Soundscapes Synthesizer Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif-devotional text-xl font-bold text-[#2B2319]">
              Sons Ambientes em Tempo Real
            </h3>
            <p className="text-xs text-[#7A7165]">
              Sintetizados pelo Web Audio para criar uma atmosfera de paz sem depender de internet
            </p>
          </div>

          {/* Volume Slider & Stop Button */}
          <div className="flex items-center gap-3 bg-[#F4EFE6] px-3.5 py-2 rounded-xl border border-[#E2D8C9]">
            <Volume2 className="w-4 h-4 text-[#7A6E5D]" />
            <input
              id="slider-ambient-volume"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambientVolume}
              onChange={(e) => onChangeAmbientVolume(parseFloat(e.target.value))}
              className="w-24 accent-[#8C6D3F] cursor-pointer"
              title="Volume do Som Ambiente"
            />
            {isAmbientPlaying && (
              <button
                id="btn-stop-all-ambient"
                onClick={onStopAmbient}
                className="ml-2 px-2 py-1 rounded-lg bg-[#E2D8C9] hover:bg-[#D4C6B3] text-xs font-semibold text-[#4A4033] transition-colors"
              >
                Desligar Som
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {AMBIENT_SOUNDS.map((sound) => {
            const isThisPlaying = isAmbientPlaying && currentAmbient === sound.type;
            const getIcon = () => {
              if (sound.type === 'rain') return <CloudRain className="w-5 h-5" />;
              if (sound.type === 'stream') return <Waves className="w-5 h-5" />;
              if (sound.type === 'wind') return <Wind className="w-5 h-5" />;
              if (sound.type === 'harp') return <Sparkles className="w-5 h-5" />;
              return <Music className="w-5 h-5" />;
            };

            return (
              <div
                key={sound.id}
                id={`card-ambient-${sound.id}`}
                onClick={() => {
                  if (isThisPlaying) {
                    onStopAmbient();
                  } else {
                    onPlayAmbient(sound.type);
                  }
                }}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  isThisPlaying
                    ? 'bg-[#F2ECE0] border-[#8C6D3F] ring-2 ring-[#8C6D3F]/30 shadow-xs'
                    : 'bg-[#FFFDFB] border-[#E8E1D5] hover:border-[#D9CCB8] hover:bg-[#FAF6ED]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isThisPlaying
                        ? 'bg-[#8C6D3F] text-white'
                        : 'bg-[#EFE9DF] text-[#706453]'
                    }`}
                  >
                    {getIcon()}
                  </div>

                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isThisPlaying
                        ? 'bg-[#2D6A3E] text-white'
                        : 'bg-[#EFE9DF] text-[#706453]'
                    }`}
                  >
                    {isThisPlaying ? 'Tocando Agora' : 'Ouvir'}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif-devotional font-bold text-base text-[#2E281F]">
                    {sound.name}
                  </h4>
                  <p className="text-xs text-[#7A7165] leading-relaxed mt-1">
                    {sound.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spoken Scripture Audio Library */}
      <div className="space-y-4 pt-4 border-t border-[#E8E1D5]">
        <div>
          <h3 className="font-serif-devotional text-xl font-bold text-[#2B2319]">
            Passagens Bíblicas Narradas
          </h3>
          <p className="text-xs text-[#7A7165]">
            Ouça as passagens mais amadas narradas com voz clara em português
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {SPOKEN_PASSAGES.map((track) => {
            const isTrackPlaying = ttsState.isSpeaking && activeSpokenId === track.id;

            return (
              <div
                key={track.id}
                id={`spoken-track-${track.id}`}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  isTrackPlaying
                    ? 'bg-[#F5ECE0] border-[#8C6D3F] ring-2 ring-[#8C6D3F]/20'
                    : 'bg-[#FFFDFB] border-[#E8E1D5] hover:border-[#D8C9B4]'
                }`}
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#8C6D3F]" />
                    <span className="text-[11px] font-semibold text-[#8C6D3F]">
                      {track.reference}
                    </span>
                    <span className="text-[11px] text-[#9E9587]">
                      • {track.duration}
                    </span>
                  </div>
                  <h4 className="font-serif-devotional font-bold text-base text-[#2E281F] truncate">
                    {track.title}
                  </h4>
                  <p className="text-xs text-[#7A7165] line-clamp-2 italic">
                    "{track.text}"
                  </p>
                </div>

                <button
                  id={`btn-play-spoken-${track.id}`}
                  onClick={() => handlePlaySpoken(track)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                    isTrackPlaying
                      ? 'bg-[#C2410C] text-white shadow-xs'
                      : 'bg-[#8C6D3F] hover:bg-[#785C32] text-white shadow-xs'
                  }`}
                  title={isTrackPlaying ? 'Pausar áudio' : 'Ouvir narração'}
                >
                  {isTrackPlaying ? (
                    <Square className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
