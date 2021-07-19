import {
    defaultJiraReportPrefix,
    holidaysArray,
    hoursPerDayPerWorkType,
    timePeriodsInDays
} from "./config.js";

const holidays = new Set(holidaysArray.map(r => r.getTime()))

function dateToString(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate()
    const year = date.getFullYear()

    return [year, month, day].join('-')
}


/**
 *
 * @param startTime {Date} start time
 * @param endTime {Date} end time
 * @param workTypeFilter {string} filter (must be created in Jira for that type of tasks)
 * @param showDetails {boolean} true/false of should we do a detailed table (with one row per log record, not a total per task)
 * @param jiraUrlPrefix {string}
 * @returns {string} jira url with a table
 */
function reportUrl(startTime, endTime, workTypeFilter, showDetails, jiraUrlPrefix) {
    return jiraUrlPrefix +
        "startDate=" + dateToString(startTime) +
        "&endDate=" + dateToString(endTime) +
        "&filterid=" + workTypeFilter +
        "&showDetails=" + showDetails
}

/**
 *
 * @param startDate {Date}
 * @param endDate {Date}
 * @param hoursPerDayPerPeriod {{to:Date, from:Date, hoursPerDay:number}[]}
 * @return {number} working hours for the period (holidays and weekends are not counted), the table of hours per period is respected
 */
function countNumberOfHours(startDate, endDate, hoursPerDayPerPeriod) {
    let totalHours = 0;
    const endDay = new Date(endDate.getTime());

    for (let curDay = new Date(startDate.getTime()); curDay <= endDay; curDay.setDate(curDay.getDate() + 1)) {

        if (holidays.has(curDay.getTime())) {
            continue;
        }

        const curWeekDay = curDay.getDay();

        if (!(curWeekDay !== 0 && curWeekDay !== 6)) {
            continue;
        }

        const hours = hoursForDate(curDay, hoursPerDayPerPeriod)
        totalHours += hours
    }

    return totalHours
}

/**
 *
 * @param date {Date}
 * @param hoursPerDayPerPeriod {{to:Date, from:Date, hoursPerDay:number}[]}
 * @return {number} working hours for the date, the table of hours per period is respected
 */
function hoursForDate(date, hoursPerDayPerPeriod) {
    for (let {from, to, hoursPerDay} of hoursPerDayPerPeriod) {
        const fromDate = new Date(from)
        const toDate = new Date(to)
        if (date >= fromDate && date < toDate)
            return hoursPerDay;
    }
    return 0;
}

/**
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {{to: Date, from: Date, hoursPerDay: number}[]} hoursPerDayPerPeriod
 * @param {string} jiraWorkTypeFilterId
 * @param {boolean} showDetails
 * @param {string} jiraTimeSheetReportUrlPrefix
 */
function createReportLink(startDate, endDate, hoursPerDayPerPeriod, jiraWorkTypeFilterId, showDetails, jiraTimeSheetReportUrlPrefix) {
    const link = document.createElement('a');
    const numberOfHours = countNumberOfHours(startDate, endDate, hoursPerDayPerPeriod)
    link.textContent = `${+numberOfHours.toFixed(2)}h`;
    link.href = reportUrl(startDate, endDate, jiraWorkTypeFilterId, showDetails, jiraTimeSheetReportUrlPrefix);

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
    for (let [workType, workTypeProps] of hoursPerDayPerWorkType.entries()) {
        let row = document.createElement("tr")
        let rowHeader = document.createElement("td")
        rowHeader.appendChild(document.createTextNode(workType))
        row.appendChild(rowHeader)
        const jiraTimeSheetReportUrlPrefix = workTypeProps["jiraReportPrefix"] || defaultJiraReportPrefix
        const periodsPerWorkType = workTypeProps["periods"]
        for (let [, periodProps] of Object.entries(timePeriodsInDays)) {
            let startDate = new Date(currentTime)
            const timePeriod = periodProps["time"]
            const showDetails = periodProps["showDetails"] || workType === "edu"
            startDate.setDate(currentTime.getDate() - timePeriod + 1)

            const reportLink = createReportLink(startDate, currentTime, periodsPerWorkType, workTypeProps["jiraFilterId"], showDetails, jiraTimeSheetReportUrlPrefix)
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