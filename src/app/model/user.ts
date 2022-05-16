export module UserModule {
export interface IUser{
    name: string,
    email: string,
    phone: string
}


export class User implements IUser{
    name!: string;
    email!: string;
    phone!: string;
}
}