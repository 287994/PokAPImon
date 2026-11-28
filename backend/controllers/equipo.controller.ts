import type {Request, Response} from 'express'
import {Equipo, equipoPokemon, User} from "../models";
import { ResponseUserDTO } from "../dtos/User/ResponseUserDTO";
import { CreateEquipoPokemonDTO } from "../dtos/EquipoPokemon/CreateEquipoPokemonDTO";

export class equipoController{
    
    constructor(){};

    public async getAllEquiposByUserID(req:Request, res:Response) {
        try {
            const id=Number(req.params.id);
            if (isNaN(id))return res.status(400).json({message: "ID invalido"});

            const user = await User.findByPk(id);
            if(!user)return res.status(404).json({message: "usuario no encontrado"});

            const registrosEquipoPokemon = await equipoPokemon.findAll({
                include: [
                    {
                        model: Equipo,
                        where: {
                            idUser: id,
                        },
                        required: true,
                    },
                ],
            });
            return res.status(200).json(registrosEquipoPokemon);

        } catch (error) {
            return res.status(500).json({message: "internal server error"});
        }
    }

}