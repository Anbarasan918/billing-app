import {Role} from "../enum/Role";

export class User {

    email: string;

    password: string;

    name: string;

    mobile: string;

    adrress1: string;
	
	adrress2: string;
	
	adrress3: string;
	
	city: string;

    active: boolean;

    role: string;

    constructor(){
        this.active = true;
        this.role = Role.Customer;
    }
}
