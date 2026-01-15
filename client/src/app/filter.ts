import { ITask } from "./task"

export interface Filter {
    name:string
    func:(arg0:ITask) => boolean
}
