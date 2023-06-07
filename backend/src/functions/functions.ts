export const getStartEnd = (page:number, perPage:number) => {
    const startIndex = page * perPage - perPage;
    const endIndex = page * perPage;
    return {startIndex, endIndex}
};

export const capitalizeFirstLetter = (str:string):string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const sortByActivesFirst = (data:any[]):any[] => {
    return data.sort((first:any) => {
        if(first.active) {
            return -1;
        }
        return 1;
    });
};