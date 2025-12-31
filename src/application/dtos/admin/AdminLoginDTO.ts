export interface AdminLoginDTO {
  email: string;
  password: string;
}
export interface AdminLoginOutputDTO{
    accessToken:string;
    refreshToken:string;
    admin:{
        id:string;
        name:string;
        email:string;
        role:"ADMIN";
    }

}