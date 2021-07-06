//config section
// 1. change jira url if using with different jira server
const jiraServer = "https://jiraeu.epam.com"

// 2. holidays
const holidaysArray = [
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
const hoursPerDayPerWorkType = {
    work: {
        hoursPerDay: 3.5,
        jiraFilterId: "139801"
    },
    edu: {
        hoursPerDay: 0.2,
        jiraFilterId: "139802"
    }
}

const timePeriodsInDays = {
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
const jiraUrlPrefix = `${jiraServer}/secure/TimesheetReport.jspa?reportKey=jira-timesheet-plugin%3Areport`
const holidays = new Set(holidaysArray.map(r => r.getTime()))

function dateToString(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate()
    const year = date.getFullYear()

    return [year, month, day].join('-')
}


/**
 *
 * @param startTime start time
 * @param endTime end time
 * @param workTypeFilter filter (must be created in Jira for that type of tasks)
 * @param showDetails true/false of should we do a detailed table (with one row per log record, not a total per task)
 * @returns {string} jira url with a table
 */
function reportUrl(startTime, endTime, workTypeFilter, showDetails) {
    return jiraUrlPrefix +
        "&startDate=" + dateToString(startTime) +
        "&endDate=" + dateToString(endTime) +
        "&filterid=" + workTypeFilter +
        "&showDetails=" + showDetails
}

/**
 *
 * @param startDate {Date}
 * @param endDate {Date}
 */
function countNumberOfHours(startDate, endDate) {
    let numberOfDays = 0;
    const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    for (let curDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()); curDay <= endDay; curDay.setDate(curDay.getDate() + 1)) {

        if (holidays.has(curDay.getTime())) {
            continue;
        }

        const curWeekDay = curDay.getDay();


        if (curWeekDay !== 0 && curWeekDay !== 6)
            if (curDay.getDay())
                numberOfDays++;
    }

    return numberOfDays
}

function createReportLink(startDate, endDate, hoursPerDay, jiraWorkTypeFilterId, showDetails) {
    const link = document.createElement('a');
    const numberOfHours = countNumberOfHours(startDate, endDate) * hoursPerDay
    link.textContent = `${+numberOfHours.toFixed(2)}h`;
    link.href = reportUrl(startDate, endDate, jiraWorkTypeFilterId, showDetails);

    return link
}


function writeReportUrls() {
    // get the reference for the body
    const currentTime = new Date();
    let body = document.getElementsByTagName("body")[0];

    // creates a <table> element and a <tbody> element
    let tbl = document.createElement("table");
    let tblBody = document.createElement("tbody");

    //add header
    let headerRow = document.createElement("tr")
    headerRow.appendChild(document.createElement("td"))
    for (let [periodName] of Object.entries(timePeriodsInDays)) {
        let colHeader = document.createElement("td")
        colHeader.appendChild(document.createTextNode(periodName))
        headerRow.appendChild(colHeader)
    }
    tblBody.appendChild(headerRow);

    //add body of the table
    for (let [workType, workTypeProps] of Object.entries(hoursPerDayPerWorkType)) {
        let row = document.createElement("tr")
        let rowHeader = document.createElement("td")
        rowHeader.appendChild(document.createTextNode(workType))
        row.appendChild(rowHeader)
        for (let [, periodProps] of Object.entries(timePeriodsInDays)) {
            let startDate = new Date(currentTime)
            const timePeriod = periodProps["time"]
            const showDetails = periodProps["showDetails"] || workType === "edu"
            startDate.setDate(currentTime.getDate() - timePeriod)
            const reportLink = createReportLink(startDate, currentTime, workTypeProps["hoursPerDay"], workTypeProps["jiraFilterId"], showDetails)
            let cell = document.createElement("td")
            cell.appendChild(reportLink);
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
    }


    tbl.appendChild(tblBody);

    body.appendChild(tbl);


}


window.onload = writeReportUrls