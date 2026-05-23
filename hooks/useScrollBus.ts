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
let scrollStopTimeout: number | null = null;

function notifySubscribers() {
  subscribers.forEach((subscriber) => subscriber(scrollBusState));
}

function readNativeScrollState() {
  scrollBusState.y = window.scrollY;
  scrollBusState.maxY = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
}

function markScrolling() {
  document.body.classList.add('is-scrolling');

  if (scrollStopTimeout !== null) {
    window.clearTimeout(scrollStopTimeout);
  }

  scrollStopTimeout = window.setTimeout(() => {
    document.body.classList.remove('is-scrolling');
    scrollStopTimeout = null;
  }, 150);
}

function startNativeScrollBus() {
  if (nativeListenerStarted || typeof window === 'undefined') {
    return;
  }

  nativeListenerStarted = true;

  readNativeScrollState();
  notifySubscribers();

  window.addEventListener(
    'scroll',
    () => {
      markScrolling();

      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        readNativeScrollState();
        notifySubscribers();
        ticking = false;
      });
    },
    { passive: true },
  );

  window.addEventListener(
    'resize',
    () => {
      readNativeScrollState();
      notifySubscribers();
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
