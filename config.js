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
    new Date(2021, 2, 12), // personal vacation
    new Date(2021, 4, 3),
    new Date(2021, 4, 5), // personal vacation
    new Date(2021, 4, 6), // personal vacation
    new Date(2021, 4, 7), // personal vacation
    new Date(2021, 4, 10),
    new Date(2021, 5, 14)
]
// 3.
/** @type {Map<string, {periods: {from: Date, to: Date, hoursPerDay: number}[], jiraFilterId: string, jiraReportPrefix:string}>} */
export const hoursPerDayPerWorkType = new Map([
    ["work", {
        jiraFilterId: "139801",
        jiraReportPrefix:"",
        periods: [
            {
                from: new Date("2021-06-01T00:00:00.000Z"),
                to: new Date("2021-07-12T00:00:00.000Z"),
                hoursPerDay: 3.5,
            },
            {
                from: "2021-07-12T00:00:00.000Z",
                to: "2025-07-12T00:00:00.000Z",
                hoursPerDay: 4.5,
            }
        ]
    }],
    ["edu", {
        jiraFilterId: "139802",
        periods: [
            {
                from: "2021-07-01T00:00:00.000Z",
                to: "2021-07-12T00:00:00.000Z",
                hoursPerDay: 0.2,
            },
            {
                from: "2021-07-12T00:00:00.000Z",
                to: "2025-07-12T00:00:00.000Z",
                hoursPerDay: 0.5,
            }
        ]

    }],
    ["home", {
        jiraReportPrefix: "https://lakunma.atlassian.net/plugins/servlet/ac/jira-timesheet-plugin/timereports#!",
        periods: [
            {
                from: "2021-07-17T00:00:00.000Z",
                to: "2031-07-12T00:00:00.000Z",
                hoursPerDay: 0.5,
            }
        ]
    }]]
)


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