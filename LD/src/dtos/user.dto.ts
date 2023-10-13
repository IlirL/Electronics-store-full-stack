import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";



export enum AllUserRoles{
    'ADMIN',
    'EMPLOYEE',
    'USER'
}

export enum UserRolesAdminPossibleToAssign{
    'EMPLOYEE',
    'USER'
}

export enum UserRolesEmployeePossibleToAssing{
    'USER'
}
export class UserAddDTO{
    @IsEmail()
    email:string;

    @IsString()
    password:string;

    @IsString()
    fullName:string;

    @IsEnum(UserRolesAdminPossibleToAssign)
    role:UserRolesAdminPossibleToAssign;

    
}

export class UserEditDTO{
    @IsOptional()
    @IsEmail()
    email:string;

    @IsOptional()
    @IsString()
    password:string;

    @IsOptional()
    @IsString()
    fullName:string;

    @IsOptional()
    @IsEnum(UserRolesAdminPossibleToAssign)
    role:UserRolesAdminPossibleToAssign;
}