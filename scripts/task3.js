
(function () {
    
    /**
     * Функция ввывода на консоль группы(массива) данных
     * @param {object[]} arr Массив объектов
     * @param {string} groupName Имя группы
     */
    function displayData(arr, groupName) {
        if (arr instanceof Array && 
            console && 
            console.log && 
            console.group && 
            console.groupEnd) {
                
            console.group(groupName);
            console.log(result);
            for(let i = 0; i < arr.length; i++) {
                console.log('ID: %d | Имя: %s | Тип: %d', arr[i].id, arr[i].name, arr[i].type);
            }
            console.groupEnd(groupName);
        }
    }

    /**
     * Функция добавления недостающих элементов в массив
     * @param {object[]} arr Массив объектов
     */
    function addLostItems(arr) {
        if (arr instanceof Array && arr.length > 1) {
            arr.sort(function (a, b) { return a.id - b.id });
            for (let i = 1; i < arr.length; i++) {
                if (arr[i].id - arr[i - 1].id > 1) {
                    arr.splice(i, 0, {
                        id: arr[i - 1].id + 1
                    });
                }
            }
        }
    }

    Study.GetData(function (arr) {
        //Сортировка по возрастанию ID
        let sortedByIdArr = arr.sort(function (a, b) { return a.id - b.id });
        displayData(sortedByIdArr, 'Элементы сортированные по ID');

        //Сортировка по возрастанию Типа и по убыванию ID  
        let sortedByIdAndTypeArr = arr.sort(function (a, b) {
            return a.type - b.type || b.id - a.id;
        });
        displayData(sortedByIdAndTypeArr, 'Элементы сортированные по возрастанию Типа и по убыванию ID');

        //Выборка данных с Типом равным 2
        let type2Items = arr.filter(function (i) { return i.type == 2 });
        displayData(type2Items, 'Элементы с Типом 2');

        //Выборка объектов с именем
        let hasNameItems = arr.filter(function (i) { return !!i.name });
        displayData(hasNameItems, 'Элементы у которых есть имя');

        //Выборка объектов вне диапазона [3,5]
        let withoutRangeItems = arr.filter(function (i) { return i.id < 3 || i.id > 5 });
        displayData(withoutRangeItems, 'Без элементов с ID в диапазоне [3,5]');

        //Добавление недостающих элементов и сортировка по убыванию ID
        addLostItems(arr);
        let withLostItemsDesc = arr.sort(function (a, b) { return b.id - a.id });
        displayData(withLostItemsDesc, 'С восстановленными элементами');
    });
})();