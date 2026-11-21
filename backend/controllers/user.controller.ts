import type {Request, Response} from 'express'
import {User} from "../models";
import { CreateUserDTO } from "../dtos/User/CreateUserDTO";
import { UpdateUserDTO } from "../dtos/User/UpdateUserDTO";

export class UserController{
    
    constructor(){};

    public async getUserByID(req:Request, res:Response) {
        try {
            const id=Number(req.params.id);
            if (isNaN(id))return res.status(400).json({message: "ID invalido"});

            const user = await User.findByPk(id);
            if(!user)return res.status(404).json({message: "usuario no encontrado"});

            const plainText = user.get({plain:true}) as {
                idUser:number;
                name:string;
                email:string;
            }
            
            return res.status(200).json({plainText});

        } catch (error) {
            return res.status(500).json({message: "internal server error"});
        }
    }

}