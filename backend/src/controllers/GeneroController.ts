import { Request, Response } from "express";
import GeneroModel from "../models/GenerosModel";
import FilmeModel from "../models/FilmesModel";
import { validateId } from "../validators/Validators";


const handleError = (res: Response, error: any, message: string) => {
  console.error(message, error);
  res.status(500).json({ message, error });
};


export const getAll = async (_req: Request, res: Response) => {
  try {
    const generos = await GeneroModel.findAll();
    res.json(generos);
  } catch (error) {
    handleError(res, error, "Erro ao buscar gêneros");
  }
};


export const getFilmesPorGenero = async (req: Request, res: Response) => {
  try {
    const id = validateId(req.params.id);

    const genero = await GeneroModel.findByPk(id, {
      include: [
        {
          model: FilmeModel,
          as: "filmes",
          through: { attributes: [] },
        },
      ],
    });

    if (!genero) {
      return res.status(404).json({ message: "Gênero não encontrado" });
    }

    res.json(genero.filmes);
  } catch (error) {
    handleError(res, error, "Erro ao buscar filmes por gênero");
  }
};


export const createGenero = async (req: Request, res: Response) => {
  try {
    const { name, image } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Nome do gênero é obrigatório" });
    }

    if (image && typeof image !== "string") {
      return res.status(400).json({ message: "A imagem deve ser uma URL válida" });
    }

    const novoGenero = await GeneroModel.create({ name, image });
    res.status(201).json(novoGenero);
  } catch (error) {
    handleError(res, error, "Erro ao criar gênero");
  }
};


export const updateGenero = async (req: Request, res: Response) => {
  try {
    const id = validateId(req.params.id);
    const { name, image } = req.body;

    const genero = await GeneroModel.findByPk(id);
    if (!genero) {
      return res.status(404).json({ message: "Gênero não encontrado" });
    }

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Nome inválido" });
    }

    genero.name = name;

    if (image && typeof image === "string") {
      genero.image = image;
    }

    await genero.save();
    res.status(200).json({ message: "Gênero atualizado com sucesso", genero });
  } catch (error) {
    handleError(res, error, "Erro ao atualizar gênero");
  }
};


export const deleteGenero = async (req: Request, res: Response) => {
  try {
    const id = validateId(req.params.id);

    const genero = await GeneroModel.findByPk(id);
    if (!genero) {
      return res.status(404).json({ message: "Gênero não encontrado" });
    }

    await genero.destroy();
    res.status(200).json({ message: "Gênero deletado com sucesso" });
  } catch (error) {
    handleError(res, error, "Erro ao deletar gênero");
  }
};
