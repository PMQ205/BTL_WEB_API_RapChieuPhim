import { Router } from "express";
import { films_Controller } from "../Controllers/Films_Controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const film_Router = Router();

// ===== PUBLIC =====
film_Router.get("/", films_Controller.getAllFilms_Controller);
film_Router.get("/:id", films_Controller.getFilmsByID_Controller);

// ===== ADMIN =====
film_Router.post(
  "/",
  authenticate,
  authorize([1]),
  films_Controller.addFilm_Controller
);

film_Router.put(
  "/:id",
  authenticate,
  authorize([1]),
  films_Controller.updateFilm_Controller
);

film_Router.delete(
  "/:id",
  authenticate,
  authorize([1]),
  films_Controller.deleteFilm_Controller
);

export default film_Router;
