//config section
// 1. change jira url if using with different jira server
const jiraServer="https://jiraeu.epam.com"

// 2. holidays
const holidaysArray = [
    new Date(2021, 0, 1),
    new Date(2021, 0, 4),
    new Date(2021, 0, 5),
    new Date(2021, 0, 6),
    new Date(2021, 0, 7),
    new Date(2021, 0, 8),
    new Date(2021, 1, 23),
    new Date(2021, 2, 8)
]
// 3.
const hoursPerDay = 8

//end of the config section
const jiraUrlPrefix = `${jiraServer}/secure/TimesheetReport.jspa?reportKey=jira-timesheet-plugin%3Areport`
const holidays = new Set(holidaysArray.map(r => r.getTime()))

function dateToString(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate()
    const year = date.getFullYear()

    return [year, month, day].join('-')
}


function monthAgoPeriod() {
    const currentTime = new Date()
    const monthAgo = new Date(currentTime)
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    monthAgo.setDate(monthAgo.getDate() + 1)

    return [currentTime, monthAgo]
}

/**
 *
 * @param startTime
 * @param endTime
 * @returns {string}
 */
function reportUrl(startTime, endTime) {
    return jiraUrlPrefix + "&startDate=" + dateToString(startTime) + "&endDate=" + dateToString(endTime)
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

function createReportLink(name, startDate, endDate) {
    const link = document.createElement('a');
    const numberOfHours = countNumberOfHours(startDate, endDate) * hoursPerDay
    link.textContent = `${name} (${numberOfHours}h)`;
    link.href = reportUrl(startDate, endDate);

    return link
}

function writeReportUrls() {
    const [currentTime, monthAgoTime] = monthAgoPeriod();
    const weekAgoTime = new Date(currentTime);weekAgoTime.setDate(currentTime.getDate() - 6);

    const placeHolder = document.getElementById('where_to_insert')

    const lastWeekReportLink = createReportLink("Last week", weekAgoTime, currentTime)
    placeHolder.appendChild(lastWeekReportLink);
    placeHolder.appendChild(document.createElement('div'))


    const lastMonthReportLink = createReportLink("Last month", monthAgoTime, currentTime)
    placeHolder.appendChild(lastMonthReportLink);
}

window.onload = writeReportUrls