import {UserRole} from "../enums/UserRole";
export class Admin{
  private constructor(
    private readonly _name:string,
    private readonly _email:string,
    private readonly _passwordHash:string,
    private readonly _role:UserRole=UserRole.ADMIN,
    private readonly _id?:string
  ){}
  //getters
  get name():string{
    return this._name;
  }
  get email():string{
    return this._email;
  }
  get passwordHash():string{
    return this._passwordHash
  }
  get role():UserRole{
    return this._role;
  }
  get id():string|undefined{
    return this._id
  }
  //rehydrate from db, used when loading existing data
  static rehydrate(name:string,email:string,passwordHash:string,role:UserRole,id:string):Admin{
    return new Admin(name,email,passwordHash,role,id);


  }
  //create new admin with default role
  static create(name:string,email:string,passwordHash:string):Admin{
    return new Admin(name,email,passwordHash,UserRole.ADMIN);
  }

}