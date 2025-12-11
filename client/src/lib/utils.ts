import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Rate Limiting Constants
const PHONE_REVEAL_LIMIT = 10;
const PHONE_REVEAL_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Checks if the user is allowed to reveal a phone number based on rate limits.
 * Returns { allowed: boolean, remaining: number, message?: string }
 */
export function canRevealPhone(): { allowed: boolean; remaining: number; message?: string } {
  if (typeof window === 'undefined') return { allowed: true, remaining: PHONE_REVEAL_LIMIT };

  try {
    const now = Date.now();
    const storageKeyWindow = 'mnplow_reveal_start';
    const storageKeyCount = 'mnplow_reveal_count';

    const windowStartStr = localStorage.getItem(storageKeyWindow);
    const countStr = localStorage.getItem(storageKeyCount);

    let windowStart = windowStartStr ? parseInt(windowStartStr, 10) : 0;
    let count = countStr ? parseInt(countStr, 10) : 0;

    // Check if window has expired
    if (!windowStart || (now - windowStart > PHONE_REVEAL_WINDOW_MS)) {
      // Reset window
      windowStart = now;
      count = 0;
      localStorage.setItem(storageKeyWindow, windowStart.toString());
      localStorage.setItem(storageKeyCount, count.toString());
      return { allowed: true, remaining: PHONE_REVEAL_LIMIT };
    }

    if (count >= PHONE_REVEAL_LIMIT) {
      const resetTime = new Date(windowStart + PHONE_REVEAL_WINDOW_MS);
      const minutesLeft = Math.ceil((resetTime.getTime() - now) / 60000);
      return { 
        allowed: false, 
        remaining: 0, 
        message: `Rate limit reached. Please try again in ${minutesLeft} minutes.` 
      };
    }

    return { allowed: true, remaining: PHONE_REVEAL_LIMIT - count };
  } catch (error) {
    console.error("Rate limit check failed", error);
    // Fail open if localStorage is blocked
    return { allowed: true, remaining: 1 };
  }
}

/**
 * Records a successful phone reveal.
 */
export function recordPhoneReveal() {
  if (typeof window === 'undefined') return;

  try {
    const storageKeyCount = 'mnplow_reveal_count';
    const countStr = localStorage.getItem(storageKeyCount);
    let count = countStr ? parseInt(countStr, 10) : 0;
    
    localStorage.setItem(storageKeyCount, (count + 1).toString());
  } catch (error) {
    console.error("Failed to record reveal", error);
  }
}

/**
 * Decodes a Base64 encoded phone number.
 * Simple obfuscation to prevent basic scraping.
 */
export function decodePhone(encodedPhone: string): string {
  if (!encodedPhone) return "";
  try {
    return atob(encodedPhone);
  } catch (e) {
    console.error("Failed to decode phone", e);
    return encodedPhone; // Fallback if not encoded correctly
  }
}
