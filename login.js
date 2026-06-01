const API_BASE = 'https://eurodance-api.onrender.com';

let ADMIN_TOKEN = localStorage.getItem('adminToken') || '';

function loadAdminScript() {
    if ($('#painelAdminScript').length) return;

    const script = document.createElement('script');

    script.id = 'painelAdminScript';
    script.src = 'https://cdn.jsdelivr.net/gh/web5xcss3/hil_w53@e601d4e/PainelAdmin.js';

    document.body.appendChild(script);
}

function adminPanelTemplate() {
    return `
        <section class="admin-shell" id="adminPanel">

            <header class="admin-hero">
                <div>
                    <span class="admin-badge">Eurodance CMS</span>
                    <h1>Painel Admin</h1>
                    <p>Cadastre, edite e gerencie seus uploads musicais.</p>
                </div>

                <div class="hero-actions">
                    <button type="button" id="logoutBtn">Logout</button>
                </div>
            </header>

            <section class="admin-stats" id="adminStats">
				<article class="stat-card" data-augmented-ui="tr-clip border">
					<span>Total</span>
					<strong id="statTotal">0</strong>
				</article>
				<article class="stat-card" data-augmented-ui="tr-clip border">
					<span>Singles</span>
					<strong id="statSingles">0</strong>
				</article>
				<article class="stat-card" data-augmented-ui="tr-clip border">
					<span>Vinyls</span>
					<strong id="statVinyls">0</strong>
				</article>
				<article class="stat-card" data-augmented-ui="tr-clip border">
					<span>Artistas</span>
					<strong id="statArtists">0</strong>
				</article>
			</section>

			<main class="admin-layout">

				<section class="admin-card admin-form-card" data-augmented-ui="tr-clip bl-clip border">
					<div class="section-heading">
						<h2>Cadastro</h2>
						<p>Adicione ou edite informações do item selecionado.</p>
					</div>

					<form id="adminUploadForm" enctype="multipart/form-data">

						<input type="hidden" id="editId" name="editId">
						<input type="hidden" id="formMode" value="create">

						<div class="form-group">
							<label for="type">Categoria</label>
							<select id="type" name="type" required>
								<option value="albums">Albums</option>
								<option value="singles">Singles</option>
								<option value="vinyls">Vinyls</option>
								<option value="djs">DJs</option>
								<option value="musics">Musics</option>
								<option value="playlists">Playlists</option>
								<option value="instrumental">Instrumental</option>
							</select>
						</div>

						<div class="form-group">
							<label for="artist">Artista</label>
							<input type="text" id="artist" name="artist" required>
						</div>

						<div class="form-group full">
							<label for="title">Título</label>
							<input type="text" id="title" name="title" required>
						</div>

						<div class="form-group full">
							<label for="embedUrl">Embed URL</label>
							<input type="url" id="embedUrl" name="embedUrl" required>
						</div>

						<div class="form-group full">
							<label>Imagem do Artista</label>
							<label for="artistImage" class="upload-zone">
								<div class="upload-icon"><i class="fa fa-camera"></i></div>
								<h4>Adicionar imagem do artista</h4>
								<p>PNG, JPG ou WEBP</p>
								<img id="artistImagePreview" class="upload-preview">
							</label>
							<input type="file" id="artistImage" name="artistImage" accept="image/*" hidden>
						</div>

						<div class="form-group full">
							<label>Capa do Álbum</label>
							<label for="image" class="upload-zone">
								<div class="upload-icon"><i class="fa fa-image"></i></div>
								<h4>Adicionar capa do álbum</h4>
								<p>500x500 ou superior</p>
								<img id="albumImagePreview" class="upload-preview">
							</label>
							<input type="file" id="image" name="image" accept="image/*" hidden>
						</div>

						<div class="form-group">
							<label for="year">Ano</label>
							<input type="text" id="year" name="year">
						</div>

						<div class="form-group">
							<label for="label">Label / Gravadora</label>
							<input type="text" id="label" name="label">
						</div>

						<div class="form-group">
							<label for="country">País</label>
							<input type="text" id="country" name="country">
						</div>

						<div class="form-group">
							<label for="format">Formato</label>
							<input type="text" id="format" name="format">
						</div>

						<div class="form-group">
							<label for="genre">Gênero</label>
							<input type="text" id="genre" name="genre">
						</div>

						<div class="form-group">
							<label for="style">Estilo</label>
							<input type="text" id="style" name="style">
						</div>

						<div class="form-group full">
							<button type="submit" class="button primary">Salvar item</button>
							<div id="adminStatus"></div>
						</div>
					</form>
				</section>

				<aside class="admin-side">
					<section class="admin-card json-card" data-augmented-ui="tl-clip br-clip border">
						<div class="result-header">
							<div>
								<h3>Resultado JSON</h3>
								<p>Último item criado ou editado.</p>
							</div>
							<div class="result-actions">
								<button type="button" id="copyJson">Copy</button>
								<button type="button" id="clearJson">Clean</button>
							</div>
						</div>
						<pre id="adminResult">// O item criado aparecerá aqui...</pre>
					</section>

					<section class="admin-card uploads-card" data-augmented-ui="tl-clip tr-clip border">
						<div class="result-header">
							<div>
								<h3>Uploads cadastrados</h3>
								<div id="uploadsCount"></div>
							</div>
							<button type="button" id="refreshUploads">Atualizar</button>
						</div>

						<div class="uploads-toolbar">
							<input type="text" id="searchUploads" placeholder="Buscar artista, título, gênero...">
							<select id="filterType">
								<option value="">Todas categorias</option>
								<option value="albums">Albums</option>
								<option value="singles">Singles</option>
								<option value="vinyls">Vinyls</option>
								<option value="djs">DJs</option>
								<option value="musics">Musics</option>
								<option value="playlists">Playlists</option>
								<option value="instrumental">Instrumental</option>
							</select>
						</div>

						<div id="uploadsList" class="uploads-list"></div>
					</section>
				</aside>
			</main>
        </section>
		
		<div id="confirmModal" class="confirm-modal">
			<div class="confirm-box" data-augmented-ui="tl-clip tr-clip border">
				<h3 id="confirmTitle">Encerrar sessão?</h3>
				<p id="confirmMessage">Antes de sair, verifique se todas as alterações foram salvas.</p>
				<div class="confirm-actions">
					<button type="button" id="confirmCancel">Cancelar</button>
					<button type="button" id="confirmOk">Sair</button>
				</div>
			</div>
		</div>
    `;
}

function showAdminPanel() {
    $('#loginPanel').hide();

    $('#adminContainer').html(
        adminPanelTemplate()
    );

    loadAdminScript();
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

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login inválido');
        }

        ADMIN_TOKEN = data.token;

        localStorage.setItem('adminToken', ADMIN_TOKEN);

        showAdminPanel();

    } catch (error) {
        $('#loginStatus').text('❌ ' + error.message);
    }
});

if (ADMIN_TOKEN) {
    showAdminPanel();
}
