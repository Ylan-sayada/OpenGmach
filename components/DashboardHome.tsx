import React from 'react'
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import ReminderTasks from './ReminderTasks';
import { dashboardAccountancy, dashboardReminders, dashboardUsers } from '../data/atoms/dashboardAtoms';
import { useRecoilValue } from 'recoil';
import { currentYearAccountancy, dispatchDate, numOccurenceInObj } from '../utils/utilsFunction';
import { month } from '../data/definitions/constant';
export default function DashboardHome() {
    const users = useRecoilValue(dashboardUsers);
    const reminders = useRecoilValue(dashboardReminders);
    const accountancyData = useRecoilValue(dashboardAccountancy);

    let currentYearDetails: { [key: string]: any } = {};
    if (accountancyData) {
        currentYearDetails = currentYearAccountancy(accountancyData);

    }
    const dispatchedDate = dispatchDate(reminders);

    let usersAmount;
    if (users) {

        usersAmount = numOccurenceInObj(users);
        if (usersAmount[0] === undefined) {
            usersAmount[0] = 0;
        }
        if (usersAmount[1] === undefined) {
            usersAmount[1] = 0;
        }
        if (usersAmount[2] === undefined) {
            usersAmount[2] = 0;
        }
    }

    ChartJS.register(CategoryScale,
        LinearScale,
        BarElement,
        Title,
        ArcElement,
        Tooltip,
        Legend);
    const data = {
        labels: ['מתנדבים', 'תורמים', 'נזקקים'],
        datasets: [
            {
                label: '# מצב אחוזי משתמשים',
                data: usersAmount,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',

                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',

                ],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },

        },
    };

    const data2 = {
        labels: month,
        datasets: [
            {
                label: 'Outcome',
                data: month.map((currentMonth) => {

                    if (currentYearDetails[currentMonth] && currentYearDetails[currentMonth]["1"]) {
                        return currentYearDetails[currentMonth]["1"]
                    } else {
                        return 0;
                    }
                }),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Income',
                data: month.map((currentMonth) => {
                    if (currentYearDetails[currentMonth] && currentYearDetails[currentMonth]["0"]) {
                        return currentYearDetails[currentMonth]["0"]
                    } else {
                        return 0;
                    }
                }),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };
    return (
        <div id="dashboard_home_container">
            <h1>Statistics</h1>
            <div style={{ width: "100%", display: "flex", flex: "2 1", flexDirection: "column", height: "auto", alignItems: "center", textAlign: "center" }}>
                <div style={{ maxWidth: "800px", width: "100%" }}>
                    <h4>אחוזי משתמשים</h4>
                    <Doughnut data={data} />
                </div>
                <div style={{ maxWidth: "800px", width: "100%" }}>
                    <h4>הכנסות/הוצאות חודשיות</h4>
                    <Bar options={options} data={data2} />
                </div>

            </div>
            <h1>Reminder</h1>
            {
                reminders && (<ul>
                    {dispatchedDate.today[0] && <li>
                        <h4>Today</h4>
                        <ul><ReminderTasks perHour tasks={dispatchedDate.today} /></ul>

                    </li>
                    }
                    {
                        dispatchedDate.thisWeek[0] && <li> <h4>This Week</h4>
                            <ul><ReminderTasks tasks={dispatchedDate.thisWeek} /></ul>
                        </li>
                    }
                    {dispatchedDate.laterMore[0] && <li><h4>Later More</h4>
                        <ul><ReminderTasks tasks={dispatchedDate.laterMore} /></ul>
                    </li>
                    }
                </ul>)
            }

        </div>
    )
}
