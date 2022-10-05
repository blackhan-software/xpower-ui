export class Parser {
  static boolean<F>(
    text: string | undefined | null, fallback: F
  ): boolean | F {
    try {
      return Boolean(JSON.parse(text || `${fallback}`));
    } catch {
      return fallback;
    }
  }
  static number<F>(
    text: string | undefined | null, fallback: F
  ): number | F {
    try {
      const parsed = JSON.parse(text || `${fallback}`);
      return typeof parsed === 'number' ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
}
export default Parser;
