import {defaultJiraReportPrefix, holidaysArray, hoursPerDayPerWorkType, timePeriodsInDays} from "./config.js";
import {personalDayOff} from "./personal_day_off.js";

const daysOffAsDates = new Set([...holidaysArray, ...personalDayOff])
const daysOff = new Set([...daysOffAsDates].map(r => toNumberOfDaysSinceEpoch(r)))

/**
 *
 * @param date {Date}
 * @return {number} number of days since epoch
 */
function toNumberOfDaysSinceEpoch(date) {
    const year2021 = new Date(2021, 0, 0)
    return Math.floor((date - year2021) / 8.64e7)
}

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
 * @param hoursPerDayPerPeriod {{from:Date, hoursPerDay:number}[]}
 * @return {number} working hours for the period (holidays and weekends are not counted), the table of hours per period is respected
 */
function countNumberOfHours(startDate, endDate, hoursPerDayPerPeriod) {
    let totalHours = 0;
    const endDay = new Date(endDate.getTime());

    for (let curDay = new Date(startDate.getTime()); curDay <= endDay; curDay.setDate(curDay.getDate() + 1)) {
        const fullDaysSinceEpoch = toNumberOfDaysSinceEpoch(curDay)
        if (daysOff.has(fullDaysSinceEpoch)) {
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
 * @param dateTime {Date}
 * @param hoursPerDayPerPeriod {{from:Date, hoursPerDay:number}[]}
 * @return {number} working hours for the date, the table of hours per period is respected
 */
function hoursForDate(dateTime, hoursPerDayPerPeriod) {
    let datePairs = toWindows(hoursPerDayPerPeriod, 2)
    let nextMidnight = new Date(dateTime.getTime())
    nextMidnight.setDate(dateTime.getDate() + 1)
    nextMidnight.setHours(0, 0, 0, 0)

    // check for out of range
    // before the range always 0, after the range it's always last point
    // after the last point the func is const, equals to the last point
    if (hoursPerDayPerPeriod.length > 0) {
        let firstDate = hoursPerDayPerPeriod[0].from
        let lastDate = hoursPerDayPerPeriod[hoursPerDayPerPeriod.length - 1].from
        if (nextMidnight < firstDate)
            return 0;
        if (nextMidnight > lastDate)
            return hoursPerDayPerPeriod[hoursPerDayPerPeriod.length - 1].hoursPerDay;
    }

    for (let [{from: from, hoursPerDay: fromHours}, {from: to, hoursPerDay: toHours}] of datePairs) {
        const fromDate = new Date(from)
        const toDate = new Date(to)
        if (nextMidnight >= fromDate && nextMidnight <= toDate) {
            //linear interpolation in-between points
            let inBetweenRatio = (nextMidnight - fromDate) / (toDate - fromDate)
            return fromHours * (1 - inBetweenRatio) + toHours * inBetweenRatio
        }
    }

    // in case of empty array, it is zero
    return 0;
}

function* windowGenerator(inputArray, size) {
    for (let index = 0; index + size <= inputArray.length; index++) {
        yield inputArray.slice(index, index + size);
    }
}

function toWindows(inputArray, size) {
    //compute the entire sequence of windows into an array
    return Array.from(windowGenerator(inputArray, size))
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

    //add the table header
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
        // for each row
        let row = document.createElement("tr")
        let rowHeader = document.createElement("td")
        rowHeader.appendChild(document.createTextNode(workType))
        row.appendChild(rowHeader)
        const jiraTimeSheetReportUrlPrefix = workTypeProps["jiraReportPrefix"] || defaultJiraReportPrefix
        const periodsPerWorkType = workTypeProps["periods"]
        for (let [, periodProps] of Object.entries(timePeriodsInDays)) {
            // for each cell
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