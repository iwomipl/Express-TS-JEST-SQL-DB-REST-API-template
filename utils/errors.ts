import {NextFunction, Request, Response} from "express";

export class ValidationError extends Error{}

export const handleError = (err: Error, req: Request, res: Response, next: NextFunction): void=>{
    if (err instanceof ValidationError){
        res
            .status(400)
            .json({
            "message": err.message,
        })
    } else {
        res
            .status(500)
            .json({
                "message": "Something's wrong. Try again later",
            })
    }
    console.error(err);
}
