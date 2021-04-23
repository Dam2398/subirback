import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Urp} from "../entity/Urp";
import { validate } from 'class-validator';


export class UrpController {

    //GETALL
    static getAllU = async (req: Request, res: Response)=>{

        const projectId :number =+req.query.projectId;

        const projectRepository = getRepository(Urp);
        let urps;
        try {
            urps = await projectRepository.createQueryBuilder("urp").where("projectId = :id",{id:projectId} ).getMany();
        } catch (error) {
            res.status(500).json({msg:'Hubo un error'});
        }

        if (urps.length > 0){
            res.json(urps);
        }else{
            res.status(500).json({msg:'Not result'});
        }

    };

    //SOLO UN PROYECTO
    static getByIdU = async(req: Request, res: Response)=>{
        const { id } = req.params;//la ide viene en la url
        const userRepository = getRepository(Urp);

        try {
          let urp = await userRepository.findOneOrFail(id);
          if(!urp){
            res.status(400).json( { msg: 'No existe'} )
        }
          res.json(urp);
        } catch (error) {
          res.status(500).json({msg:'hubo un error'});
        }
        
    };

    //NUEVO PROYECTO
    static newUrp = async(req: Request, res: Response, next: NextFunction)=>{
  
        const {userId} = req.body;
        const projectId :number =+req.query.projectId;
        let rol:any;
        rol=req.query.rol;

        const urp = new Urp();

        urp.rol = rol;
        urp.userId = userId;
        urp.projectId = projectId;

        //Validate
       // const validationOpt = { validationError : { target: false, value: false }} };
        const errors = await validate(urp);
        if (errors.length > 0) {
             res.status(400).json(errors);
        }

        const projectRepository = getRepository(Urp);

        try {
            await projectRepository.save(urp);
        } catch (error) {
            console.log(error);
            res.status(409).json({msg:"Urp alredy exist"});
        }

        res.send('Urp created')
    };

    static deleteUrp = async (req: Request, res: Response) => {
        const { id } = req.params;//la ide viene en la url
        const userRepository = getRepository(Urp);
        let urp: Urp;
    
        try {
            urp = await userRepository.findOneOrFail(id);
        } catch (error) {
            return res.status(404).json({ msg: 'Urp not found' });
        }
    
        // Remove user
        userRepository.delete(id);
        res.status(201).json({ msg: 'Urp deleted' });
    };
   

}

