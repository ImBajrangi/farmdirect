import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const SCROLL_STORAGE_KEY = 'farmdirect_scroll_positions_v1';

// In-memory cache for ultra-fast lookup during the active SPA session
const memoryScrollMap = new Map<string, number>();

function getSavedPosition(key: string): number | undefined {
  if (memoryScrollMap.has(key)) {
    return memoryScrollMap.get(key);
  }
  try {
    const raw = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed[key] === 'number') {
        memoryScrollMap.set(key, parsed[key]);
        return parsed[key];
      }
    }
  } catch {
    // Graceful fallback if storage unavailable
  }
  return undefined;
}

function savePosition(key: string, y: number) {
  memoryScrollMap.set(key, y);
  try {
    const raw = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[key] = Math.round(y);

    // Keep map bounded to prevent storage bloat
    const keys = Object.keys(map);
    if (keys.length > 60) {
      delete map[keys[0]];
    }
    sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Graceful fallback
  }
}

/**
 * SmartScrollRestoration:
 * 1. For fresh navigation (PUSH): Scrolls immediately to top (0,0) so new pages start fresh.
 * 2. For browser/app back & forward (POP): Accurately restores the exact previous scroll position
 *    so the user doesn't lose their place in the catalog when returning from a detail page.
 */
export const SmartScrollRestoration: React.FC = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevKeyRef = useRef(location.key);
  const prevPathRef = useRef(location.pathname);

  // Disable default unpredictable browser scroll restoration in SPAs
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Continuously record scroll position on the active page
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
          // Save by both unique history key and full path URL for bulletproof back recovery
          savePosition(location.key, scrollY);
          savePosition(`${location.pathname}${location.search}`, scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.key, location.pathname, location.search]);

  // Handle route change scroll actions
  useEffect(() => {
    const isPop = navigationType === 'POP';
    const isPathChange = location.pathname !== prevPathRef.current;
    prevKeyRef.current = location.key;
    prevPathRef.current = location.pathname;

    // Helper to execute instant scroll without fighting CSS scroll-behavior
    const applyScroll = (top: number) => {
      const originalScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo({ top, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = top;
      document.body.scrollTop = top;

      requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = originalScrollBehavior;
      });
    };

    if (isPop) {
      // ─── BACK / FORWARD NAVIGATION (POP) ───────────────────────────────
      // Restore previous scroll position
      const savedY = getSavedPosition(location.key) ?? getSavedPosition(`${location.pathname}${location.search}`);

      if (savedY !== undefined && savedY > 0) {
        applyScroll(savedY);

        // Content on catalog pages may render asynchronously; observe and lock to saved position
        let attempts = 0;
        const maxAttempts = 16; // Check over ~550ms
        const intervalId = window.setInterval(() => {
          attempts++;
          const currentMaxScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (currentMaxScroll >= savedY || attempts >= maxAttempts) {
            applyScroll(savedY);
            clearInterval(intervalId);
          }
        }, 35);

        return () => clearInterval(intervalId);
      } else {
        // If no saved position, start at the top
        applyScroll(0);
      }
    } else {
      // ─── PUSH NAVIGATION (Fresh Page Navigation) ────────────────────────
      // Opening a new page or product detail page: ALWAYS fresh start from top
      if (isPathChange) {
        applyScroll(0);
      }
    }
  }, [location.key, location.pathname, location.search, navigationType]);

  return null;
};
