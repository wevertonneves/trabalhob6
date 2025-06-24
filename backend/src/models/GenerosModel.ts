import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../config/database";
import FilmesModel from "./FilmesModel"; 

class GenerosModel extends Model {
  public id!: number;
  public name!: string;
  public image!: string;


  public declare filmes?: FilmesModel[];

  public static associations: {
    filmes: Association<GenerosModel, FilmesModel>;
  };
}

GenerosModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "genero",
  }
);

export default GenerosModel;
