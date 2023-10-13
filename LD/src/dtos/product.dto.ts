import { IsNumber, IsString } from "class-validator";

export class ProductAddDTO{
    @IsString()
    name:string;

    @IsString()
    description:string;

    @IsNumber()
    quantity:number;

}