import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../conf/database.sequelize.connection";

const sequelize=sequelizeConnection.getSequelize();

interface IEquipo extends Model{
    idEquipo:number;
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
        idUser:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            }
        },
    },
);

export default Equipo