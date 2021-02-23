import {YtResponse} from '../models/YtResponse';  

export default class AppUtills  { 

  static parseResponse  (response: YtResponse) {
    if(response!=null && response.response!=undefined)
    return response.response;

    return null;
  }

  static createSuccessAlert  (message: string,timer:number) {
    if(timer==null)
      timer=6000; 
  }

  static createFailureAlert  (message: string,timer:number,) {
    if(timer==null)
      timer=3000; 
}
    
}
 