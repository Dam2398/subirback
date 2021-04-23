import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Sprint} from "../entity/Sprint";
import { validate } from 'class-validator';


export class SprintController {

    //GETALL
    static getAllS = async (req: Request, res: Response)=>{

        const projectRepository = getRepository(Sprint);
        let sprints;
        try {
            sprints = await projectRepository.find();
        } catch (error) {
            res.status(500).json({msg:'Hubo un error'});
        }

        if (sprints.length > 0){
            res.json(sprints);
        }else{
            res.status(500).json({msg:'Not result'});
        }

    };

    //SOLO UN PROYECTO
    static getByIdS = async(req: Request, res: Response)=>{
        const { id } = req.params;//la ide viene en la url
        const userRepository = getRepository(Sprint);

        try {
          let sprint = await userRepository.findOneOrFail(id);
          if(!sprint){
            res.status(400).json( { msg: 'No existe el sprint'} )
        }
          res.json(sprint);
        } catch (error) {
          res.status(500).json({msg:'hubo un error'});
        }
        
    };

    //NUEVO PROYECTO
    static newSprint = async(req: Request, res: Response)=>{

        const { name, daily, fechaInicio, fechaFin, projectId} = req.body;
        const sprint = new Sprint();

        sprint.name= name;
        sprint.daily= daily;
        sprint.fechaInicio= fechaInicio;
        sprint.fechaFin= fechaFin;
        sprint.projectId = projectId;

        //Validate
       // const validationOpt = { validationError : { target: false, value: false }} };
        const errors = await validate(sprint);
        if (errors.length > 0) {
             res.status(400).json(errors);
        }

        const projectRepository = getRepository(Sprint);

        try {
            await projectRepository.save(sprint);
        } catch (error) {
            res.status(409).json({msg:"Sprint alredy exist"});
        }

        res.send('Sprint created')
    };

    //EDITAR PROYECTO
    static editSprint = async (req: Request, res: Response) => {
        let sprint;
        const { id } = req.params;
        const { name, daily, fechaInicio, fechaFin, projectId} = req.body;
        
        const userRepository = getRepository(Sprint);
        // Try get user
        try {
            sprint = await userRepository.findOneOrFail(id);//se obtiene al user
            
            sprint.name =name;
            sprint.daily =daily;
            sprint.fechaInicio =fechaInicio;
            sprint.fechaFin =fechaFin;
            sprint.projectId =projectId;
        } catch (error) {
            return res.status(404).json({ msg: 'Sprint not found' });
        }
        const validationOpt = { validationError: { target: false, value: false } };//para no mostrar en back la info||1:49:56
        const errors = await validate(sprint,validationOpt);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }
    
        // Try to save user
        try {
            await userRepository.save(sprint);
        } catch (error) {
            return res.status(409).json({ msg: 'Sprint already in use' });
        }
    
        res.status(201).json({ msg: 'Sprint update' });
      };

      static deleteSprint = async (req: Request, res: Response) => {
        const { id } = req.params;//la ide viene en la url
        const userRepository = getRepository(Sprint);
        let sprint: Sprint;
    
        try {
            sprint = await userRepository.findOneOrFail(id);
        } catch (error) {
            return res.status(404).json({ msg: 'Sprint not found' });
        }
    
        // Remove user
        userRepository.delete(id);
        res.status(201).json({ msg: 'Sprint deleted' });
      };

      static newSprintPro = async(req: Request, res: Response)=>{
        const projectId :number =+req.params.project;//para number
        const { name, daily, fechaInicio, fechaFin} = req.body;
        const sprint = new Sprint();

        sprint.name= name;
        sprint.daily= daily;
        sprint.fechaInicio= fechaInicio;
        sprint.fechaFin= fechaFin;
        sprint.projectId = projectId;

        const errors = await validate(sprint);
        if (errors.length > 0) {
            res.status(400).json(errors);
        }
          
       const projectRepository = getRepository(Sprint);

       try {
           await projectRepository.save(sprint);
       } catch (error) {
           res.status(409).json({msg:"Sprint alredy exist"});
       }

       res.send('Sprint created')

      };

      static prueba2 = async(req: Request, res: Response)=>{
        const project =+req.query.project;
        const id:number =+req.query.id;
        //http://localhost:3000/sprints/registro/?project=5000&id=2

        const userRepository = getRepository(Sprint);

        try {
            let sprint = await userRepository.findOneOrFail(id);
            if(!sprint){
                res.status(400).json( { msg: 'No existe el sprint'} )
            }
            console.log('Numero del proyecto es:'+project),
            res.json(sprint);
        } catch (error) {
            res.status(500).json({msg:'hubo un error'});
        }

      };

}

