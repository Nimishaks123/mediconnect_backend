export type LoginWithGoogleDTO ={
  code: string;  // "code" query param from Google callback
  role?: string;
}
