import {DataTypes, Model} from 'sequelize';
import sequelizeConnection from '../conf/database.sequelize.connection';

const sequelize=sequelizeConnection.getSequelize();

interface IUser extends Model {
    idUser:number,
    name:string
    contrasenia:string;
    email:string,
    puntaje:number
}

const User=sequelize.define<IUser>(
    "User",
    {
        idUser:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contrasenia: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        puntaje: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
        {
            timestamps: true
        },
);

export default User
