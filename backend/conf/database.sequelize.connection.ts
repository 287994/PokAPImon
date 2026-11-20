import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const {DB_USER, DB_HOST, DB_PASSWORD, DB_PORT, DB_NAME, ENVIRONMENT} = process.env;

export class SequelizeConnection{
    private readonly sequelize:Sequelize;

    constructor(){
        this.sequelize=new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD, {
            host: DB_HOST!,
            port: Number(DB_PORT),
            dialect: "postgres",
            logging: ENVIRONMENT === 'DEVELOPMENT' ? console.log : false,
        });
    }

    public getSequelize():Sequelize{
        return this.sequelize;
    }

  public async connect(): Promise<void> {
    await this.sequelize.authenticate();
    await this.sequelize.sync();
  
  }

  public async disconnect(): Promise<void> {
    await this.sequelize.close();
  }
}

const sequelizeConnection = new SequelizeConnection();

export default sequelizeConnection;

