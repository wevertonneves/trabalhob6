import { Request, Response } from "express";
import { Op } from "sequelize";
import FilmesModel from "../models/FilmesModel";
import GenerosModel from "../models/GenerosModel";
import { validateFilmeId } from "../validators/Validators";


const filmeAttributes = [
  "id",
  "name",
  "releaseYear",
  "duration",
  "image",
  "videoUrl",
  "sinopse",
];

const generoInclude = {
  model: GenerosModel,
  as: "generos",
  attributes: ["id", "name"],
  through: { attributes: [] }, 
};


const handleError = (res: Response, error: any, message = "Erro interno") => {
  console.error(message, error);
  res.status(500).json({ error: message });
};


export const getFilmesByGenero = async (req: Request, res: Response) => {
  try {
    const id = validateFilmeId(req.params.id);

    const filmes = await FilmesModel.findAll({
      include: [{ ...generoInclude, where: { id } }],
      attributes: filmeAttributes,
    });

    res.json(filmes);
  } catch (error) {
    handleError(res, error, "Erro ao buscar filmes do gênero");
  }
};


export const getAll = async (_req: Request, res: Response) => {
  try {
    const filmes = await FilmesModel.findAll({
      include: [generoInclude],
      attributes: filmeAttributes,
    });

    res.json(filmes);
  } catch (error) {
    handleError(res, error, "Erro ao buscar filmes");
  }
};


export const getFilmeById = async (req: Request, res: Response) => {
  try {
    const id = validateFilmeId(req.params.id);

    const filme = await FilmesModel.findByPk(id, {
      include: [generoInclude],
      attributes: filmeAttributes,
    });

    if (!filme) {
      return res.status(404).json({ error: "Filme não encontrado" });
    }

    res.json(filme);
  } catch (error) {
    handleError(res, error, "Erro ao buscar filme por ID");
  }
};


export const deleteFilme = async (req: Request, res: Response) => {
  try {
    const id = validateFilmeId(req.params.id);

    const filme = await FilmesModel.findByPk(id);
    if (!filme) {
      return res.status(404).json({ error: "Filme não encontrado" });
    }

    await filme.destroy();
    res.json({ message: "Filme deletado com sucesso" });
  } catch (error) {
    handleError(res, error, "Erro ao deletar filme");
  }
};


export const addFilme = async (req: Request, res: Response) => {
  try {
    const { name, year, duration, imageUrl, videoUrl, sinopse, genres } = req.body;

    if (!name || !year || !duration || !imageUrl || !videoUrl || !sinopse || !Array.isArray(genres) || genres.length === 0) {
      return res.status(400).json({ error: "Todos os campos e gêneros são obrigatórios" });
    }

    const novoFilme = await FilmesModel.create({
      name,
      releaseYear: year,
      duration,
      image: imageUrl,
      videoUrl,
      sinopse,
    });

    await novoFilme.setGeneros(genres);

    res.status(201).json(novoFilme);
  } catch (error) {
    handleError(res, error, "Erro ao adicionar filme");
  }
};


export const updateFilme = async (req: Request, res: Response) => {
  try {
    const id = validateFilmeId(req.params.id);
    const { name, year, duration, imageUrl, videoUrl, sinopse, genres } = req.body;

    if (!name || !year || !duration || !imageUrl || !videoUrl || !sinopse || !Array.isArray(genres) || genres.length === 0) {
      return res.status(400).json({ error: "Todos os campos e gêneros são obrigatórios" });
    }

    const filme = await FilmesModel.findByPk(id);
    if (!filme) {
      return res.status(404).json({ error: "Filme não encontrado" });
    }

    await filme.update({
      name,
      releaseYear: year,
      duration,
      image: imageUrl,
      videoUrl,
      sinopse,
    });

    await filme.setGeneros(genres);

    res.json({ message: "Filme atualizado com sucesso", filme });
  } catch (error) {
    handleError(res, error, "Erro ao atualizar filme");
  }
};


export const searchFilmeByName = async (req: Request, res: Response) => {
  try {
    const { nome } = req.query;

    if (!nome || typeof nome !== "string") {
      return res.status(400).json({ error: "Nome do filme é obrigatório" });
    }

    const filme = await FilmesModel.findOne({
      where: {
        name: { [Op.like]: `%${nome}%` },
      },
      include: [generoInclude],
      attributes: filmeAttributes,
    });

    if (!filme) {
      return res.status(404).json({ error: "Filme não encontrado" });
    }

    res.json(filme);
  } catch (error) {
    handleError(res, error, "Erro ao buscar filme por nome");
  }
};
