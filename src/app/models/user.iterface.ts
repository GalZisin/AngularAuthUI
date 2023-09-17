
export interface UserLogin{
    username: string;
    password: string;
}


export interface UserRegister extends UserLogin {
    firstName: string;
    lastName: string;
    email: string;
    // username: string;
    // password: string;
}