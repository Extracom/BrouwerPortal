export const groupBy = (array, key) => {
    return array.reduce((result, currentItem) => {
        (result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem);
        return result;
    }, {});
}

export const groupByWithParent = (array, key) => {
    
    const groupedData = {};
    array.forEach(item => {
        const keyValue = item[key];
        if (!groupedData[keyValue]) {
            groupedData[keyValue] = {
                parent: item,
                children: []
            };
        } else {
            groupedData[keyValue].children.push(item);
        }
    })
    return Object.values(groupedData);
}