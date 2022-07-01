export default function formatTimestampToDate(timestamp: number) {
    const pad = (n, s = 2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
    const d = new Date(timestamp * 1000);
    return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
