import { SprintController } from "./../controller/SprintController";
import { Router } from "express";

const router = Router();


// Get all project
router.get('/', SprintController.getAllS);

// Get one project
//router.get('/:id', SprintController.getByIdS);
router.get('/registro/', SprintController.prueba2);

// Create a new project
router.post('/', SprintController.newSprint);

// Edit project
router.patch('/:id', SprintController.editSprint);

// Delete
router.delete('/:id', SprintController.deleteSprint);

//PRUBA
router.post('/:project',SprintController.newSprintPro);

export default router;
