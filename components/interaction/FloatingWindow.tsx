'use client';

import {
  motion,
} from 'framer-motion';
import {
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type FloatingWindowContextValue = {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
};

const FloatingWindowContext = createContext<FloatingWindowContextValue | null>(null);

export function FloatingWindowProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      activeId,
      setActiveId,
    }),
    [activeId],
  );

  return (
    <FloatingWindowContext.Provider value={value}>
      {children}
    </FloatingWindowContext.Provider>
  );
}

type FloatingWindowProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  strength?: number;
  repelRadius?: number;
};

export function FloatingWindow({
  children,
  className = '',
  id,
  strength: _strength = 1,
  repelRadius: _repelRadius = 420,
}: FloatingWindowProps) {
  const generatedId = useId();
  const windowId = id ?? generatedId;
  const context = useFloatingWindowContext();

  const isActive = context.activeId === windowId;
  const isInactive = Boolean(context.activeId && context.activeId !== windowId);
  const stateClassName = isActive
    ? 'floating-window-active'
    : isInactive
      ? 'floating-window-inactive'
      : '';

  return (
    <motion.div
      className={`floating-window ${stateClassName} ${className}`}
      onPointerDown={() => context.setActiveId(windowId)}
      onPointerEnter={() => context.setActiveId(windowId)}
      onFocusCapture={() => context.setActiveId(windowId)}
    >
      {children}
    </motion.div>
  );
}

function useFloatingWindowContext() {
  const context = useContext(FloatingWindowContext);

  if (!context) {
    throw new Error('FloatingWindow must be used inside FloatingWindowProvider');
  }

  return context;
}
