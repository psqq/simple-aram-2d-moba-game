
export default class Utils {
    static async loadJsonFile(filename) {
        var res = await fetch(filename);
        return await res.json();
    }
}
