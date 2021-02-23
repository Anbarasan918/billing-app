export class YtResponse {
    responseCode: string;
    buyerEmail: string;
    description: string;
    response: any;
    page: string;
    size: string;
    totalCount: number;  
    totalPages: string; 
    pageCount:number=10; 
}

export enum PageCount {
    count = 10
}
