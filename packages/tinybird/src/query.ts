import {z} from 'zod';
import {tb} from "./client"


export const getCountPerModel = tb.buildPipe({
    pipe: "count_per_model_pipe",
    parameters: z.object({
        userEmail: z.string().email(),
        model: z.string(),
    }),
    data: z.object({
        model: z.string(),
        count: z.number(),
    })
})

export const getCountPerUser = tb.buildPipe({
    pipe: "count_per_user_pipe",
    parameters: z.object({
        userEmail: z.string().email(),
    }),
    data: z.object({
        count: z.number(),
    })
})