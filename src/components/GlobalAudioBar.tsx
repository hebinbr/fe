import React from 'react';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Sliders,
  Music,
  ChevronDown
} from 'lucide-react';
import { TTSState, devotionalTTS } from '../utils/audioEngine';

interface GlobalAudioBarProps {
  ttsState: TTSState;
  isAmbientPlaying: boolean;
  currentAmbient: string | null;
  onStopAmbient: () => void;
  ambientVolume: number;
  onChangeAmbientVolume: (vol: number) => void;
}

export const GlobalAudioBar: React.FC<GlobalAudioBarProps> = ({
  ttsState,
  isAmbientPlaying,
  currentAmbient,
  onStopAmbient,
  ambientVolume,
  onChangeAmbientVolume,
}) => {
  const isAnythingPlaying = ttsState.isSpeaking || isAmbientPlaying;

  if (!isAnythingPlaying) return null;

  const ambientNames: Record<string, string> = {
    pad: 'Acordes de Adoração',
    rain: 'Chuva Suave de Paz',
    stream: 'Águas de Descanso',
    harp: 'Harpa Celestial & Sinos',
    wind: 'Brisa Suave do Espírito',
  };

  const currentAmbientLabel = currentAmbient ? ambientNames[currentAmbient] || currentAmbient : '';

  const cycleSpeechRate = () => {
    const nextRate = ttsState.rate === 1.0 ? 1.2 : ttsState.rate === 1.2 ? 0.8 : 1.0;
    devotionalTTS.setRate(nextRate);
  };

  return (
    <div
      id="global-audio-player-bar"
      className="fixed bottom-3 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#2C251D]/95 text-[#FBF8F3] backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-[#453B2F] flex items-center justify-between gap-3 animate-slide-up"
    >
      {/* Track info */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="w-8 h-8 rounded-lg bg-[#8C6D3F] flex items-center justify-center shrink-0">
          <Music className="w-4 h-4 text-white animate-pulse" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4C3AC] truncate">
              {ttsState.isSpeaking ? 'Narração Ativa' : 'Som Ambiente'}
            </span>
            {isAmbientPlaying && ttsState.isSpeaking && (
              <span className="text-[9px] bg-[#453B2F] text-[#DDD0C0] px-1 rounded">
                + Fundo
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-white truncate">
            {ttsState.isSpeaking ? ttsState.currentText : currentAmbientLabel}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Speed toggle for TTS */}
        {ttsState.isSpeaking && (
          <button
            id="btn-global-speed-toggle"
            onClick={cycleSpeechRate}
            className="px-2 py-1 rounded-md text-[11px] font-semibold bg-[#453B2F] hover:bg-[#574B3C] text-[#EFE7DC] transition-colors"
            title="Velocidade da voz"
          >
            {ttsState.rate}x
          </button>
        )}

        {/* Play/Pause for TTS */}
        {ttsState.isSpeaking && (
          <button
            id="btn-global-play-pause-tts"
            onClick={() => devotionalTTS.togglePlayPause()}
            className="p-2 rounded-xl bg-white text-[#2C251D] hover:bg-[#F3EFE9] transition-colors shadow-xs"
            title={ttsState.isPaused ? 'Continuar' : 'Pausar'}
          >
            {ttsState.isPaused ? (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            ) : (
              <Pause className="w-3.5 h-3.5 fill-current" />
            )}
          </button>
        )}

        {/* Ambient volume slider */}
        {isAmbientPlaying && (
          <div className="hidden sm:flex items-center gap-1.5 bg-[#3B3227] px-2 py-1 rounded-lg">
            <Volume2 className="w-3 h-3 text-[#BFAEA0]" />
            <input
              id="global-ambient-volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambientVolume}
              onChange={(e) => onChangeAmbientVolume(parseFloat(e.target.value))}
              className="w-14 accent-[#8C6D3F] cursor-pointer"
            />
          </div>
        )}

        {/* Stop button */}
        <button
          id="btn-global-stop-all"
          onClick={() => {
            if (ttsState.isSpeaking) devotionalTTS.stop();
            if (isAmbientPlaying) onStopAmbient();
          }}
          className="p-2 rounded-xl bg-[#453B2F] hover:bg-[#5C4F3E] text-[#DDD0C0] transition-colors"
          title="Parar áudios"
        >
          <Square className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
