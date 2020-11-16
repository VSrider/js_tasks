(function() {

    /**
     * Константы селекторов
     */
    const invalidClass = 'is-invalid';
    const userNameId = 'name';
    const userLastNameId = 'lastname';
    const userBirthdayId = 'birthday';
    const userCityId = 'city';
    const FORM_GROUP_CLASSNAME = 'form-group';
    const FORM_ERROR_MESSAGE_CLASS = 'form-error-message';
    const addUserBtnId = 'add-user-btn'
    /**
     * Данные таблицы
     */
    const USERS = [];

    /**
     * Объект правил валидации
     */
    const CREDENTIALS = {
        name: {
            length: {
                maximum: 10,
                tooLong: '^Длина имени не может превышать 10 символов',
            }
        },
        lastname: {
            length: {
                maximum: 15,
                tooLong: '^Длина имени не может превышать 15 символов',
            }
        },
        birthday: {
            datetime: {
                dateOnly: true,
                latest: moment.utc().subtract(18, 'years'),
                earliest: moment.utc().subtract(120, 'years'),
                notValid: '^Дата некорректна',
                tooLate: '^Ваш возраст должен быть больше 18 лет',
                tooEarly: '^Вы слишком старый',
            }
        }
    }
    
    /**
     * Функция валидации введеных данных
     * @param {string} elementId 
     * @param {string} validationItem 
     */
    function validateInput(elementId, validationItem) {
        const element = $('#' + elementId);
        if(element) {
            const forCheckingObj = {};
            forCheckingObj[validationItem] = element.val();
            const validationResult = validate(forCheckingObj, CREDENTIALS);
            if(validationResult) {
                element.addClass(invalidClass);
                showError(element, validationResult[validationItem]);
            } else {
                element.removeClass(invalidClass);
                hideError(element);
            }
        }
    }

    /**
     * Обработчик события ввода имени
     */
    function onNameChanged() {
        validateInput(userNameId, 'name');
    }

    /**
     * Обработчик события ввода фамилии
     */
    function onLastnameChanged() {
        validateInput(userLastNameId, 'lastname');
    }

    /**
     * Обработчик события ввода даты рождения
     */
    function onBirthdayChanged() {
        validateInput(userBirthdayId, 'birthday')
    }

    /**
     * Функция отображающая элемент сообщающий об ошибке невалидной группы формы
     * @param {Element} element Элемент, значение которого не валидно
     * @param {string} message Сообщение об ошибке
     */
    function showError(element, message) {
        const parent = element.parent('.form-group');
        if(parent) {
            const errorEl = parent.find('.form-error-message');
            if(errorEl) {
                errorEl.removeClass('hidden')
                errorEl.text(message);
            }
        }
    }

    /**
     * Функция скрытия элемента сообщающего об ошибке
     * @param {Element} element Элемент, значение которого валидно
     */
    function hideError(element) {
        const parent = element.parent('.form-group');
        if(parent) {
            const errorEl = parent.find('.form-error-message');
            if(errorEl) {
                errorEl.addClass('hidden')
                errorEl.text('');
            }
        }
    }

    /**
     * Обработчик события добавления записи в таблицу
     * @param {object} event Объект события
     */
    function onAddUserBtnClicked(event) {
        event.preventDefault();
        let user = {
            name: $('#'+ userNameId).val(),
            lastname: $('#'+ userLastNameId).val(),
            birthday: $('#'+ userBirthdayId).val(),
            city: $('#'+ userCityId).val(),
        }
        USERS.push(user);
        $('#user-table').trigger('reloadGrid');
    }

    /**
     * Функция инициализации таблицы
     */
    function initUserTable() {
        let users = $('#user-table');
        users.jqGrid({
            data: USERS,
            styleUI: 'Bootstrap',
            datatype: 'local',
            colModel: [
                {
                    label: 'Имя',
                    name: 'name',
                    width: 100
                },{ 
                    label: 'Фамилия', 
                    name: 'lastname',
                    width: 150 
                },{ 
                    label: 'Дата рождения', 
                    name: 'birthday',
                    width: 200, 
                    formatter: 'date', 
                    formatoptions: { 
                        srcformat: 'd.m.Y' 
                    } 
                },{ 
                    label: 'Город', 
                    name: 'city', 
                    width: 150 
                },
            ],
            height: 350,
            width: 800,
            rowNum: 10,
            viewrecords: true,
            pager: '#user-table-pager',
            caption: 'Пользователи',
        }).navGrid('#user-table-pager', { edit: false, add: false, del: false });
        // users.jqGrid('delGridRow', rowId, {
        //     onclickSubmit: function(options, rowid) {
        //         USERS.slice(rowid, 1);
        //     },
        //     processing:true
        // })
    }

    /**
     * Функция инициализации выбора даты
     */
    function initDatePicker() {
        $('#'+ userBirthdayId).datepicker({
            format: "dd.mm.yyyy",
            todayHighlight: true,
            autoclose: true,
        }).on('changeDate', onBirthdayChanged);
    }

    /**
     * Функция настройки расширений для валидации
     */
    function initValidationOptions() {
        validate.extend(validate.validators.datetime, {
            parse: function(value, options) {
              return +moment.utc(value, 'DD.MM.YYYY');
            },
            format: function(value, options) {
              var format = options.dateOnly ? "DD.MM.YYYY" : "DD.MM.YYYY hh:mm:ss";
              return moment.utc(value).format(format);
            }
        });
    }

    /**
     * Обработчик события загрузки контента страницы 
     */
    function onDocumentLoad() {
        $('#' + userNameId).bind('input', onNameChanged);
        $('#' + userLastNameId).bind('input', onLastnameChanged);
        $('#' + userBirthdayId).bind('input', onBirthdayChanged);
        $('#' + addUserBtnId).bind('click', onAddUserBtnClicked);
        
        initValidationOptions();
        initDatePicker();
        initUserTable();   
    }

    
    //подписка на сабытие загрузки контента страницы
    $(document).ready(onDocumentLoad);
})()


