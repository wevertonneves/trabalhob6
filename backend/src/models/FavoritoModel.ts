import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class FavoritoModel extends Model {
  public userId!: number;
  public filmeId!: number;
}

FavoritoModel.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    filmeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: "favorito",
    tableName: "favoritos",
    timestamps: false,
  }
);

export default FavoritoModel;
