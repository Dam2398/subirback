import { ProjectController } from "./../controller/ProjectController";
import { Router } from "express";
import  sprint  from "./sprint";

const router = Router();

//router.use('/sprint', sprint)//AQUI SE VA ANIDANDO

// Get all project
router.get('/', ProjectController.getAllP);

// Get one project
router.get('/:id', ProjectController.getByIdP);

// Create a new project
router.post('/', ProjectController.newProject);

// Edit project
router.patch('/:id', ProjectController.editProject);

// Delete
router.delete('/:id', ProjectController.deleteProject);

export default router;
