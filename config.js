//config section
// 1. change jira url if using with different jira server
export const defaultJiraReportPrefix = "https://jiraeu.epam.com/secure/TimesheetReport.jspa?reportKey=jira-timesheet-plugin%3Areport&"

// 2. holidays
export const holidaysArray = [
    new Date(2021, 0, 1),
    new Date(2021, 0, 4),
    new Date(2021, 0, 5),
    new Date(2021, 0, 6),
    new Date(2021, 0, 7),
    new Date(2021, 0, 8),
    new Date(2021, 1, 23),
    new Date(2021, 2, 8),
    new Date(2021, 4, 3),
    new Date(2021, 4, 10),
    new Date(2021, 5, 14),
    new Date(2021, 10, 4),
    new Date(2021, 10, 5),
    new Date(2021, 11, 31),
    new Date(2022, 0, 3),
    new Date(2022, 0, 4),
    new Date(2022, 0, 5),
    new Date(2022, 0, 6),
    new Date(2022, 0, 7),
    new Date(2022, 1, 23),
    new Date(2022, 2, 8),
    new Date(2022, 4, 2),
    new Date(2022, 4, 3),
    new Date(2022, 4, 9),
    new Date(2022, 4, 12),
    new Date(2022, 4, 26),
    new Date(2022, 9, 14), //Mtskhetoba
    new Date(2022, 10, 23), //St. George
]
// 3.
/** @type {Map<string, {periods: {from: Date, to: Date, hoursPerDay: number}[], jiraFilterId: string, jiraReportPrefix:string}>} */
export const hoursPerDayPerWorkType = new Map([
    ["work", {
        jiraFilterId: "",
        jiraReportPrefix: "",
        periods: [
            {
                from: new Date("2022-09-28T00:00:00.000Z"),
                hoursPerDay: 0,
            },
            {
                from: "2022-10-17T00:00:00.000Z",
                hoursPerDay: 6,
            },
            {
                from: "2022-11-12T00:00:00.000Z",
                hoursPerDay: 8,
            },
            {
                from: "2022-11-23T00:00:00.000Z",
                hoursPerDay: 8,
            },
            {
                from: "2022-12-10T00:00:00.000Z",
                hoursPerDay: 9,
            },
            {
                from: "2023-02-10T00:00:00.000Z",
                hoursPerDay: 11,
            }

        ]

    }],
    ["N", {
        jiraFilterId: "",
        periods: [
            {
                from: new Date("2022-09-28T00:00:00.000Z"),
                hoursPerDay: 0,
            },
            {
                from: "2022-11-01T00:00:00.000Z",
                hoursPerDay: 3,
            }
        ]

    }]])


export const timePeriodsInDays = {
    dayAgo: {
        time: 1,
        showDetails: true
    },
    weekAgo: {
        time: 7,
        showDetails: false
    },
    monthAgo: {
        time: 30,
        showDetails: false
    },
}

//end of the config section