export interface GetVerifiedDoctorsDTO{
    page:number;
    limit:number;
    specialty?:string,
    experience?:string,
    sortBy?:string,
    searchQuery?:string
}