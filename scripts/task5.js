(function() {
    /**
     * Модель данных таблицы
     */
    const gridModel = {
        defaultColDef: {
            width: 150,
            editable: true,
            resizable: true,
        },
        columnDefs: [
            {
                headerName: "ID", 
                field: "id"
            },{
                headerName: "Node ID", 
                field: "node_id"
            },{
                headerName: "Название", 
                field: "name"
            },{
                headerName: "Полное название", 
                field: "full_name"
            },{
                headerName: "Скрыто", 
                field: "private"
            },{
                headerName: "Владелец", 
                field: "owner.login"
            },{
                headerName: "ID владельца", 
                hide: true,
                field: "owner.id"
            },{
                headerName: "Node ID владельца", 
                hide: true,
                field: "owner.node_id"
            },{
                headerName: "Avatar Url", 
                hide: true,
                field: "owner.avatar_url"
            },{
                headerName: "Gravatar ID", 
                hide: true,
                field: "owner.gravatar_id"
            },{
                headerName: "URL", 
                hide: true,
                field: "owner.url"
            },{
                headerName: "Html Url", 
                hide: true,
                field: "owner.html_url"
            },{
                headerName: "Followers Url", 
                hide: true,
                field: "owner.followers_url"
            },{
                headerName: "Following Url", 
                hide: true,
                field: "owner.following_url"
            },{
                headerName: "Gists Url", 
                hide: true,
                field: "owner.gists_url"
            },{
                headerName: "Starred Url", 
                hide: true,
                field: "owner.starred_url"
            },{
                headerName: "Subscriptions Url", 
                hide: true,
                field: "owner.subscriptions_url"
            },{
                headerName: "Organizations Url", 
                hide: true,
                field: "owner.organizations_url"
            },{
                headerName: "Repos Url", 
                hide: true,
                field: "owner.repos_url"
            },{
                headerName: "Events Url", 
                hide: true,
                field: "owner.events_url"
            },{
                headerName: "Received Events Url", 
                hide: true,
                field: "owner.received_events_url"
            },{
                headerName: "Type", 
                hide: true,
                field: "owner.type"
            },{
                headerName: "Site Admin", 
                hide: true,
                field: "owner.site_admin"
            },{
                headerName: "Описание", 
                field: "description"
            },
          ],
        rowData:[],
        pagination: true,
        paginationPageSize: 20,
    }

    /**
     * Заполнение списка изменения видимости столбцов
     */
    function fillVisibleConfigBlock() {
        const blk = $('.list-group').get(0);
        gridModel.columnDefs.forEach(function(itemData) {
            const item = createConfigColumnItem(itemData);
            blk.appendChild(item);
        });
        
    }

    /**
     * Запрос данных и заполнение таблицы
     */
    function getRepositories() {
        $.ajax({
            dataType: 'json',
            url: 'https://api.github.com/repositories',
            type: 'GET'
        })
        .done(function(data) {
            gridModel.api.setRowData(data);
        })
    }

    /**
     * Функция задания количества элементов на странице
     * @param {number} count Число элементов на странице таблице
     */
    function setPageSize(count) {
        if(!isNaN(count)) {
            gridModel.api.paginationSetPageSize(+count);
        }
    }

    /**
     * Функция создания элемента списка конфигурации столбцов
     * @param {object} item Объект данных столбца
     * @return {Element} Элемент списка
     */
    function createConfigColumnItem(item) {
        const itemContainer = document.createElement('li');
        itemContainer.classList.add('list-group-item');
        const itemCaption = document.createElement('label');
        itemCaption.innerText = item.headerName;
        const itemControl = document.createElement('input');
        itemControl.setAttribute('data-key', item.field);
        itemControl.setAttribute('type', 'checkbox');
        if(!item.hide) {
            itemControl.setAttribute('checked', 'true');
        }
        itemContainer.appendChild(itemControl);
        itemContainer.appendChild(itemCaption);
        return itemContainer;
    }

    /**
     * Обрабтчик события загрузки страницы
     */
    function onDocumentLoad() {
        subscribeOnEvents();
        initGrid();
        fillVisibleConfigBlock();
        showModal();
        getRepositories();
    }

    /**
     * Функция отображения модального окна
     */
    function showModal() {
        $('#repo-count-dialog').modal('show');
    }

    /**
     * Функция скрытия модального окна
     */
    function hideModal() {
        $('#repo-count-dialog').modal('hide');
    }

    /**
     * Функция подписки на события
     */
    function subscribeOnEvents() {
        $('#acceptGridPageSize').on('click', function(event) {
            hideModal();
            setPageSize($('#pageSize').val());
        });
        $('.list-group').on('change', function(event) {
            const element = event.target;
            gridModel.columnApi.setColumnVisible(element.getAttribute('data-key'), element.checked);
        });
    }

    /**
     * Функция создания таблицы
     */
    function initGrid() {
        var gridDiv = $('#repo-table').get(0);
        new agGrid.Grid(gridDiv, gridModel);
    }

    
    $(document).ready(onDocumentLoad);
})();