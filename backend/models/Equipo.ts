import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/database.sequelize.connection";

const sequelize=sequelizeConnection.getSequelize();

interface IEquipo extends Model{
    idEquipo:number;
    Pk1:string;
    Pk2:string;
    Pk3:string;
    Pk4:string;
    Pk5:string;
    Pk6:string;
    idUser:number;
}

const Equipo=sequelize.define<IEquipo>(
    "Equipo",
    {
        idEquipo:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Pk1:{
            type: DataTypes.STRING,
            allowNull: false
        },
        Pk2:{
            type: DataTypes.STRING,
            allowNull: false
        },
        Pk3:{
            type: DataTypes.STRING,
            allowNull: false
        },
        Pk4:{
            type: DataTypes.STRING,
            allowNull: false
        },
        Pk5:{
            type: DataTypes.STRING,
            allowNull: false
        },
        Pk6:{
            type: DataTypes.STRING,
            allowNull: false
        },
        idUser:{
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            }
        },
    },
);

export default {Equipo}