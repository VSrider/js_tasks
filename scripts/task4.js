(function(){
    /**
     * Константы селекторов элементов
     */
    const payerNameElId = '#payername';
    const payerTypeElId = '#payertype';
    const vatElId = '#vat';
    const tinElId = '#tin';
    const phoneElId = '#phone';
    const legalEntityElId = '#legal-entity';
    const paymentAmountElId = '#payment-amount';
    const summaryElId = '#summary';
    const stsElId = '#sts';

    /**
     * Данные типов плательщика
     */
    const payerTypes = [
        {
            key: 'LP',
            caption: 'Юредическое лицо',
            vat: 17,
            tinLength: 10,
        }, 
        { 
            key: 'NP',
            caption: 'Физическое лицо',
            vat: 13,
            tinLength: 12,
        }
    ];

    /**
     * Типы юредических лиц
     */
    const legalEntities = [
        {
            key: 'ООО',
            caption: 'ООО'
        }, 
        {
            key: 'ОАО',
            caption: 'ОАО'
        }, 
        {
            key: 'ЗАО',
            caption: 'ЗАО'
        }, 
        {
            key: 'ИП',
            caption: 'ИП'
        }
    ];

    /**
     * Состояние формы
     */
    const form = {
        payerName: null,
        phone: null,
        payerType: null,
        tin: null,
        vat: null,
        legalEntity: null,
        paymentAmount: null,
        sts: null,
        summary: null,
        isValid: false,
    };

    /**
     * Обект конфигурации валидации
     */
    const credentials = {
        payerType: {
            inclusion: payerTypes.map(function(i) {
                return i.key;
            }),
        },
        phoneNumber: {
            format: {
                pattern: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
                message: '^Некоректно введен номер телефона',
            },
        },
        paymentAmount: {
            numericality : {
                greaterThan: 0,
                notValid: '^Значение должно числовым',
                notGreaterThen: '^Значение должно быть больше нуля'
            },
            format: {
                pattern: /^\d+.?\d?\d?/,
                message: '^Некоректно введена сумма. Формат суммы должен соответствовать 0.00',
            }
        },
        lptin: {
            numericality : {
                onlyInteger: true,
                notValid: '^Введеные значания должны быть только цифрами',
                notInteger: '^Введеные значания должны быть только цифрами',
            },
            length: {
                is: payerTypes[0].tinLength,
                notValid: '^ИНН должен состоять из 12 цифр',
                wrongLength: '^ИНН должен состоять из 12 цифр',
            }
        },
        nptin: {
            numericality : {
                onlyInteger: true,
                notValid: '^Введеные значания должны быть только цифрами',
                notInteger: '^Введеные значания должны быть только цифрами',
            },
            length: {
                is: payerTypes[1].tinLength,
                notValid: '^ИНН должен состоять из 12 цифр',
                wrongLength: '^ИНН должен состоять из 12 цифр',
            }
        },
        legalEntity: {
            inclusion: legalEntities.map(function (i) {
                return i.key;
            }),
        }
    }

    /**
     * Функция отображения ошибки
     * @param {string} elementId 
     * @param {string} message 
     */
    function showError(elementId, message) {
        const error = $(elementId).closest('.form-group').find('.error');
        error.text(message).removeClass('hidden');
    }

    /**
     * Функция скрытия ошибки
     * @param {string} elementId 
     */
    function hideError(elementId) {
        const error = $(elementId).closest('.form-group').find('.error');
        error.text('').addClass('hidden');
    }

    /**
     * Функция обновления состояния ИНН
     * @param {string[]} errorMessages Сообщения об ошибках
     */
    function updateTin(errorMessages) {
        const tin = $(tinElId);
        if(form.sts && form.payerType === 'LP') {
            tin.val('');
            tin.prop('disabled', true);
            hideError(tinElId);
        } else {
            tin.prop('disabled', false);
            if(form.tin && errorMessages && errorMessages[0]) {
                showError(tinElId, errorMessages[0])
            } else {
                hideError(tinElId);
            }
        }
    }

    /**
     * Функция обновления состояния НДС
     */
    function updateVat() {
        const payerType = payerTypes.filter(function(item) {
            return item.key === form.payerType;
        })[0];
        if(payerType) {
            form.vat = payerType.vat;
        }
        $(vatElId).val(form.vat);
    }

    /**
     * Функция обновления состояния УСН
     */
    function updateSts() {
        if(form.payerType === 'LP') {
            $(stsElId).closest('.sts-blk').show();
            $(legalEntityElId).closest('.legal-entity-form-blk').show();
        } else {
            form.sts = false;
            $(stsElId).prop('checked', false);
            $(stsElId).closest('.sts-blk').hide();
            $(legalEntityElId).closest('.legal-entity-form-blk').hide();
        }
    }

    /**
     * Функция обновления номера телефона
     * @param {string[]} errorMessages Сообщения об ошибках
     */
    function updatePhoneNumber(errorMessages) {
        if(form.phone && errorMessages && errorMessages[0]) {
            showError(phoneElId, errorMessages[0]);
        } else {
            hideError(phoneElId);
        }

    }

    /**
     * Функция обновления состояния формы юредического лица
     */
    function updateLegalEntity() {
        if(form.propType === 'NP') {
            form.legalEntity = null;
        }
    }

    /**
     * Функция обновления суммы платежа
     * @param {string[]} errorMessages Сообщения об ошибках
     */
    function updatePaymentAmount(errorMessages) {
        if(form.paymentAmount && errorMessages && errorMessages[0]) {
            showError(paymentAmountElId, errorMessages[0]);
        } else {
            hideError(paymentAmountElId);
        }
    }

    /**
     * Функция обновления кнопки оплаты
     * @param {boolean} isValid Являются ли поля формы валидными
     */
    function updatePayBtn(isValid) {
        if(isValid) {
            $('#payBtn').prop('disabled', false);
        } else {
            $('#payBtn').prop('disabled', true);
        }
    }

    /**
     * Функция обновления итоговой суммы 
     */
    function updateSummary() {
        let summary = form.paymentAmount * (1 + form.vat/100);
        if(!isNaN(summary)) {
            $(summaryElId).text(summary.toFixed(2));
        }
    }

    /**
     * Функция обновления формы
     */
    function updateForm() {
        const validationResult = validateForm();
        updateVat();
        updateSts();
        updateSummary();
        if (validationResult) {
            updatePhoneNumber(validationResult.phoneNumber);
            updateLegalEntity(validationResult.legalEntity);
            const tinProp = form.payerType === 'LP' ? 'lptin' : 'nptin';
            updateTin(validationResult[tinProp]);
            updatePaymentAmount(validationResult.paymentAmount);    
        } else {
            updatePhoneNumber();
            updateLegalEntity();
            updateTin();
            updatePaymentAmount();   
        }
        updatePayBtn(!validationResult);
    }

    /**
     * Функция проверки введеных данных
     */
    function validateForm() {
        var checkingValues = {
            phoneNumber: form.phone,
            payerName: form.payerName,
            paymentAmount: form.paymentAmount,
        };
        if (form.payerType == 'LP') {
            if(!form.sts) {
                checkingValues.lptin = form.tin;
            }
            checkingValues.legalEntity = form.legalEntity;
        } else if (form.payerType == 'NP') {
            checkingValues.nptin = form.tin;
        }
        return validate(checkingValues, credentials);
    }


    /**
     * Генератор функций обработчиков событий ввода
     * @param {String} formProperty Свойство объекта состояния form
     * @param {String} targetProperty Свойство элемента значение которого будет сохраняться
     */
    function updateState(formProperty, targetProperty) {
        return function(event) {
            form[formProperty] = event.target[targetProperty];
            updateForm();
        }
    }

    /**
     * Функция заполнения элемента Select
     * @param {number} elementId ID элемента Select
     * @param {Array} arr Массив опций для заполнения
     */
    function fillSelect(elementId, arr) {
        let $el = $(elementId);
        arr.forEach(function(v, i) {
            let op = document.createElement('option');
            op.setAttribute('value', v.key);
            op.innerHTML = v.caption;
            $el.append(op);
        });
    }

    /**
     * Функция подписки на события формы
     */
    function subscribeFormDataChangedEvents() {
        $(payerTypeElId).change(updateState('payerType', 'value'));
        $(payerNameElId).on('input', updateState('payerName', 'value'));
        $(phoneElId).keyup(updateState('phone', 'value'));
        $(legalEntityElId).on('change', updateState('legalEntity', 'value'));
        $(tinElId).on('input', updateState('tin', 'value'));
        $(stsElId).change(updateState('sts', 'checked'));
        $(paymentAmountElId).on('input', updateState('paymentAmount', 'value'));
    }

    /**
     * Функция инициализации и заполнения формы
     */
    function initForm() {
        fillSelect(legalEntityElId, legalEntities);
        fillSelect(payerTypeElId, payerTypes);
        $(phoneElId).mask("+7 (999) 999-99-99", {reverse: true});


        form.payerType = $(payerTypeElId).val();
        form.payerName = $(payerNameElId).val();
        form.phone = $(phoneElId).val();
        form.sts = $(stsElId).prop('checked');
        form.vat = $(vatElId).val();
        form.tin = $(tinElId).val();
        form.paymentAmount = $(paymentAmountElId).val();
        form.legalEntity = $(legalEntityElId).val();
    }

    /**
     * Обработчик события загрузки контента
     */
    function onDocumentLoad() {
        initForm();
        subscribeFormDataChangedEvents();
        updateForm();
    }

    $(document).ready(onDocumentLoad);
})()