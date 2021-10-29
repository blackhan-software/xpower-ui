export class Parser {
  static boolean(
    text: string | undefined | null, fallback: boolean
  ): boolean {
    try {
      return Boolean(JSON.parse(text || `${fallback}`));
    } catch {
      return fallback;
    }
  }
  static number(
    text: string | undefined | null, fallback: number
  ): number {
    try {
      const parsed = JSON.parse(text || `${fallback}`);
      return typeof parsed === 'number' ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
}
export default Parser;
