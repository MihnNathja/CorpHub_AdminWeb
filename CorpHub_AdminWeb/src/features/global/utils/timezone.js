export function toLocal(date) {
    const d = new Date(date); // đảm bảo luôn là Date object
    const offset = d.getTimezoneOffset() * 60000; // phút -> ms
    return new Date(d.getTime() - offset);
}

export function toUtc(date) {
    const d = new Date(date);
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() + offset);
}
