import FilmesModel from "./FilmesModel";
import GenerosModel from "./GenerosModel";
import FavoritoModel from "./FavoritoModel";
import UserModel from "./UserModel";

export function setupAssociations() {
 
  GenerosModel.belongsToMany(FilmesModel, {
    through: "filmegenero",
    as: "filmes",
    foreignKey: "generoId",
    otherKey: "filmeId",
  });

  FilmesModel.belongsToMany(GenerosModel, {
    through: "filmegenero",
    as: "generos",
    foreignKey: "filmeId",
    otherKey: "generoId",
  });
}

UserModel.belongsToMany(FilmesModel, {
  through: FavoritoModel,
  as: "favoritos",
  foreignKey: "userId",
  otherKey: "filmeId",
});

FilmesModel.belongsToMany(UserModel, {
  through: FavoritoModel,
  as: "usuariosFavoritaram",
  foreignKey: "filmeId",
  otherKey: "userId",
});
