export const SESSION_PROJECT_NAME_BASE = 'pname'
export const SESSION_COUNT_BASE = 'count'
export const SESSION_HOURLY_NOTIFICATION_BASE = 'hourly_sound'

/** Calculates total seconds from a timestamp shaped "HH:mm:ss"
 *  where seconds and minutes need to be less than 60
 */
export const toSecondsFromDuration = (duration) => {
        const [hours, minutes, seconds] = duration.split(':')
        const totalSeconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
        return (totalSeconds)
}

       
const padify = (number) => String(number).padStart(2, '0')
export const toTimeString = (s) => `${padify(~~(s / 3600))}:${padify(~~((s % 3600) / 60))}:${padify(s % 60)}`
