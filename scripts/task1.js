(function() {

    const invalidClass = 'is-invalid';
    const userNameId = 'name';
    const userLastnameId = 'lastname';
    const userBirthdayDayId = 'day';
    const userBirthdayMonthId = 'month';
    const userBirthdayYearId = 'year';
    
    /**
     * Функция проверки нахождения длины строки в заданном диапазоне
     * @param {string} string Строка для проверки
     * @param {number} minCount Mинимальное количество символов в строке
     * @param {number} maxCount Mаксимальное количество символов в строке
     * @return {boolean} 
     * Возвращает true если строка находится в заданном диапазоне, 
     * false если не валидна или не верно заданны параметры
     */
    function validateStringLength(string, minCount, maxCount) {
        return typeof string === 'string' &&
               !isNaN(minCount) && 
               !isNaN(maxCount) && 
               minCount >= 0 &&
               minCount <= maxCount &&
               maxCount > 0 &&
               string.length >= minCount && 
               string.length <= maxCount;
    }

    /**
     * Функция проверки даты рождения
     * @param {number} day День
     * @param {number} month Месяц
     * @param {number} year Год
     * @return {boolean} 
     * Возвращает true если дата корректна,
     * false если параметрами функции являются не числа, либо такой даты не может быть
     */
    function validateBirthday(day, month, year) {
        if (!isNaN(day) &&
            !isNaN(month) &&
            !isNaN(year)) {

            const date = new Date(year, month, day);
            
            return date.getDate() == day && 
                   date.getMonth() == month &&
                   date.getFullYear() == year;
        } 
        return false;
    }

    /**
     * Обработчик события ввода имени
     */
    function onNameChanged() {
        let name = document.getElementById(userNameId);

        if (name) {
            if (!validateStringLength(name.value, 0, 10)) {
                attachClasses([name], [invalidClass]);
                showError(name, "Количество символов превышает 10");
            } else {
                detachClasses([name], [invalidClass]);
                hideError(name);
            }
        }
    }

    /**
     * Обработчик события ввода фамилии
     */
    function onLastnameChanged() {
        let lastname = document.getElementById(userLastnameId);

        if (lastname) {
            if (!validateStringLength(lastname.value, 0, 15)) {
                attachClasses([lastname], [invalidClass]);
                showError(lastname, "Количество символов превышает 15");
            } else {
                detachClasses([lastname], [invalidClass]);
                hideError(lastname);
            }
        }
    }

    /**
     * Обработчик события ввода даты рождения
     */
    function onBirthdayChanged() {
        let day = document.getElementById(userBirthdayDayId);
        let month = document.getElementById(userBirthdayMonthId);
        let year = document.getElementById(userBirthdayYearId);

        if (day && month && year &&
            day.value && month.value && year.value) {
            if (!validateBirthday(+day.value, +month.value-1, +year.value)) {
                attachClasses([day, month, year], [invalidClass]);
                showError(day, "Дата некорректна");
            } else {
                detachClasses([day, month, year], [invalidClass]);
                hideError(day);
            }
        }
    }

    /**
     * Функция поиска родителького элемента по названию класса
     * @param {Element} node Дочерний элемент
     * @param {string} className Название класса родительского элемента
     * @return {Element} Родительский элемент
     */
    function getParentByClassName(node, className) {
        if(node instanceof Element && typeof className === 'string') {
            const parent = node.parentElement;
            if(parent) {
                if(parent.classList && parent.classList.contains(className)) {
                    return parent;
                } else {
                    return getParentByClassName(parent, className);
                }
            }
        }
        return undefined;
    }

    /**
     * Функция отображающая элемент сообщающий об ошибке невалидной группы формы
     * @param {Element} element Элемент, значение которого не валидно
     * @param {string} message Сообщение об ошибке
     */
    function showError(element, message) {
        if(element instanceof Element && typeof message === 'string') {
            const parent = getParentByClassName(element, 'form-group');
            if(parent) {
                const errorEl = parent.getElementsByClassName('form-error-message')[0];
                if(errorEl) {
                    errorEl.classList.remove('hidden')
                    errorEl.innerHTML = message;
                }
            }
        }
    }

    /**
     * Функция скрытия элемента сообщающего об ошибке
     * @param {Element} element Элемент, значение которого валидно
     */
    function hideError(element) {
        if(element instanceof Element) {
            const parent = getParentByClassName(element, 'form-group');
            if(parent) {
                const errorEl = parent.getElementsByClassName('form-error-message')[0];
                if(errorEl) {
                    errorEl.classList.add('hidden');
                    errorEl.innerHTML = '';
                }
            }
        }
    }

    /**
     * Функция добавления классов элементам
     * @param {Element[]} elements Элементы дерева DOM
     * @param {string[]} classes Классы
     */
    function attachClasses(elements, classes) {
        if (isNotEmptyArray(elements) &&
            isNotEmptyArray(classes)) {
            elements.forEach(function(element) {
                if (element instanceof Element) {
                    classes.forEach(function(className) {
                        if (typeof className === 'string') {
                            element.classList.add(className);
                        }
                    })
                }
            });
        }
    }

    /**
     * Функция проверки заполненности массива
     * @param {Array} array Массив
     * @return {boolean} 
     * Возвращает true если в массиве есть минимум 1 элемент,
     * false если массив пуст 
     */
    function isNotEmptyArray(array) {
        return array instanceof Array && array.length > 0;
    }

    /**
     * Функция удаления классов элементов 
     * @param {Element[]} elements Элементы DOM дерева
     * @param {string} classes Классы
     */
    function detachClasses(elements, classes) {
        if (isNotEmptyArray(elements) &&
            isNotEmptyArray(classes)) {
            elements.forEach(function(element) {
                if (element instanceof Element) {
                    classes.forEach(function(className) {
                        if (typeof className === 'string') {
                            element.classList.remove(className);
                        }
                    })
                }
            });
        }
    }

    /**
     * Функция подписывающая обработчик на событие нескольких элементов 
     * @param {string} eventName 
     * @param {function} handler 
     * @param {object} elements 
     */
    function subscribe(eventName, handler, elements) {
        if (elements instanceof Array && 
            typeof eventName === 'string' &&
            typeof handler === 'function') {
            
            for(let i = 0; i < elements.length; i++) {
                if (elements[i] && elements[i].addEventListener) {
                    elements[i].addEventListener(eventName, handler);
                }
            }
        }
    }

    /**
     * Обработчик события загрузки контента страницы 
     */
    function onDocumentLoad() {
        subscribe('input', onNameChanged, [document.getElementById(userNameId)]);
        subscribe('input', onLastnameChanged, [document.getElementById(userLastnameId)]);
        subscribe('input', onBirthdayChanged, [document.getElementById(userBirthdayDayId), 
                                               document.getElementById(userBirthdayMonthId), 
                                               document.getElementById(userBirthdayYearId)]);
        onNameChanged();
        onLastnameChanged();
        onBirthdayChanged();
    }

    
    //подписка на сабытие загрузки контента страницы
    subscribe('DOMContentLoaded', onDocumentLoad, [document]);
})()


