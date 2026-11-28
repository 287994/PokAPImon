import type {Request, Response} from 'express'
import {User} from "../models";
import { CreateUserDTO } from "../dtos/User/CreateUserDTO";
import { ResponseUserDTO } from "../dtos/User/ResponseUserDTO";
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

    public async getMostScored(req:Request,res:Response){
        try {
            const users=await User.findAll({
                order:[["puntaje","DESC"]],
                limit: 10,
            }); 
            return res.status(200).json(users.map(u=>ResponseUserDTO.create(u)));
        
        } catch (error) {
            return res.status(500).json({message: "internal server error"});
        }
    }

    public async createUser(req:Request,res:Response){
        try {
            const dto = CreateUserDTO.create(req.body);
            const user=await User.create({...dto});
            return res.status(201).json({message:"usuario creado correctamente"})

        } catch (error) {
            return res.status(500).json({message:"internal server error"});
        }
    }
}