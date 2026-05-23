'use client';

type ScrollBusState = {
  y: number;
  maxY: number;
};

type ScrollBusSubscriber = (state: ScrollBusState) => void;

const subscribers = new Set<ScrollBusSubscriber>();
const scrollBusState: ScrollBusState = {
  y: 0,
  maxY: 0,
};

let nativeListenerStarted = false;
let ticking = false;

function notifySubscribers() {
  subscribers.forEach((subscriber) => subscriber(scrollBusState));
}

function startNativeScrollBus() {
  if (nativeListenerStarted || typeof window === 'undefined') {
    return;
  }

  nativeListenerStarted = true;

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        scrollBusState.y = window.scrollY;
        scrollBusState.maxY = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
        notifySubscribers();
        ticking = false;
      });
    },
    { passive: true },
  );
}

export function publishScrollBus(y: number, maxY = scrollBusState.maxY) {
  scrollBusState.y = y;
  scrollBusState.maxY = maxY;
  notifySubscribers();
}

export function getScrollBusState() {
  return scrollBusState;
}

export function subscribeScrollBus(subscriber: ScrollBusSubscriber) {
  startNativeScrollBus();
  subscribers.add(subscriber);
  subscriber(scrollBusState);

  return () => {
    subscribers.delete(subscriber);
  };
}
