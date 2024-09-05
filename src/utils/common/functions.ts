import { model } from "mongoose"

export const isExist = async (modelName: string, filter: any) => {
    return await model(modelName).findOne(filter)
}