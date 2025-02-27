import { NextFunction, Request, Response } from "express"
import logger from "../config/winston"

export const handleError = (error: any , request: Request, response: Response, next: NextFunction) => {
   
    if(error?.statusCode === 500 || !error?.statusCode)  {
        logger.error(`[ERRO GLOBAL] Mensagem: ${error.message}`, {
            stack: error.stack,
            url: request.url,
            body: request.body,
          })
    }
    response.status(error.statusCode || 500).json({error: error.message})
}