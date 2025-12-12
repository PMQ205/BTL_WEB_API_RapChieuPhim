import { Router } from "express";
import {
  films_Controller
} from "../Controllers/Films_Controller.js";

const film_Router = Router();

// GET /films
film_Router.get("/", films_Controller.getAllFilms_Controller);

// GET /films/:id
film_Router.get("/:id", films_Controller.getFilmsByID_Controller);

// POST /films
film_Router.post("/", films_Controller.addFilm_Controller);

// PUT /films/:id
film_Router.put("/:id", films_Controller.updateFilm_Controller);

// DELETE /films/:id
film_Router.delete("/:id", films_Controller.deleteFilm_Controller);

export default film_Router;
