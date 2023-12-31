export default function knapsackGreedy(items, numItems, maxWeight) {
    let errorMessage = "";
    if (items.length !== numItems) {
        errorMessage += "Number of items does not match the number of items specified in the file header.\n";
    }
    const sack = [];
    items.sort((a, b) => {
        return b[0] - a[0];
    }); // sort the items by value in descending order (greedy)
    const itemIndexesMap = new Map();
    let totalValue = 0;
    let totalWeight = 0;
    let i = 0;
    while (totalWeight < maxWeight && i < items.length) {
        if(totalWeight + items[i][1] <= maxWeight){
            totalValue += items[i][0];
            totalWeight += items[i][1];
            itemIndexesMap.set(items[i][2], 1);
            sack.push(items[i][2]);
            i++;
        } else {
            itemIndexesMap.set(items[i][2], 0);
            i++;
        }
    }

    var sackedItems = "";
    for (let i = 0; i < numItems; i++) {
        let value = itemIndexesMap.get(i);
        if(value === undefined) value = 0;
        sackedItems += `${value} `;
    }
    return { totalValue , sackedItems, items, errorMessage};
}