import { TareaController } from "./../controller/TareaCrontoller";
import { Router } from "express";

const router = Router();


// Get all project
router.get('/', TareaController.getAllT);

// Get one project
router.get('/:id', TareaController.getByIdT);

// Create a new project
router.post('/', TareaController.newTarea);

// Edit project
router.patch('/:id', TareaController.editTarea);

// Delete
router.delete('/:id', TareaController.deleteTarea);


//NUEVA TAREA
router.post('/', TareaController.newTareaPro);

export default router;
