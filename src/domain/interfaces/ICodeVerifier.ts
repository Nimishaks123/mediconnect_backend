export interface ICodeVerifier {
   //Compares the  plain code against the stored 
   
  matches(plain: string, secure: string): Promise<boolean>;
}
