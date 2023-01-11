export const getStartEndTotal = (page:number, perPage:number, length:number) => {
    const total = length / perPage;
    const startIndex = page * perPage - perPage;
    const endIndex = page * perPage
    return {startIndex, endIndex, total}
};

export function capitalizeFirstLetter(str:string):string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}