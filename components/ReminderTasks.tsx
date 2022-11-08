import React from 'react'
import { SCHEDULE_IMPORTANCE } from '../data/definitions/enums'
import { Schedule } from '../types/Schedule';
import { format } from 'date-fns';
type Props = {
    tasks: Schedule[]
    perHour?: boolean
}
export default function ReminderTasks({ tasks, perHour = false }: Props) {
    let formatDate = perHour ? "hh:mm" : "dd/LL/y";
    return <>
        {tasks.map((remind: Schedule, key: number) => {
            let importance;
            switch (remind.importance) {
                case SCHEDULE_IMPORTANCE.LOW:
                    importance = "low";
                case SCHEDULE_IMPORTANCE.HIGH:
                    importance = "high";
                case SCHEDULE_IMPORTANCE.MEDIUM:
                default:
                    importance = "medium";
            }
            return <ol className={`reminder task ${importance}`} key={key}>{format(remind.taskDate, formatDate)} {remind.taskName}</ol>
        })}
    </>
}
