'use client';

import {
  Briefcase,
  Cpu,
  Download,
  Home,
  Lightbulb,
  Mail,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { AeroGlass } from '@/components/ui/GlassPanel';
import { scrollToVirtualElement } from '@/hooks/useLerpScroll';
import { subscribeScrollBus } from '@/hooks/useScrollBus';

type DockNavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  type?: 'nav';
};

type DockActionItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  download: true;
  type: 'action';
};

type DockItem = DockNavItem | DockActionItem;

const NAV_ITEMS: DockItem[] = [
  { id: 'hero', label: 'Home', icon: Home },
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'system', label: 'System', icon: Cpu },
  { id: 'approach', label: 'Approach', icon: Lightbulb },
  { id: 'contact', label: 'Contact', icon: Mail },
  {
    id: 'resume',
    label: 'Resume',
    icon: Download,
    href: '/resume.pdf',
    download: true,
    type: 'action',
  },
];

export function DockNavigation() {
  const [activeId, setActiveId] = useState('hero');
  const [bouncingId, setBouncingId] = useState<string | null>(null);

  useEffect(() => {
    const sectionIds = NAV_ITEMS.filter((item) => item.type !== 'action').map((item) => item.id);

    return subscribeScrollBus(({ y }) => {
      const viewportAnchor = window.innerHeight * 0.36;
      let nextActiveId = sectionIds[0];

      sectionIds.forEach((sectionId) => {
        const section = document.getElementById(sectionId);

        if (!section) {
          return;
        }

        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + y;
        const sectionBottom = sectionTop + rect.height;

        if (sectionTop <= y + viewportAnchor && sectionBottom > y + viewportAnchor) {
          nextActiveId = sectionId;
        }
      });

      setActiveId(nextActiveId);
    });
  }, []);

  const handleNavClick = (item: DockItem) => {
    if (navigator.vibrate) {
      navigator.vibrate(8);
    }

    setBouncingId(item.id);
    window.setTimeout(() => setBouncingId((currentId) => (currentId === item.id ? null : currentId)), 220);

    if (item.type === 'action') {
      return;
    }

    scrollToVirtualElement(item.id);
  };

  return (
    <div className="macos-dock-shell fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6">
      <AeroGlass
        variant="dock"
        tone="frost"
        floating
        hover={false}
        initial={false}
        whileInView={undefined}
        role="navigation"
        aria-label="Portfolio sections"
        className="macos-dock flex items-end gap-2 px-3 py-2.5"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isAction = item.type === 'action';

          return (
            <a
              key={item.id}
              href={isAction ? item.href : `#${item.id}`}
              download={isAction ? item.download : undefined}
              className={[
                'macos-dock-item',
                isAction ? 'macos-dock-action' : '',
                !isAction && activeId === item.id ? 'macos-dock-item-active' : '',
                bouncingId === item.id ? 'macos-dock-item-bounce' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label={item.label}
              onClick={(event) => {
                if (!isAction) {
                  event.preventDefault();
                }

                handleNavClick(item);
              }}
            >
              <Icon aria-hidden="true" />
              <span className="macos-dock-tooltip" aria-hidden="true">
                {item.label}
              </span>
            </a>
          );
        })}
      </AeroGlass>
    </div>
  );
}
