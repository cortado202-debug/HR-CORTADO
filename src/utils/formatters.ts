// Syrian Pounds (SYP) Currency Formatter and Arabic Date Helpers

/**
 * Format amount as Syrian Pounds (SYP / ليرة سورية)
 * Example: 1500000 -> "1,500,000 ل.س"
 */
export function formatSYP(amount: number | string | undefined | null, includeSymbol: boolean = true): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return includeSymbol ? `0 ل.س` : '0';
  }
  
  const num = Math.round(Number(amount));
  const formatted = new Intl.NumberFormat('en-US').format(num);
  
  return includeSymbol ? `${formatted} ل.س` : formatted;
}

/**
 * Format amount in Arabic spoken words if needed (e.g. 50 ألف ليرة)
 */
export function formatSYPShort(amount: number): string {
  if (!amount || isNaN(amount)) return '0 ل.س';
  if (amount >= 1_000_000) {
    const millions = (amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 2);
    return `${millions} مليون ل.س`;
  }
  if (amount >= 1_000) {
    const thousands = (amount / 1_000).toFixed(amount % 1_000 === 0 ? 0 : 1);
    return `${thousands} ألف ل.س`;
  }
  return formatSYP(amount);
}

/**
 * Parse input string into numeric amount (strips commas, currency letters, spaces)
 */
export function parseSYPInput(val: string): number {
  if (!val) return 0;
  // replace Arabic digits with western digits if any
  const normalized = val
    .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
    .replace(/[^\d]/g, '');
  const parsed = parseInt(normalized, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Get current date in YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get current time in HH:mm
 */
export function getCurrentTimeString(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Arabic formatted date string
 * Example: "السبت، 29 آب 2026"
 */
export function formatArabicDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return new Intl.DateTimeFormat('ar-SY', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Arabic short date (e.g. 29 آب)
 */
export function formatArabicShortDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return new Intl.DateTimeFormat('ar-SY', {
      day: 'numeric',
      month: 'short',
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Arabic day of week name (e.g. "السبت", "الأحد")
 */
export function getDayOfWeekArabic(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('ar-SY', { weekday: 'long' }).format(date);
  } catch {
    return '';
  }
}

/**
 * Arabic month name and year (e.g. "آب 2026")
 */
export function formatArabicMonth(yearMonth: string): string {
  if (!yearMonth) return '';
  try {
    const [year, month] = yearMonth.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    
    return new Intl.DateTimeFormat('ar-SY', {
      year: 'numeric',
      month: 'long',
    }).format(date);
  } catch {
    return yearMonth;
  }
}
