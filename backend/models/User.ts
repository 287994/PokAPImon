import {DataTypes, Model} from 'sequelize';
import sequelizeConnection from '../conf/database.sequelize.connection';

const sequelize=sequelizeConnection.getSequelize();

interface IUser extends Model {
    idUser:number,
    name:string
    email:string,
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
    },
        {
            timestamps: true
        },
);

export default {User}
