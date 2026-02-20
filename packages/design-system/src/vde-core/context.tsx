import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { applyVisionToElement } from './css';
import type { VisionRegistry } from './registry';
import type { VisionContextValue } from './types';

const VisionContext = createContext<VisionContextValue | undefined>(undefined);

export interface VisionProviderProps {
  registry: VisionRegistry;
  children: React.ReactNode;
  visionId?: string;
  defaultVisionId?: string;
  onVisionChange?: (visionId: string) => void;
  targetElement?: HTMLElement | null;
}

export function VisionProvider({
  registry,
  children,
  visionId,
  defaultVisionId,
  onVisionChange,
  targetElement,
}: VisionProviderProps): JSX.Element {
  const availableVisions = registry.list();
  const firstVisionId = availableVisions[0]?.id ?? '';
  const [internalVisionId, setInternalVisionId] = useState(defaultVisionId ?? firstVisionId);
  const activeVisionId = visionId ?? internalVisionId;
  const activeVision = registry.getOrFallback(activeVisionId);

  useEffect(() => {
    if (!activeVision || typeof document === 'undefined') {
      return;
    }

    const root = targetElement ?? document.documentElement;
    applyVisionToElement(root, activeVision);
  }, [activeVision, targetElement]);

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

  const contextValue = useMemo<VisionContextValue | undefined>(() => {
    if (!activeVision) {
      return undefined;
    }

    return {
      availableVisions,
      activeVision,
      activeVisionId: activeVision.id,
      setVision,
    };
  }, [activeVision, availableVisions, setVision]);

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
