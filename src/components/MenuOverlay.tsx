import React from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Compass,
  SlidersHorizontal,
  User,
  Volume2,
  VolumeX,
  Waves,
} from 'lucide-react';
import {
  BeachSpot,
  GameSettings,
  MenuScreen,
  SurfboardSpec,
  SurferProfile,
} from '../types/game';
import { PWAInstallButton } from './PWAInstallButton';

interface MenuOverlayProps {
  screen: MenuScreen;
  onNavigate: (screen: MenuScreen) => void;
  beaches: BeachSpot[];
  selectedBeach: BeachSpot;
  onSelectBeach: (beach: BeachSpot) => void;
  surfers: SurferProfile[];
  selectedSurfer: SurferProfile;
  onSelectSurfer: (surfer: SurferProfile) => void;
  boards: SurfboardSpec[];
  selectedBoard: SurfboardSpec;
  onSelectBoard: (board: SurfboardSpec) => void;
  settings: GameSettings;
  onUpdateSettings: (patch: Partial<GameSettings>) => void;
}

function SurfboardIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.5c3.2 3.4 4.5 7.8 4.2 12.6-.2 2.6-1.4 4.8-4.2 6.4-2.8-1.6-4-3.8-4.2-6.4C7.5 10.3 8.8 5.9 12 2.5Z" />
      <path d="M12 3v18" />
    </svg>
  );
}

export const MenuOverlay: React.FC<MenuOverlayProps> = ({
  screen,
  onNavigate,
  beaches,
  selectedBeach,
  onSelectBeach,
  surfers,
  selectedSurfer,
  onSelectSurfer,
  boards,
  selectedBoard,
  onSelectBoard,
  settings,
  onUpdateSettings,
}) => {
  const isHome = screen === 'home';

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-7 md:p-10 lg:p-14">
      {/* Top Bar: Subtle Audio Control & Contextual Back Navigation */}
      <div className="flex items-center justify-between gap-3">
        <div className="pointer-events-auto">
          {!isHome ? (
            <button
              type="button"
              onClick={() => onNavigate(screen === 'lineup' ? 'beaches' : 'home')}
              className="group inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#071726]/65 px-3.5 py-1.5 text-xs font-medium tracking-wide text-white/90 transition-all duration-200 hover:border-white/30 hover:bg-[#071726]/85 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2596A6] sm:px-4 sm:py-2 sm:text-sm"
            >
              <ArrowLeft className="h-4 w-4 text-[#E7DCC8] transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span>{screen === 'lineup' ? 'Beaches' : 'Main Menu'}</span>
            </button>
          ) : (
            <div className="h-8 sm:h-9" />
          )}
        </div>

        {/* Discreet Sound Toggle + Active Rider Summary on Subscreens */}
        <div className="pointer-events-auto flex items-center gap-3 sm:gap-4">
          {!isHome && (
            <div className="hidden sm:flex items-center gap-2.5 text-xs tracking-wide text-white/80 drop-shadow-[0_1px_6px_rgba(7,23,38,0.65)]">
              <span>{selectedBeach.name}</span>
              <span aria-hidden="true" className="text-white/40">
                ·
              </span>
              <span>{selectedSurfer.name}</span>
              <span aria-hidden="true" className="text-white/40">
                ·
              </span>
              <span>{selectedBoard.name}</span>
            </div>
          )}

          <PWAInstallButton variant="topbar" />

          <button
            type="button"
            onClick={() => onUpdateSettings({ audioEnabled: !settings.audioEnabled })}
            aria-label={settings.audioEnabled ? 'Mute ocean audio' : 'Enable ocean audio'}
            title={settings.audioEnabled ? 'Ocean Audio: On' : 'Ocean Audio: Off'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-[#071726]/55 text-white/85 transition-all duration-200 hover:border-white/30 hover:bg-[#071726]/80 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2596A6] sm:h-10 sm:w-10"
          >
            {settings.audioEnabled ? (
              <Volume2 className="h-4 w-4 text-[#2596A6]" />
            ) : (
              <VolumeX className="h-4 w-4 text-white/70" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area: Leaves Central Ocean Unobstructed */}
      <div className="flex min-h-0 flex-1 flex-col justify-end">
        {/* HOME SCREEN: Left-Aligned Minimalist Editorial Lockup (fits short landscape screens too) */}
        {screen === 'home' && (
          <div className="pointer-events-auto mb-1 max-w-md transition-opacity duration-300 sm:mb-2">
            {/* Game Logo */}
            <h1
              className="font-display text-4xl font-extrabold tracking-[0.2em] text-white sm:text-6xl lg:text-7xl"
              style={{
                textShadow: '0 4px 28px rgba(7, 23, 38, 0.45)',
              }}
            >
              FLOW
            </h1>

            {/* Single Prominent Primary Action */}
            <div className="mt-4 sm:mt-7">
              <button
                type="button"
                onClick={() => onNavigate('beaches')}
                className="group inline-flex min-w-[196px] items-center justify-between gap-4 rounded-lg border border-white/30 bg-[#071726]/68 px-5 py-2.5 text-xs font-semibold tracking-[0.18em] text-white transition-all duration-200 hover:border-[#2596A6]/90 hover:bg-[#0B3C5D]/88 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2596A6] active:scale-[0.99] sm:min-w-[228px] sm:gap-5 sm:px-7 sm:py-3.5 sm:text-sm"
              >
                <span>FREE SURF</span>
                <ChevronRight className="h-4 w-4 text-[#E7DCC8] transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Secondary Discreet Menu */}
            <nav
              aria-label="Secondary Menu"
              className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 sm:mt-6 sm:gap-x-6 sm:gap-y-2.5"
            >
              <button
                type="button"
                onClick={() => onNavigate('beaches')}
                className="group inline-flex items-center gap-1.5 py-1 text-xs font-medium text-white/82 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2596A6] sm:gap-2 sm:text-sm"
              >
                <Waves className="h-3.5 w-3.5 text-white/65 transition-colors group-hover:text-[#2596A6]" />
                <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-white/50">
                  Beaches
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('surfers')}
                className="group inline-flex items-center gap-1.5 py-1 text-xs font-medium text-white/82 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2596A6] sm:gap-2 sm:text-sm"
              >
                <User className="h-3.5 w-3.5 text-white/65 transition-colors group-hover:text-[#2596A6]" />
                <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-white/50">
                  Surfers
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('boards')}
                className="group inline-flex items-center gap-1.5 py-1 text-xs font-medium text-white/82 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2596A6] sm:gap-2 sm:text-sm"
              >
                <SurfboardIcon className="h-3.5 w-3.5 text-white/65 transition-colors group-hover:text-[#2596A6]" />
                <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-white/50">
                  Boards
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('settings')}
                className="group inline-flex items-center gap-1.5 py-1 text-xs font-medium text-white/82 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2596A6] sm:gap-2 sm:text-sm"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-white/65 transition-colors group-hover:text-[#2596A6]" />
                <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-white/50">
                  Settings
                </span>
              </button>
            </nav>
          </div>
        )}

        {/* BEACH SELECTION EXPERIENCE */}
        {screen === 'beaches' && (
          <div className="pointer-events-auto mx-auto w-full max-w-4xl">
            <div className="max-h-[calc(100vh-5rem)] overflow-y-auto rounded-xl border border-white/15 bg-[#071726]/74 p-4 sm:p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-[#2596A6]">
                    <Compass className="h-3.5 w-3.5" />
                    <span>{selectedBeach.region}</span>
                    <span aria-hidden="true" className="text-white/30">
                      ·
                    </span>
                    <span className="text-[#E7DCC8]/85">{selectedBeach.breakType}</span>
                  </div>

                  <h2 className="font-display mt-1 text-xl font-bold tracking-tight text-white sm:mt-1.5 sm:text-3xl">
                    {selectedBeach.name}
                  </h2>

                  <p className="mt-1 max-w-xl text-xs leading-relaxed text-white/75 sm:mt-1.5 sm:text-sm">
                    {selectedBeach.description}
                  </p>

                  <div className="font-mono-tabular mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#E7DCC8]/90 sm:mt-3 sm:gap-x-4">
                    <span>Swell {selectedBeach.swellHeight}</span>
                    <span aria-hidden="true" className="text-white/25">
                      /
                    </span>
                    <span>Period {selectedBeach.swellPeriod}</span>
                    <span aria-hidden="true" className="text-white/25">
                      /
                    </span>
                    <span>{selectedBeach.wind}</span>
                    <span aria-hidden="true" className="text-white/25">
                      /
                    </span>
                    <span>Water {selectedBeach.waterTemp}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigate('surfing')}
                    className="group inline-flex items-center gap-2.5 rounded-lg border border-[#2596A6]/60 bg-[#0B3C5D]/85 px-5 py-2.5 text-xs font-semibold tracking-[0.14em] text-white transition-all duration-200 hover:border-[#2596A6] hover:bg-[#2596A6]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2596A6] sm:gap-3 sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <span>PADDLE OUT</span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>

              {/* Restrained Horizontal Break Selector */}
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 sm:mt-5 sm:grid-cols-4 sm:pt-4">
                {beaches.map((beach) => {
                  const active = beach.id === selectedBeach.id;
                  return (
                    <button
                      key={beach.id}
                      type="button"
                      onClick={() => onSelectBeach(beach)}
                      className={`rounded-lg px-3.5 py-2.5 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2596A6] ${
                        active
                          ? 'border border-white/25 bg-white/12 text-white'
                          : 'border border-transparent bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      <div className="truncate text-sm font-semibold">{beach.name}</div>
                      <div className="font-mono-tabular mt-0.5 truncate text-xs text-white/60">
                        {beach.swellHeight} · {beach.swellPeriod}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* IN-WATER LINEUP PREVIEW */}
        {screen === 'lineup' && (
          <div className="pointer-events-auto mx-auto flex w-full max-w-3xl items-center justify-between rounded-xl border border-white/15 bg-[#071726]/68 px-5 py-3.5">
            <div>
              <div className="font-display text-base font-semibold text-white">
                {selectedBeach.name} — In the Lineup
              </div>
              <div className="font-mono-tabular mt-0.5 text-xs text-[#E7DCC8]/85">
                {selectedBeach.swellHeight} · {selectedBeach.swellPeriod} · {selectedBoard.name}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('beaches')}
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium tracking-wider text-white transition-colors hover:bg-white/20"
            >
              Change Break
            </button>
          </div>
        )}

        {/* SURFERS SELECTION */}
        {screen === 'surfers' && (
          <div className="pointer-events-auto mx-auto max-h-[calc(100vh-5rem)] w-full max-w-3xl overflow-y-auto rounded-xl border border-white/15 bg-[#071726]/74 p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div>
                <div className="text-xs font-medium tracking-[0.14em] text-[#2596A6]">
                  Surfer Profile
                </div>
                <h2 className="font-display mt-1 text-xl font-bold text-white sm:text-2xl">
                  {selectedSurfer.name}
                </h2>
                <p className="mt-0.5 text-xs text-white/75 sm:mt-1 sm:text-sm">
                  {selectedSurfer.origin} · {selectedSurfer.stance} Stance · {selectedSurfer.style}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('beaches')}
                className="shrink-0 rounded-lg border border-white/25 bg-[#0B3C5D]/80 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-white transition-colors hover:bg-[#2596A6]/85 sm:px-5 sm:py-2.5"
              >
                SELECT BEACH
              </button>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 border-t border-white/10 pt-3 sm:mt-5 sm:grid-cols-3 sm:gap-2.5 sm:pt-4">
              {surfers.map((surfer) => {
                const active = surfer.id === selectedSurfer.id;
                return (
                  <button
                    key={surfer.id}
                    type="button"
                    onClick={() => onSelectSurfer(surfer)}
                    className={`rounded-lg px-3.5 py-2.5 text-left transition-all duration-200 sm:px-4 sm:py-3 ${
                      active
                        ? 'border border-white/25 bg-white/12 text-white'
                        : 'border border-transparent bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold">{surfer.name}</span>
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-white/30"
                        style={{ backgroundColor: surfer.accentColor }}
                      />
                    </div>
                    <div className="mt-0.5 text-xs text-white/60 sm:mt-1">
                      {surfer.origin} · {surfer.stance}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* BOARDS SELECTION (Live 3D Shoreline Showcase) */}
        {screen === 'boards' && (
          <div className="pointer-events-auto mx-auto max-h-[calc(100vh-5rem)] w-full max-w-4xl overflow-y-auto rounded-xl border border-white/15 bg-[#071726]/74 p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div>
                <div className="text-xs font-medium tracking-[0.14em] text-[#2596A6]">
                  {selectedBoard.category}
                </div>
                <h2 className="font-display mt-1 text-2xl font-bold text-white">
                  {selectedBoard.name}
                </h2>
                <div className="font-mono-tabular mt-1.5 flex flex-wrap items-center gap-x-3 text-xs text-[#E7DCC8]/90">
                  <span>{selectedBoard.dimensions}</span>
                  <span aria-hidden="true" className="text-white/25">
                    /
                  </span>
                  <span>{selectedBoard.volume}</span>
                  <span aria-hidden="true" className="text-white/25">
                    /
                  </span>
                  <span>{selectedBoard.finSetup} Fins</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('beaches')}
                className="shrink-0 rounded-lg border border-white/25 bg-[#0B3C5D]/80 px-5 py-2.5 text-xs font-semibold tracking-[0.14em] text-white transition-colors hover:bg-[#2596A6]/85"
              >
                TAKE TO WATER
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-4 sm:grid-cols-4">
              {boards.map((board) => {
                const active = board.id === selectedBoard.id;
                return (
                  <button
                    key={board.id}
                    type="button"
                    onClick={() => onSelectBoard(board)}
                    className={`rounded-lg px-3.5 py-2.5 text-left transition-all duration-200 ${
                      active
                        ? 'border border-white/25 bg-white/12 text-white'
                        : 'border border-transparent bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    <div className="text-sm font-semibold">{board.name}</div>
                    <div className="mt-0.5 text-xs text-white/60">
                      {board.category} · {board.volume}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {screen === 'settings' && (
          <div className="pointer-events-auto max-h-[calc(100vh-5rem)] max-w-md overflow-y-auto rounded-xl border border-white/15 bg-[#071726]/78 p-4 sm:p-6">
            <h2 className="font-display text-lg font-bold text-white sm:text-xl">Settings</h2>
            <p className="mt-0.5 text-xs text-white/65 sm:mt-1">
              Environment rendering & camera preferences
            </p>

            <div className="mt-3 space-y-3 border-t border-white/10 pt-3 sm:mt-5 sm:space-y-4 sm:pt-4">
              {/* Ocean Mesh Detail */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-white/90">Ocean Wave Detail</span>
                <div className="flex rounded-lg border border-white/15 bg-white/[0.04] p-0.5">
                  {(['Balanced', 'High'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => onUpdateSettings({ oceanDetail: tier })}
                      className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                        settings.oceanDetail === tier
                          ? 'bg-[#2596A6] text-white'
                          : 'text-white/65 hover:text-white'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Motion */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-white/90">Cinematic Camera Drift</span>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ cameraMotion: !settings.cameraMotion })}
                  className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    settings.cameraMotion
                      ? 'border-[#2596A6]/70 bg-[#2596A6]/25 text-white'
                      : 'border-white/15 bg-white/[0.04] text-white/65'
                  }`}
                >
                  {settings.cameraMotion ? 'Enabled' : 'Static'}
                </button>
              </div>

              {/* Camera Impact & Speed Blur */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-white/90">Water Impact &amp; Motion Blur</span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ cameraBlurEnabled: !settings.cameraBlurEnabled })
                  }
                  className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    settings.cameraBlurEnabled
                      ? 'border-[#2596A6]/70 bg-[#2596A6]/25 text-white'
                      : 'border-white/15 bg-white/[0.04] text-white/65'
                  }`}
                >
                  {settings.cameraBlurEnabled ? 'Enabled' : 'Off'}
                </button>
              </div>

              {/* Camera Shake */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-white/90">Impact Camera Shake</span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ cameraShakeEnabled: !settings.cameraShakeEnabled })
                  }
                  className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    settings.cameraShakeEnabled
                      ? 'border-[#2596A6]/70 bg-[#2596A6]/25 text-white'
                      : 'border-white/15 bg-white/[0.04] text-white/65'
                  }`}
                >
                  {settings.cameraShakeEnabled ? 'Enabled' : 'Off'}
                </button>
              </div>

              {/* Water Impact FX Intensity */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/75">Impact FX Intensity</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={settings.cameraImpactIntensity}
                  onChange={(e) =>
                    onUpdateSettings({ cameraImpactIntensity: parseFloat(e.target.value) })
                  }
                  aria-label="Water impact visual intensity"
                  className="h-1.5 flex-1 cursor-pointer accent-[#2596A6]"
                />
              </div>

              {/* Ambient Surf Audio */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-white/90">Ambient Ocean Audio</span>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ audioEnabled: !settings.audioEnabled })}
                    className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      settings.audioEnabled
                        ? 'border-[#2596A6]/70 bg-[#2596A6]/25 text-white'
                        : 'border-white/15 bg-white/[0.04] text-white/65'
                    }`}
                  >
                    {settings.audioEnabled ? 'On' : 'Off'}
                  </button>
                </div>
                {settings.audioEnabled && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/60">Volume</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={settings.audioVolume}
                      onChange={(e) =>
                        onUpdateSettings({ audioVolume: parseFloat(e.target.value) })
                      }
                      aria-label="Ocean audio volume"
                      className="h-1.5 flex-1 cursor-pointer accent-[#2596A6]"
                    />
                  </div>
                )}
              </div>

              {/* 16:9 Cinema Framing */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-white/90">16:9 Cinema Frame</span>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ aspectLock16x9: !settings.aspectLock16x9 })}
                  className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    settings.aspectLock16x9
                      ? 'border-[#2596A6]/70 bg-[#2596A6]/25 text-white'
                      : 'border-white/15 bg-white/[0.04] text-white/65'
                  }`}
                >
                  {settings.aspectLock16x9 ? '16:9 Locked' : 'Full Viewport'}
                </button>
              </div>

              {/* Beach Personalization */}
              <div className="space-y-3 border-t border-white/10 pt-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-white/90">Beach Atmosphere</span>
                  <div className="flex rounded-lg border border-white/15 bg-white/[0.04] p-0.5">
                    {(['Lively', 'Chill'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => onUpdateSettings({ beachAtmosphere: mode })}
                        className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                          settings.beachAtmosphere === mode
                            ? 'bg-[#2596A6] text-white'
                            : 'text-white/65 hover:text-white'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-white/90">Beach Style</span>
                  <div className="flex rounded-lg border border-white/15 bg-white/[0.04] p-0.5">
                    {(['Tropical', 'Sunset', 'Classic'] as const).map((theme) => (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => onUpdateSettings({ beachTheme: theme })}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                          settings.beachTheme === theme
                            ? 'bg-[#2596A6] text-white'
                            : 'text-white/65 hover:text-white'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-white/90">Reef Corals &amp; Marine Life</span>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSettings({ marineLifeEnabled: !settings.marineLifeEnabled })
                    }
                    className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      settings.marineLifeEnabled
                        ? 'border-[#2596A6]/70 bg-[#2596A6]/25 text-white'
                        : 'border-white/15 bg-white/[0.04] text-white/65'
                    }`}
                  >
                    {settings.marineLifeEnabled ? 'Active' : 'Minimal'}
                  </button>
                </div>
              </div>

              {/* Install App (Chrome / PWA) */}
              <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                <span className="text-sm text-white/90">Instalar no Dispositivo</span>
                <PWAInstallButton variant="settings" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
