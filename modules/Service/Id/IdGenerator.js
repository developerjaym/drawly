export default function IDGenerator() {
    // return crypto.randomUUID();
    return Math.floor(Math.random() * 1_000_000);
}