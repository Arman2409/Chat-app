export const getStartEndTotal = (page:number, perPage:number, length:number) => {
    const total = Math.ceil(length / perPage) * 10;
    const startIndex = page * perPage - perPage;
    const endIndex = page * perPage
    return {startIndex, endIndex, total}
};

export function capitalizeFirstLetter(str:string):string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}