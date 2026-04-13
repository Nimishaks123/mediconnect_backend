export interface ICodeVerifier {
  /**
   * Compares the provided plain code against the stored 
   */
  matches(plain: string, secure: string): Promise<boolean>;
}
