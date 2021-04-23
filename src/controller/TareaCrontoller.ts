import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Tarea} from "../entity/Tarea";
import { Urp } from "../entity/Urp";
import { validate } from 'class-validator';


export class TareaController {

    //GETALL
    static getAllT = async (req: Request, res: Response)=>{

        const projectRepository = getRepository(Tarea);
        let tareas;
        try {
            tareas = await projectRepository.find();
        } catch (error) {
            res.status(500).json({msg:'Hubo un error'});
        }

        if (tareas.length > 0){
            res.json(tareas);
        }else{
            res.status(500).json({msg:'Not result'});
        }

    };

    //SOLO UN PROYECTO
    static getByIdT = async(req: Request, res: Response)=>{
        const { id } = req.params;//la ide viene en la url
        const userRepository = getRepository(Tarea);

        try {
          let tarea = await userRepository.findOneOrFail(id);
          if(!tarea){
            res.status(400).json( { msg: 'No existe la tarea'} )
        }
          res.json(tarea);
        } catch (error) {
          res.status(500).json({msg:'hubo un error'});
        }
        
    };

    //NUEVO PROYECTO
    static newTarea = async(req: Request, res: Response)=>{

        const { name, description, status, priority, urpId, sprintId } = req.body;
        const tarea = new Tarea();

        tarea.name= name;
        tarea.description=description;
        tarea.status= status;
        tarea.priority= priority;
        tarea.urpId= urpId;
        tarea.sprintId= sprintId;

        //Validate
       // const validationOpt = { validationError : { target: false, value: false }} };
        const errors = await validate(tarea);
        if (errors.length > 0) {
             res.status(400).json(errors);
        }

        const projectRepository = getRepository(Tarea);

        try {
            await projectRepository.save(tarea);
        } catch (error) {
            res.status(409).json({msg:"Tarea alredy exist"});
        }

        res.send('Tarea created')
    };

    //EDITAR PROYECTO
    static editTarea = async (req: Request, res: Response) => {
        let tarea;
        const { id } = req.params;
        const { name, description, status, priority, urpId, sprintId } = req.body;
        
        const userRepository = getRepository(Tarea);
        // Try get user
        try {
            tarea = await userRepository.findOneOrFail(id);//se obtiene al user
            
            tarea.name =name;
            tarea.description= description;
            tarea.status =status;
            tarea.priority =priority;
            tarea.urpId =urpId;
            tarea.sprintId =sprintId;
            
        } catch (error) {
            return res.status(404).json({ msg: 'Tarea not found' });
        }
        const validationOpt = { validationError: { target: false, value: false } };//para no mostrar en back la info||1:49:56
        const errors = await validate(tarea,validationOpt);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }
    
        // Try to save user
        try {
            await userRepository.save(tarea);
        } catch (error) {
            return res.status(409).json({ msg: 'Tarea already in use' });
        }
    
        res.status(201).json({ msg: 'Tarea update' });
    };

    static deleteTarea = async (req: Request, res: Response) => {
        const { id } = req.params;//la ide viene en la url
        const userRepository = getRepository(Tarea);
        let tarea: Tarea;
    
        try {
            tarea = await userRepository.findOneOrFail(id);
        } catch (error) {
            return res.status(404).json({ msg: 'Tarea not found' });
        }
    
        // Remove user
        userRepository.delete(id);
        res.status(201).json({ msg: 'Tarea deleted' });
    };

    static newTareaPro = async (req: Request, res: Response) =>{
        const sprintId:number =+req.query.sprintId;

        const { name, description, status, priority, urpId } = req.body;
        const tarea = new Tarea();

        tarea.name= name;
        tarea.description=description;
        tarea.status= status;
        tarea.priority= priority;
        tarea.urpId= urpId;
        tarea.sprintId= sprintId;

        
        const errors = await validate(tarea);
        if (errors.length > 0) {
            res.status(400).json(errors);
        }

        const projectRepository = getRepository(Tarea);

       try {
           await projectRepository.save(tarea);
       } catch (error) {
           console.log(error);
           res.status(409).json({msg:"Tarea alredy exist"});
       }
       res.send('Tarea created')
    }; 
}

