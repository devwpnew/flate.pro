export function printDateFormatted(date, timezone){
    return new Date(date).toLocaleDateString(timezone)
}

export function dateDiffInDays(date){
    const now = new Date();
    const dateObj = new Date(date)
    const diff = now - dateObj;
    return parseInt(diff / (1000 * 60 * 60 * 24));
}

export function dateDiffInHours(date){
    const now = new Date();
    const dateObj = new Date(date)
    const diff = now - dateObj;
    return parseInt(diff / (1000 * 60 * 60));
}

export function dateDiffInMinutes (date) {
    const now = new Date();
    const dateObj = new Date(date)
    const diff = now - dateObj;
    return parseInt(diff / (1000 * 60) )
}