import { useCallback, useEffect, useRef, useState } from 'react';
import { oceanAudio } from './audio/oceanAudio';
import { GameplayHUD } from './components/GameplayHUD';
import { LandscapePromptModal } from './components/LandscapePromptModal';
import { MenuOverlay } from './components/MenuOverlay';
import { OfflineIndicator } from './components/PWAInstallButton';
import {
  BEACH_SPOTS,
  DEFAULT_SETTINGS,
  SURFBOARDS,
  SURFER_PROFILES,
} from './data/surfData';
import { SurfSceneManager } from './three/SurfSceneManager';
import {
  BeachSpot,
  CameraMode,
  GameSettings,
  ManeuverType,
  MenuScreen,
  ReplayCameraAngle,
  SurfboardSpec,
  SurferProfile,
  SurfHUDState,
} from './types/game';

const INITIAL_HUD: SurfHUDState = {
  phase: 'beachWalk',
  score: 0,
  combo: 1,
  comboTimer: 0,
  speedKmh: 0,
  balance: 0,
  stability: 1,
  waveSection: 'flat',
  inBarrel: false,
  barrelTime: 0,
  timeScale: 1,
  lastCallout: '',
  lastQuality: null,
  calloutId: 0,
  waveNumber: 1,
  availability: {
    bottomTurn: false,
    cutback: false,
    floater: false,
    air: false,
  },
  isPaused: false,
  cameraMode: 'thirdPerson',
  cameraModified: false,
  isUnderwater: false,
  replay: {
    active: false,
    playing: true,
    available: false,
    currentTime: 0,
    duration: 0,
    playbackSpeed: 1,
    cameraAngle: 'follow',
  },
};

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const sceneManagerRef = useRef<SurfSceneManager | null>(null);

  const [screen, setScreen] = useState<MenuScreen>('home');
  const [selectedBeach, setSelectedBeach] = useState<BeachSpot>(BEACH_SPOTS[0]);
  const [selectedSurfer, setSelectedSurfer] = useState<SurferProfile>(SURFER_PROFILES[0]);
  const [selectedBoard, setSelectedBoard] = useState<SurfboardSpec>(SURFBOARDS[0]);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [cameraMode, setCameraMode] = useState<CameraMode>('thirdPerson');
  const [paused, setPaused] = useState(false);
  const [hud, setHud] = useState<SurfHUDState>(INITIAL_HUD);
  const [contextLost, setContextLost] = useState(false);

  const heldKeysRef = useRef<Set<string>>(new Set());
  const touchJoyRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchBalanceRef = useRef<number>(0);

  const syncCombinedInput = useCallback(() => {
    const keys = heldKeysRef.current;
    let kx = 0;
    let ky = 0;
    let kBal = 0;

    if (keys.has('KeyA') || keys.has('ArrowLeft')) kx -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) kx += 1;
    if (keys.has('KeyW') || keys.has('ArrowUp')) ky += 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) ky -= 1;
    if (keys.has('KeyQ')) kBal -= 1;
    if (keys.has('KeyE')) kBal += 1;

    const moveX = Math.max(-1, Math.min(1, kx + touchJoyRef.current.x));
    const moveY = Math.max(-1, Math.min(1, ky + touchJoyRef.current.y));
    const balanceAdjust = Math.max(-1, Math.min(1, kBal + touchBalanceRef.current));

    sceneManagerRef.current?.setSurfInput({ moveX, moveY, balanceAdjust });
  }, []);

  // Mount WebGL scene once in isolated container
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const manager = new SurfSceneManager(
      mount,
      BEACH_SPOTS[0].environment,
      SURFBOARDS[0],
      SURFER_PROFILES[0],
      DEFAULT_SETTINGS.oceanDetail === 'High',
      (nextHud) => setHud(nextHud),
      (lost) => setContextLost(lost)
    );
    sceneManagerRef.current = manager;

    return () => {
      manager.dispose();
      sceneManagerRef.current = null;
      oceanAudio.dispose();
    };
  }, []);

  // Push React UI selections to the running 3D simulation without remounting
  useEffect(() => {
    sceneManagerRef.current?.updateState({
      screen,
      beachEnv: selectedBeach.environment,
      board: selectedBoard,
      surfer: selectedSurfer,
      cameraMotion: settings.cameraMotion,
      cameraBlurEnabled: settings.cameraBlurEnabled,
      cameraShakeEnabled: settings.cameraShakeEnabled,
      cameraImpactIntensity: settings.cameraImpactIntensity,
      cameraMode,
      oceanDetailHigh: settings.oceanDetail === 'High',
      paused,
      beachAtmosphere: settings.beachAtmosphere,
      beachTheme: settings.beachTheme,
      marineLifeEnabled: settings.marineLifeEnabled,
    });
  }, [
    screen,
    selectedBeach,
    selectedBoard,
    selectedSurfer,
    settings.cameraMotion,
    settings.cameraBlurEnabled,
    settings.cameraShakeEnabled,
    settings.cameraImpactIntensity,
    cameraMode,
    settings.oceanDetail,
    paused,
    settings.beachAtmosphere,
    settings.beachTheme,
    settings.marineLifeEnabled,
  ]);

  // Handle resize when 16:9 lock toggles
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      sceneManagerRef.current?.handleResize();
    });
    return () => cancelAnimationFrame(id);
  }, [settings.aspectLock16x9]);

  // Global keyboard & blur handlers for menus and responsive surfing/replay controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (screen === 'surfing') {
        if (hud.replay.active) {
          if (e.key === 'Escape' || e.code === 'KeyR') {
            e.preventDefault();
            oceanAudio.playSoftClick(380);
            sceneManagerRef.current?.exitReplay();
          } else if (e.code === 'Space' && !e.repeat) {
            e.preventDefault();
            oceanAudio.playSoftClick(460);
            sceneManagerRef.current?.toggleReplayPlay();
          } else if (e.code === 'KeyC' && !e.repeat) {
            oceanAudio.playSoftClick(480);
            sceneManagerRef.current?.cycleReplayAngle();
          } else if (e.code === 'KeyV' && !e.repeat) {
            oceanAudio.playSoftClick(440);
            sceneManagerRef.current?.resetCameraLook();
          }
          return;
        }

        if (e.key === 'Escape') {
          e.preventDefault();
          setPaused((prev) => !prev);
          return;
        }
        if (paused) return;

        if (!e.repeat) {
          if (e.code === 'KeyR' && hud.replay.available) {
            oceanAudio.playSoftClick(500);
            sceneManagerRef.current?.enterReplay();
            return;
          } else if (e.code === 'KeyC') {
            oceanAudio.playSoftClick(480);
            setCameraMode((prev) => (prev === 'thirdPerson' ? 'firstPerson' : 'thirdPerson'));
          } else if (e.code === 'KeyV') {
            oceanAudio.playSoftClick(440);
            sceneManagerRef.current?.resetCameraLook();
          } else if (e.code === 'Digit1' || e.code === 'KeyJ') {
            sceneManagerRef.current?.setSurfInput({ requestedManeuver: 'bottomTurn' });
          } else if (e.code === 'Digit2' || e.code === 'KeyK') {
            sceneManagerRef.current?.setSurfInput({ requestedManeuver: 'cutback' });
          } else if (e.code === 'Digit3' || e.code === 'KeyL') {
            sceneManagerRef.current?.setSurfInput({ requestedManeuver: 'floater' });
          } else if (e.code === 'Space' || e.code === 'Digit4') {
            e.preventDefault();
            sceneManagerRef.current?.setSurfInput({ requestedManeuver: 'air' });
          }
        }

        heldKeysRef.current.add(e.code);
        syncCombinedInput();
        return;
      }

      if (e.key === 'Escape' && screen !== 'home') {
        oceanAudio.playSoftClick(360);
        setScreen(screen === 'lineup' ? 'beaches' : 'home');
      } else if ((e.key === 'Enter' || e.key === ' ') && screen === 'home') {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === 'BUTTON') return;
        e.preventDefault();
        oceanAudio.playSoftClick(460);
        setScreen('beaches');
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (heldKeysRef.current.delete(e.code)) {
        syncCombinedInput();
      }
    };

    const onWindowBlur = () => {
      heldKeysRef.current.clear();
      touchJoyRef.current = { x: 0, y: 0 };
      touchBalanceRef.current = 0;
      sceneManagerRef.current?.setJoystickActive(false);
      sceneManagerRef.current?.setSurfInput({ moveX: 0, moveY: 0, balanceAdjust: 0 });
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onWindowBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onWindowBlur);
    };
  }, [screen, paused, hud.replay.active, hud.replay.available, syncCombinedInput]);

  const handleNavigate = useCallback((next: MenuScreen) => {
    oceanAudio.playSoftClick(next === 'home' ? 360 : 460);
    setPaused(false);
    setScreen(next);
  }, []);

  const handleSelectBeach = useCallback((beach: BeachSpot) => {
    oceanAudio.playSoftClick(420);
    setSelectedBeach(beach);
  }, []);

  const handleSelectSurfer = useCallback((surfer: SurferProfile) => {
    oceanAudio.playSoftClick(420);
    setSelectedSurfer(surfer);
  }, []);

  const handleSelectBoard = useCallback((board: SurfboardSpec) => {
    oceanAudio.playSoftClick(440);
    setSelectedBoard(board);
  }, []);

  const handleUpdateSettings = useCallback((patch: Partial<GameSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      if (patch.audioEnabled !== undefined || patch.audioVolume !== undefined) {
        oceanAudio.setEnabled(next.audioEnabled, next.audioVolume);
        if (patch.audioEnabled) {
          oceanAudio.playSoftClick(480);
        }
      }
      return next;
    });
  }, []);

  const handleJoystickChange = useCallback(
    (x: number, y: number) => {
      touchJoyRef.current = { x, y };
      syncCombinedInput();
    },
    [syncCombinedInput]
  );

  const handleJoystickActiveChange = useCallback((active: boolean) => {
    sceneManagerRef.current?.setJoystickActive(active);
  }, []);

  const handleBalanceChange = useCallback(
    (val: number) => {
      touchBalanceRef.current = val;
      syncCombinedInput();
    },
    [syncCombinedInput]
  );

  const handleTriggerManeuver = useCallback((type: ManeuverType) => {
    oceanAudio.playSoftClick(520);
    sceneManagerRef.current?.setSurfInput({ requestedManeuver: type });
  }, []);

  const handleRestartSurf = useCallback(() => {
    setPaused(false);
    sceneManagerRef.current?.restartSurfSession();
  }, []);

  const handleToggleCamera = useCallback(() => {
    oceanAudio.playSoftClick(480);
    setCameraMode((prev) => (prev === 'thirdPerson' ? 'firstPerson' : 'thirdPerson'));
  }, []);

  const handleResetCamera = useCallback(() => {
    oceanAudio.playSoftClick(440);
    sceneManagerRef.current?.resetCameraLook();
  }, []);

  const handleEnterReplay = useCallback(() => {
    oceanAudio.playSoftClick(500);
    setPaused(false);
    sceneManagerRef.current?.enterReplay();
  }, []);

  const handleExitReplay = useCallback(() => {
    oceanAudio.playSoftClick(380);
    sceneManagerRef.current?.exitReplay();
  }, []);

  const handleToggleReplayPlay = useCallback(() => {
    oceanAudio.playSoftClick(460);
    sceneManagerRef.current?.toggleReplayPlay();
  }, []);

  const handleSeekReplay = useCallback((timeSeconds: number) => {
    sceneManagerRef.current?.seekReplay(timeSeconds);
  }, []);

  const handleRestartReplay = useCallback(() => {
    oceanAudio.playSoftClick(460);
    sceneManagerRef.current?.restartReplay();
  }, []);

  const handleSetReplaySpeed = useCallback((speed: 0.25 | 0.5 | 1) => {
    oceanAudio.playSoftClick(440);
    sceneManagerRef.current?.setReplaySpeed(speed);
  }, []);

  const handleSetReplayAngle = useCallback((angle: ReplayCameraAngle) => {
    oceanAudio.playSoftClick(480);
    sceneManagerRef.current?.setReplayAngle(angle);
  }, []);

  return (
    <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#071726]">
      <div
        className={
          settings.aspectLock16x9
            ? 'relative aspect-video max-h-full w-full max-w-[177.78vh] overflow-hidden shadow-2xl'
            : 'relative h-full w-full overflow-hidden'
        }
      >
        {/* Isolated 3D WebGL Viewport */}
        <div
          ref={canvasMountRef}
          className="absolute inset-0 h-full w-full"
          aria-label="FLOW 3D Tropical Ocean Environment"
        />

        {/* Subtle legibility gradient on lower-left only for home wordmark */}
        {screen === 'home' && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 14% 84%, rgba(7, 23, 38, 0.48) 0%, rgba(7, 23, 38, 0.16) 36%, rgba(7, 23, 38, 0) 64%)',
            }}
          />
        )}

        {/* WebGL Context Lost Fallback */}
        {contextLost && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#071726]/90 text-center">
            <div>
              <p className="font-display text-lg font-semibold text-white">
                Restoring 3D Ocean Surface
              </p>
              <p className="mt-1 text-sm text-white/70">
                Graphics context interrupted. Reinitializing renderer...
              </p>
            </div>
          </div>
        )}

        {/* UI Layer: MenuOverlay vs Active Surfing GameplayHUD */}
        {screen === 'surfing' ? (
          <GameplayHUD
            hud={hud}
            beachName={selectedBeach.name}
            audioEnabled={settings.audioEnabled}
            onToggleAudio={() =>
              handleUpdateSettings({ audioEnabled: !settings.audioEnabled })
            }
            onToggleCamera={handleToggleCamera}
            onResetCamera={handleResetCamera}
            onJoystickChange={handleJoystickChange}
            onJoystickActiveChange={handleJoystickActiveChange}
            onBalanceChange={handleBalanceChange}
            onTriggerManeuver={handleTriggerManeuver}
            onTogglePause={() => setPaused((p) => !p)}
            onRestart={handleRestartSurf}
            onEnterReplay={handleEnterReplay}
            onExitReplay={handleExitReplay}
            onToggleReplayPlay={handleToggleReplayPlay}
            onSeekReplay={handleSeekReplay}
            onRestartReplay={handleRestartReplay}
            onSetReplaySpeed={handleSetReplaySpeed}
            onSetReplayAngle={handleSetReplayAngle}
            onExitToBeaches={() => {
              setPaused(false);
              setScreen('beaches');
            }}
            onExitToHome={() => {
              setPaused(false);
              setScreen('home');
            }}
          />
        ) : (
          <MenuOverlay
            screen={screen}
            onNavigate={handleNavigate}
            beaches={BEACH_SPOTS}
            selectedBeach={selectedBeach}
            onSelectBeach={handleSelectBeach}
            surfers={SURFER_PROFILES}
            selectedSurfer={selectedSurfer}
            onSelectSurfer={handleSelectSurfer}
            boards={SURFBOARDS}
            selectedBoard={selectedBoard}
            onSelectBoard={handleSelectBoard}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {/* Horizontal orientation prompt when entering in portrait */}
        <LandscapePromptModal screen={screen} />

        {/* Discreet offline indicator when network is unavailable */}
        <OfflineIndicator />
      </div>
    </main>
  );
}
