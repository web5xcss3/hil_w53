const API_BASE = 'https://eurodance-api.onrender.com';
const API_URL = `${API_BASE}/admin/create-item`;
let ADMIN_TOKEN = localStorage.getItem('adminToken') || '';

$(function() {

    let uploadsData = [];

    // SUBMIT CREATE / EDIT
    $('#adminUploadForm').on('submit', async function(e) {
        e.preventDefault();

        const $status = $('#adminStatus');

        const mode = $('#formMode').val();
        const editId = $('#editId').val();

        const url = mode === 'edit' ?
            `${API_BASE}/admin/update-item/${editId}` :
            API_URL;

        const method = mode === 'edit' ?
            'PUT' :
            'POST';

        $status.text(
            mode === 'edit' ?
            'Salvando alterações...' :
            'Enviando...'
        );

        let body;
        let headers = {
            Authorization: `Bearer ${ADMIN_TOKEN}`
        };

        if (mode === 'edit') {
            const updateData = {
                type: $('#type').val(),
                artist: $('#artist').val(),
                title: $('#title').val(),
                embedUrl: $('#embedUrl').val(),
                year: $('#year').val(),
                label: $('#label').val(),
                country: $('#country').val(),
                format: $('#format').val(),
                genre: $('#genre').val(),
                style: $('#style').val()
            };

            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(updateData);

        } else {
            body = new FormData(this);
        }

        try {
            const response = await fetch(url, {
                method,
                headers,
                body
            });

            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Resposta não JSON:', text);
                throw new Error('A API retornou HTML/texto.');
            }

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao salvar item.');
            }

            $status.text(
                mode === 'edit' ?
                '✅ Item atualizado com sucesso!' :
                '✅ Item enviado com sucesso!'
            );

            $('#adminResult').text(
                JSON.stringify(data.item, null, 2)
            );

            this.reset();

            $('#formMode').val('create');
            $('#editId').val('');
            $('.button.primary').text('Salvar item');

            $('#artistImagePreview, #albumImagePreview').attr('src', '');
            $('.image-preview').hide();

            loadUploadsList();

        } catch (error) {
            console.error(error);
            $status.text('❌ Erro: ' + error.message);
        }
    });

    // COPY JSON
    $('#copyJson').on('click', async function() {
        const text = $('#adminResult').text();

        if (!text.trim()) return;

        await navigator.clipboard.writeText(text);

        $('#adminStatus').text('📋 JSON copiado!');
    });

    // CLEAN
    $('#clearJson').on('click', function() {
        $('#adminResult').text('// O item criado aparecerá aqui...');
        $('#adminStatus').text('🧹 Resultado limpo');

        $('#adminUploadForm')[0].reset();

        $('#formMode').val('create');
        $('#editId').val('');
        $('.button.primary').text('Salvar item');

        $('#artistImagePreview, #albumImagePreview').attr('src', '');
        $('.image-preview').hide();

        renderUploads(uploadsData);
    });

    // IMAGE PREVIEW
    function previewImage(input, previewSelector) {
        const file = input.files && input.files[0];

        if (!file) {
            $(previewSelector).closest('.image-preview').hide();
            $(previewSelector).attr('src', '');
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {
            $(previewSelector)
                .attr('src', e.target.result)
                .closest('.image-preview')
                .fadeIn(200);
        };

        reader.readAsDataURL(file);
    }

    $('#artistImage').on('change', function() {
        previewImage(this, '#artistImagePreview');
    });

    $('#image').on('change', function() {
        previewImage(this, '#albumImagePreview');
    });

    // LOAD UPLOADS
    async function loadUploadsList() {
        const $list = $('#uploadsList');
        const $count = $('#uploadsCount');

        $list.html('<p>Carregando uploads...</p>');

        try {
            const response = await fetch(`${API_BASE}/adminItems`);

            uploadsData = await response.json();

            renderDashboardStats(uploadsData);

            if (!uploadsData.length) {
                $count.text('0 item(s)');
                $list.html('<p>Nenhum upload cadastrado ainda.</p>');
                return;
            }

            renderUploads(uploadsData);

        } catch (error) {
            console.error(error);
            $count.text('0 item(s)');
            $list.html('<p>Erro ao carregar uploads.</p>');
        }
    }

    // RENDER UPLOADS
    function renderUploads(items) {
        const $list = $('#uploadsList');

        $('#uploadsCount').text(
            `${items.length} item(s)`
        );

        if (!items.length) {
            $list.html(`
                <p>Nenhum resultado encontrado.</p>
            `);

            return;
        }

        $list.html(items.map(item => `
            <article class="upload-item">

                <img
                    src="${item.image || item.artistImage || ''}"
                    alt="${item.title || ''}"
                >

                <div class="upload-info">

                    <h4>${item.artist || 'Sem artista'}</h4>

                    <p>${item.title || 'Sem título'}</p>

                    <p class="upload-meta">
                        ${item.genre || ''}
                        ${item.genre && item.style ? ' • ' : ''}
                        ${item.style || ''}
                    </p>

                    <span class="upload-type">
                        ${item.type || 'item'}
                    </span>

                    <button
                        type="button"
                        class="edit-upload"
                        data-id="${item.id}">
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete-upload"
                        data-id="${item.id}">
                        Delete
                    </button>

                </div>

            </article>
        `).join(''));
    }

    // FILTER UPLOADS
    function filterUploads() {
        const search = $('#searchUploads')
            .val()
            .toLowerCase()
            .trim();

        const type = $('#filterType').val();

        const filtered = uploadsData.filter(item => {
            const matchesSearch = !search ||
                (item.artist || '').toLowerCase().includes(search) ||
                (item.title || '').toLowerCase().includes(search) ||
                (item.genre || '').toLowerCase().includes(search) ||
                (item.style || '').toLowerCase().includes(search);

            const matchesType = !type || item.type === type;

            return matchesSearch && matchesType;
        });

        renderUploads(filtered);
    }

    $('#searchUploads').on('input', filterUploads);
    $('#filterType').on('change', filterUploads);

    $('#refreshUploads').on('click', loadUploadsList);

    if (ADMIN_TOKEN) {
        loadUploadsList();
    }

    // EDIT
    $('#uploadsList').on('click', '.edit-upload', async function() {
        const id = $(this).data('id');

        if (!id) return;

        try {
            const response = await fetch(`${API_BASE}/adminItems`);
            const items = await response.json();

            const item = items.find(x =>
                parseInt(x.id, 10) === parseInt(id, 10)
            );

            if (!item) {
                $('#adminStatus').text('❌ Item não encontrado.');
                return;
            }

            $('#formMode').val('edit');
            $('#editId').val(item.id);

            $('#type').val(item.type || 'albums');
            $('#artist').val(item.artist || '');
            $('#title').val(item.title || '');
            $('#embedUrl').val(item.embedUrl || '');
            $('#year').val(item.year || '');
            $('#label').val(item.label || '');
            $('#country').val(item.country || '');
            $('#format').val(item.format || '');
            $('#genre').val(item.genre || '');
            $('#style').val(item.style || '');

            $('#adminResult').text(
                JSON.stringify(item, null, 2)
            );

            $('.button.primary').text('Salvar alterações');

            $('#adminStatus').text(
                '✏️ Editando item: ' + (item.title || item.artist)
            );

            $('html, body').animate({
                scrollTop: $('#adminUploadForm').offset().top - 30
            }, 400);

        } catch (error) {
            console.error(error);
            $('#adminStatus').text('❌ Erro ao carregar item para edição.');
        }
    });

    // DELETE
    $('#uploadsList').on('click', '.delete-upload', async function() {
        const id = $(this).data('id');

        if (!id) return;

        const confirmDelete = confirm('Deseja excluir este item?');

        if (!confirmDelete) return;

        $('#adminStatus').text('Excluindo item...');

        try {
            const response = await fetch(`${API_BASE}/admin/delete-item/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${ADMIN_TOKEN}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao excluir item.');
            }

            $('#adminStatus').text('🗑️ Item excluído com sucesso!');

            loadUploadsList();

        } catch (error) {
            console.error(error);
            $('#adminStatus').text('❌ Erro: ' + error.message);
        }
    });

    // DESHBOARD
    function renderDashboardStats(items) {
        const total = items.length;

        const singles = items.filter(item => item.type === 'singles').length;
        const vinyls = items.filter(item => item.type === 'vinyls').length;

        const artists = new Set(
            items
            .map(item => item.artist)
            .filter(Boolean)
        ).size;

        $('#statTotal').text(total);
        $('#statSingles').text(singles);
        $('#statVinyls').text(vinyls);
        $('#statArtists').text(artists);
    }

    // LOGIN

    function showAdminPanel() {
        $('#loginPanel').hide();
        $('#adminPanel').fadeIn(200);
        loadUploadsList();
    }

    if (ADMIN_TOKEN) {

        $('#loginStatus').text(
            '🔓 Sessão restaurada'
        );

        showAdminPanel();

    }

    $('#loginBtn').on('click', async function() {

        const username = $('#loginUser').val().trim();
        const password = $('#loginPass').val().trim();

        $('#loginStatus').text('Entrando...');

        try {

            const response = await fetch(`${API_BASE}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const text = await response.text();

            let data;

            try {

                data = JSON.parse(text);

            } catch (e) {

                console.error(
                    'Resposta login não JSON:',
                    text
                );

                throw new Error(
                    'A API retornou HTML/texto. Verifique o deploy do backend.'
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.error || 'Login inválido'
                );
            }

            ADMIN_TOKEN = data.token;

            localStorage.setItem(
                'adminToken',
                ADMIN_TOKEN
            );

            $('#loginStatus').text(
                '✅ Login realizado com sucesso!'
            );

            showAdminPanel();

        } catch (error) {

            console.error(error);

            $('#loginStatus').text(
                '❌ ' + error.message
            );
        }

    });

    $('#logoutBtn').on('click', function() {
        openConfirmModal({
            title: 'Encerrar sessão?',
            message: 'Antes de sair, verifique se todas as alterações foram salvas corretamente.',
            okText: 'Sair',
            onConfirm: function() {
                localStorage.removeItem('adminToken');

                ADMIN_TOKEN = '';

                $('#adminPanel').hide();
                $('#loginPanel').fadeIn(200);

                $('#loginUser').val('');
                $('#loginPass').val('');

                $('#loginStatus').text('🔒 Sessão encerrada');
            }
        });
    });

    function openConfirmModal(options) {
        $('#confirmTitle').text(options.title || 'Confirmar ação');
        $('#confirmMessage').text(options.message || 'Deseja continuar?');
        $('#confirmOk').text(options.okText || 'Confirmar');

        $('#confirmModal').fadeIn(180).css('display', 'grid');

        $('#confirmCancel').off('click').on('click', function() {
            $('#confirmModal').fadeOut(150);
        });

        $('#confirmOk').off('click').on('click', function() {
            $('#confirmModal').fadeOut(150);

            if (typeof options.onConfirm === 'function') {
                options.onConfirm();
            }
        });
    }

});