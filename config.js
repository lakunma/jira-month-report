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
    new Date(2022, 2, 8)
]
// 3.
/** @type {Map<string, {periods: {from: Date, to: Date, hoursPerDay: number}[], jiraFilterId: string, jiraReportPrefix:string}>} */
export const hoursPerDayPerWorkType = new Map([
    ["work", {
        jiraFilterId: "",
        jiraReportPrefix: "",
        periods: [
            {
                from: new Date("2021-06-01T00:00:00.000Z"),
                to: new Date("2021-07-12T00:00:00.000Z"),
                hoursPerDay: 3.5,
            },
            {
                from: "2021-07-12T00:00:00.000Z",
                to: "2021-07-18T00:00:00.000Z",
                hoursPerDay: 4.5,
            },
            {
                from: "2021-07-18T00:00:00.000Z",
                to: "2021-08-07T00:00:00.000Z",
                hoursPerDay: 4,
            },
            {
                from: "2021-08-07T00:00:00.000Z",
                to: "2021-08-14T00:00:00.000Z",
                hoursPerDay: 3.75,
            },
            {
                from: "2021-08-14T00:00:00.000Z",
                to: "2021-08-21T00:00:00.000Z",
                hoursPerDay: 3.5,
            },
            {
                from: "2021-08-21T00:00:00.000Z",
                to: "2021-09-01T00:00:00.000Z",
                hoursPerDay: 3.25,
            },
            {
                from: "2021-09-01T00:00:00.000Z",
                to: "2021-10-04T00:00:00.000Z",
                hoursPerDay: 3,
            },
            {
                from: "2021-10-04T00:00:00.000Z",
                to: "2021-10-11T00:00:00.000Z",
                hoursPerDay: 3.5,
                description: "Now including edu inside (filter is off)"
            },
            {
                from: "2021-10-11T00:00:00.000Z",
                to: "2021-11-11T00:00:00.000Z",
                hoursPerDay: 4,
                description: "Now including home inside (filter is off)"
            },
            {
                from: "2021-11-11T00:00:00.000Z",
                to: "2022-03-01T00:00:00.000Z",
                hoursPerDay: 4.5,
                description: "Now including sport inside (filter is off)"
            },
            {
                from: "2022-03-01T00:00:00.000Z",
                to: "2031-01-01T00:00:00.000Z",
                hoursPerDay: 5.1,
                description: "Now including sport/edu/home x2"
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
                to: "2022-03-01T00:00:00.000Z",
                hoursPerDay: 0.5,
            },
            {
                from: "2022-03-01T00:00:00.000Z",
                to: "2025-07-12T00:00:00.000Z",
                hoursPerDay: 0.7,
            }
        ]

    }],
    ["home", {
        jiraReportPrefix: "https://lakunma.atlassian.net/plugins/servlet/ac/jira-timesheet-plugin/timereports#!",
        periods: [
            {
                from: "2021-07-17T00:00:00.000Z",
                to: "2022-03-01T00:00:00.000Z",
                hoursPerDay: 0.5,
            },
            {
                from: "2022-03-01T00:00:00.000Z",
                to: "2022-03-20T00:00:00.000Z",
                hoursPerDay: 0.7,
            },
            {
                from: "2022-03-20T00:00:00.000Z",
                to: "2031-07-12T00:00:00.000Z",
                hoursPerDay: 1.7,
            }
        ]
    }],
    ["sw_help", {
        jiraReportPrefix: "https://lakunma.atlassian.net/plugins/servlet/ac/jira-timesheet-plugin/timereports#!",
        periods: [
            {
                from: "2022-03-20T00:00:00.000Z",
                to: "2031-07-12T00:00:00.000Z",
                hoursPerDay: 0.2,
            }
        ]
    }],
    ["sport", {
        jiraReportPrefix: "https://lakunma.atlassian.net/plugins/servlet/ac/jira-timesheet-plugin/timereports#!",
        periods: [
            {
                from: "2021-11-11T00:00:00.000Z",
                to: "2022-03-01T00:00:00.000Z",
                hoursPerDay: 0.5,
            },
            {
                from: "2022-03-01T00:00:00.000Z",
                to: "2031-07-12T00:00:00.000Z",
                hoursPerDay: 0.7,
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