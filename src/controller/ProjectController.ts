import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Project} from "../entity/Project";
import { validate } from 'class-validator';


export class ProjectController {

    //GETALL
    static getAllP = async (req: Request, res: Response)=>{

        const projectRepository = getRepository(Project);
        let proyectos;
        try {
            proyectos = await projectRepository.find();
        } catch (error) {
            res.status(500).json({msg:'Hubo un error'});
        }

        if (proyectos.length > 0){
            res.json(proyectos);
        }else{
            res.status(500).json({msg:'Not result'});
        }

    };

    //SOLO UN PROYECTO
    static getByIdP = async(req: Request, res: Response)=>{
        const { id } = req.params;//la ide viene en la url
        const userRepository = getRepository(Project);

        try {
          let proyecto = await userRepository.findOneOrFail(id);
          if(!proyecto){
            res.status(400).json( { msg: 'No existe el proyecto'} )
        }
          res.json(proyecto);
        } catch (error) {
          res.status(500).json({msg:'hubo un error'});
        }
        
    };

    //NUEVO PROYECTO
    static newProject = async(req: Request, res: Response)=>{

        const { name, description } = req.body;
        const proyecto = new Project();

        proyecto.name= name;
        proyecto.description=description;

        //Validate
       // const validationOpt = { validationError : { target: false, value: false }} };
        const errors = await validate(proyecto);
        if (errors.length > 0) {
             res.status(400).json(errors);
        }

        const projectRepository = getRepository(Project);

        try {
            await projectRepository.save(proyecto);
            //ENVIAR CORREOS
        } catch (error) {
            res.status(409).json({msg:"Project alredy exist"});
        }

        res.send('Project created')
    };

    //EDITAR PROYECTO
    static editProject = async (req: Request, res: Response) => {
        let proyecto;
        const { id } = req.params;
        const { name, description } = req.body;
    
        const userRepository = getRepository(Project);
        // Try get user
        try {
            proyecto = await userRepository.findOneOrFail(id);//se obtiene al user
            
            proyecto.name =name;
            proyecto.description= description;
            
        } catch (error) {
          return res.status(404).json({ msg: 'Project not found' });
        }
        const validationOpt = { validationError: { target: false, value: false } };//para no mostrar en back la info||1:49:56
        const errors = await validate(proyecto,validationOpt);
        if (errors.length > 0) {
          return res.status(400).json(errors);
        }
    
        // Try to save user
        try {
          await userRepository.save(proyecto);
        } catch (error) {
          return res.status(409).json({ msg: 'Project already in use' });
        }
    
        res.status(201).json({ msg: 'Project update' });
      };

      static deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params;//la ide viene en la url
        const userRepository = getRepository(Project);
        let proyecto: Project;
    
        try {
          proyecto = await userRepository.findOneOrFail(id);
        } catch (error) {
          return res.status(404).json({ msg: 'Project not found' });
        }
    
        // Remove user
        userRepository.delete(id);
        res.status(201).json({ msg: ' Project deleted' });
      };

}