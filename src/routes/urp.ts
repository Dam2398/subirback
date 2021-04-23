import { UrpController } from "./../controller/UrpController";
import { Router } from "express";

const router = Router();


// Get all users
router.get('/', UrpController.getAllU);

// Get one user
router.get('/:id', UrpController.getByIdU);

// Create a new user
router.post('/', UrpController.newUrp);


export default router;
