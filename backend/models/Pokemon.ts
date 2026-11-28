import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/database.sequelize.connection";

const sequelize=sequelizeConnection.getSequelize();

interface IPokemon extends Model{
    pokemonid:number;
    nombre:string;
    mov1:string;
    mov2:string;
    mov3:string;
    mov4:string;
}

const Equipo=sequelize.define<IPokemon>(
    "Pokemon",
    {
        pokemonid:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        mov1:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        mov2:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        mov3:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        mov4:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
);

export default {Equipo}