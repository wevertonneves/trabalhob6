import {
  DataTypes,
  Model,
  Optional,
  Association,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin,
} from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcrypt";
import FilmesModel from "./FilmesModel"; 


interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  cpf: string; 
}


interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}


class UserModel extends Model<UserAttributes, UserCreationAttributes> {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public cpf!: string; 


  public async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  public async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

 
  public favoritos?: FilmesModel[];
  public addFavorito!: HasManyAddAssociationMixin<FilmesModel, number>;
  public removeFavorito!: HasManyRemoveAssociationMixin<FilmesModel, number>;

  public static associations: {
    favoritos: Association<UserModel, FilmesModel>;
  };
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);


UserModel.beforeCreate(async (user) => {
  await user.hashPassword();
});

UserModel.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    await user.hashPassword();
  }
});

export default UserModel;
