import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { applyVisionToElement } from './css';
import type { VisionRegistry } from './registry';
import type { ThemeMode, VisionContextValue } from './types';

const VisionContext = createContext<VisionContextValue | undefined>(undefined);

export interface VisionProviderProps {
  registry: VisionRegistry;
  children: React.ReactNode;
  visionId?: string;
  defaultVisionId?: string;
  onVisionChange?: (visionId: string) => void;
  targetElement?: HTMLElement | null;
  mode?: ThemeMode;
  defaultMode?: ThemeMode;
  onModeChange?: (mode: ThemeMode) => void;
}

export function VisionProvider({
  registry,
  children,
  visionId,
  defaultVisionId,
  onVisionChange,
  targetElement,
  mode,
  defaultMode,
  onModeChange,
}: VisionProviderProps): JSX.Element {
  const availableVisions = registry.list();
  const firstVisionId = availableVisions[0]?.id ?? '';
  const [internalVisionId, setInternalVisionId] = useState(defaultVisionId ?? firstVisionId);
  const activeVisionId = visionId ?? internalVisionId;
  const activeVision = registry.getOrFallback(activeVisionId);

  const resolveInitialMode = (): ThemeMode => {
    if (mode !== undefined) return mode;
    if (defaultMode !== undefined) return defaultMode;
    if (activeVision) {
      if (typeof window === 'undefined') return activeVision.defaultMode;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  const [internalMode, setInternalMode] = useState<ThemeMode>(resolveInitialMode);
  const activeMode: ThemeMode = mode ?? internalMode;

  useEffect(() => {
    if (!activeVision || typeof document === 'undefined') return;
    const root = targetElement ?? document.documentElement;
    applyVisionToElement(root, activeVision, activeMode);
  }, [activeVision, activeMode, targetElement]);

  const setVision = useCallback(
    (nextVisionId: string): void => {
      if (!registry.has(nextVisionId)) {
        return;
      }

      if (visionId === undefined) {
        setInternalVisionId(nextVisionId);
      }

      onVisionChange?.(nextVisionId);
    },
    [onVisionChange, registry, visionId]
  );

  const setMode = useCallback(
    (nextMode: ThemeMode): void => {
      if (mode === undefined) {
        setInternalMode(nextMode);
      }
      onModeChange?.(nextMode);
    },
    [mode, onModeChange]
  );

  const toggleMode = useCallback((): void => {
    setMode(activeMode === 'light' ? 'dark' : 'light');
  }, [activeMode, setMode]);

  const contextValue = useMemo<VisionContextValue | undefined>(() => {
    if (!activeVision) {
      return undefined;
    }

    return {
      availableVisions,
      activeVision,
      activeVisionId: activeVision.id,
      setVision,
      mode: activeMode,
      setMode,
      toggleMode,
    };
  }, [activeVision, availableVisions, setVision, activeMode, setMode, toggleMode]);

  if (!contextValue) {
    return <>{children}</>;
  }

  return <VisionContext.Provider value={contextValue}>{children}</VisionContext.Provider>;
}

export function useVision(): VisionContextValue {
  const context = useContext(VisionContext);
  if (!context) {
    throw new Error('useVision must be used inside VisionProvider');
  }

  return context;
}

export function useOptionalVision(): VisionContextValue | undefined {
  return useContext(VisionContext);
}
