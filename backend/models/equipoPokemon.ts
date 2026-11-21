import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/database.sequelize.connection";

const sequelize=sequelizeConnection.getSequelize();

interface IEquipoPokemon extends Model{
    idEquipo:number;
    pokemonid:number;
    slot:number;
}

const Equipo=sequelize.define<IEquipoPokemon>(
    "EquipoPokemon",
    {
        idEquipo:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            references: {
                model: 'Equipo',
                key: 'id',
            }
        },
        pokemonid:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Pokemon',
                key: 'id',
            }
        },
        slot:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
);

export default {Equipo}