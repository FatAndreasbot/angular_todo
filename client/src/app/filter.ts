import { ITask } from "./task"

export interface IFilter {
    name:string
    func:(arg0:ITask) => boolean
}
