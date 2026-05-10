/*
====================================================
 PLAY 90 MUSIC - SPA CORE BY WEB5XCSS3 - W53 DEVELOPMENT
====================================================

 Descrição:
Inicialização principal da aplicação (SPA) usando jQuery.
Responsável por carregar, configurar e ativar todos os
módulos do sistema após o DOM estar pronto.

⚙️ Estrutura:
- Encapsulamento em IIFE para evitar conflitos globais
- Uso de "use strict" para código mais seguro
- Execução automática quando o DOM estiver carregado

🧠 Funções principais inicializadas:
- Renderização do App (App.js)
- Sistema de Tabs (SPA navigation)
- Eventos globais (menu, dropdown, search)
- Renderização de dados dinâmicos
- Inicialização de plugins (Slick, FillColor, etc)
- Sistema de busca otimizado

 Observações:
- Este bloco roda apenas UMA vez
- Toda reatividade da UI é controlada internamente (SPA)
- Evita recarregamento de página

====================================================
*/

(function($) {

    "use strict";

    $(function() {

        // ===============================
        // API
        // ===============================
        const API = 'https://eurodance-api.onrender.com';

        // ===============================
        // DADOS
        // ===============================
        let currentData = {
            featured: [],
            albums: [],
            singles: [],
            vinyls: [],
            instrumental: [],
            djs: [],
            musics: [],
            playlists: []
        };

        const originalData = {};

        // ===============================
        // CARREGAR API
        // ===============================
        Promise.all([
            fetch(`${API}/mock`).then(res => res.json()),
            fetch(`${API}/labels`).then(res => res.json()),
            fetch(`${API}/genres`).then(res => res.json())
        ])

        .then(([featured, labels, genres]) => {

            console.log('API carregada:', featured);

            currentData = {

                featured: featured,

                albums: featured.filter(item =>
                    item.type === 'albums'
                ),

                singles: featured.filter(item =>
                    item.type === 'singles'
                ),

                vinyls: featured.filter(item =>
                    item.type === 'vinyls'
                ),

                instrumental: featured.filter(item =>
                    item.type === 'instrumental'
                ),

                djs: featured.filter(item =>
                    item.type === 'djs'
                ),

                musics: featured.filter(item =>
                    item.type === 'music'
                ),

                playlists: featured.filter(item =>
                    item.type === 'playlists'
                )

            };

            // globals antigas
            window.currentData = currentData;
            window.mockFeatured = featured;
            window.mockLabels = labels;
            window.mockGenres = genres;

            // backup
            originalData.featured = [...featured];

            // ===============================
            // RENDER
            // ===============================
            renderAllAlbums();
            renderAllArtists();
            renderAllPlaylists();
            renderTimeline();
            renderMusics();
            renderAllSingles();
            renderAllVinyls();
            renderAllDjs();
            renderAllInstrumental();
            renderFeaturedAlbums();
            renderRecentlyPlayed();
            renderFeaturedDjs();
            renderDailyHit();
            renderAllLabels();
            renderDailyFeaturedTitles();
            renderAllGenres();

        })

        .catch(err => {
            console.error('Erro API:', err);
        });

        // ===============================
        // UTILS
        // ===============================
        function escapeHtml(str) {
            if (!str) return '';
            return String(str).replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }

        let searchTimeout;

        // ===============================
        // EVENTOS (SPA SAFE)
        // ===============================
		function setupEventListeners() {

			// NAV TABS
			$(document).on('click', '[data-tab]', function(event) {
				event.preventDefault();
				const tab = $(this).data('tab');
				if (tab) switchTab(tab);
			});

			// BOTÕES VOLTAR
			$(document).on('click', `
				#backToArtistsBtn,
				#backToTimelineBtn,
				#backToTimelineFromGenres,
				#backToLabelsBtn,
				#backToHomeFromLabels,
				#backToMusicsBtn,
				#backToPlaylistsBtn,
				#backToAlbunsBtn,
				#backToSingleBtn,
				#backToVinylBtn,
				#backToDjsBtn,
				#backToInstrumentaisBtn
			`, function(e) {
				e.preventDefault();

				let tab = $(this).data('tab');

				// FALLBACK INTELIGENTE
				if (!tab) {

					// FORÇAR TIMELINE
					if (
						this.id === 'backToTimelineBtn' ||
						this.id === 'backToTimelineFromGenres'
					) {
						tab = 'timeline';
					}

					// OUTROS CASOS ESPECÍFICOS
					else if (this.id === 'backToLabelsBtn') {
						tab = 'labels';
					}

					// PADRÃO GLOBAL
					else {
						tab = 'artists';
					}
				}

				switchTab(tab);
			});

		}

        // ===============================
        // TABS (SEM CACHE ❗)
        // ===============================
        function switchTab(tabName) {

            // conteúdo
            $('.tab-content').removeClass('active');
            $('#' + tabName).addClass('active');

            // menu ativo
            $('[data-tab]').removeClass('active');
            $('[data-tab="' + tabName + '"]').addClass('active');

            // REHIDRATAR UI (slick etc)
            setTimeout(() => {
                if (typeof hydrateUI === 'function') {
                    hydrateUI();
                }
            }, 50);
        }

        // ===============================
        // STATS
        // ===============================
        function updateStats() {
            $('#albumCount').text((currentData.albums || []).length);
            $('#artistCount').text((currentData.artists || []).length);
            $('#playlistCount').text((currentData.playlists || []).length);
        }

        // ===============================
        // EXPOR GLOBAL
        // ===============================
        window.updateStats = updateStats;

        window.renderAllAlbums = renderAllAlbums;
        window.renderAllArtists = renderAllArtists;
        window.renderAllPlaylists = renderAllPlaylists;
        window.renderTimeline = renderTimeline;
        window.renderMusics = renderMusics;
        window.renderAllSingles = renderAllSingles;
        window.renderAllVinyls = renderAllVinyls;
        window.renderAllDjs = renderAllDjs;
        window.renderAllInstrumental = renderAllInstrumental;
        window.renderFeaturedAlbums = renderFeaturedAlbums;
        window.renderRecentlyPlayed = renderRecentlyPlayed;
        window.renderFeaturedDjs = renderFeaturedDjs;
        window.renderDailyHit = renderDailyHit;
        window.renderAllLabels = renderAllLabels;
        window.renderDailyFeaturedTitles = renderDailyFeaturedTitles;
        window.renderAllGenres = renderAllGenres;

        // ===============================
        // INIT (APENAS EVENTOS)
        // ===============================
        setupEventListeners();

        // Funções de renderização featuredAlbums
        function renderFeaturedAlbums() {

            const $container = $('#featuredAlbums');
            if (!$container.length) return;

            const $titleElement = $('#featuredTitle');
            if ($titleElement.length) {
                $titleElement.text('Álbuns em Destaque');
            }

            const $banner = $('.filtered');

            const featuredAlbums = (currentData.featured || [])
                .slice()
                .sort((a, b) => (b.id || 0) - (a.id || 0))
                .slice(0, 20);

            // render HTML
            $container.html(featuredAlbums.map(item => `
        <div class="album-card" data-id="${item.id || ''}" data-type="featured">
            <article class="box post">
                <div class="content">
                    <div class="stack1"></div>
                    <div class="stack2"></div>
                    <div class="image fit md-ripples ripples-light" data-position="center">
                        <img src="${item.image || ''}" alt="${escapeHtml(item.title || '')}" loading="lazy">
                    </div>
                    <ul class="icons">
                        <li><button type="button" class="icon solid fa-play"></button></li>
                    </ul>
                </div>
                <header class="align-left">
                    <h3 class="album-artist">${escapeHtml(item.artist || '')}</h3>
                    <p class="album-title">${escapeHtml(item.title || '')}</p>
                </header>
            </article>
        </div>
    `).join(''));

            // =====================================================
            // BANNER OTIMIZADO (SEM LAG)
            // =====================================================
            let bannerTimeout;

            function updateBannerFromSlide($slide) {

                clearTimeout(bannerTimeout);

                bannerTimeout = setTimeout(() => {

                    const $img = $slide.find('img');
                    if (!$img.length) return;

                    const imgUrl = $img.attr('src');
                    if (!imgUrl) return;

                    // evita render duplicado
                    if ($banner.data('current') === imgUrl) return;

                    $banner.data('current', imgUrl);

                    $banner.html(`<img src="${imgUrl}" alt="Banner Image">`);

                    // espera carregar antes de aplicar cor
                    const img = new Image();
                    img.src = imgUrl;

                    img.onload = () => {
                        if ($.fn.fillColor) {
                            $banner.fillColor({
                                type: 'avgYUV'
                            });
                        }
                    };

                }, 80);
            }

            // =====================================================
            // SLICK (SEM BUG / SEM DUPLICAÇÃO)
            // =====================================================
            if ($container.hasClass('slick-initialized')) {
                $container.slick('unslick');
            }

            $container
                .on('init', function(event, slick) {
                    const $firstSlide = slick.$slides.eq(0);
                    updateBannerFromSlide($firstSlide);
                })
                .slick({
                    focusOnSelect: true,
                    infinite: true,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    speed: 300,

                    appendArrows: $('#new-slick-arrow'),

                    nextArrow: `
                <ul class="icons">
                    <li><button type="button" class="icon solid fa-chevron-right md-ripples ripples-light"></button></li>
                </ul>`,

                    prevArrow: `
                <ul class="icons">
                    <li><button type="button" class="icon solid fa-chevron-left md-ripples ripples-light"></button></li>
                </ul>`,

                    responsive: [{
                            breakpoint: 1280,
                            settings: {
                                slidesToShow: 3
                            }
                        },
                        {
                            breakpoint: 980,
                            settings: {
                                slidesToShow: 2
                            }
                        },
                        {
                            breakpoint: 736,
                            settings: {
                                slidesToShow: 2
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 1
                            }
                        }
                    ]
                })
                .on('afterChange', function(event, slick, currentSlide) {
                    const $current = slick.$slides.eq(currentSlide);
                    updateBannerFromSlide($current);
                });

            // =====================================================
            // CLICK (PLAYER)
            // =====================================================
            $container.off('click', '.album-card').on('click', '.album-card', function() {

                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');

                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });

        }

        // Funções de renderização dailyHit
        function renderDailyHit(count = 1) {
            const $container = $('#dailyHit');
            if (!$container.length) return;

            const $titleElement = $('#dailyHitTitle');
            if ($titleElement.length) {
                $titleElement.text('Hits de hoje');
            }

            const today = new Date().toISOString().slice(0, 10); // AAAA-MM-DD
            let cachedData = localStorage.getItem('dailyHit');
            let dailyHits = [];

            // Usa cache se for do mesmo dia
            if (cachedData) {
                try {
                    cachedData = JSON.parse(cachedData);
                    if (cachedData.date === today) {
                        dailyHits = cachedData.items;
                    }
                } catch (e) {
                    console.error('Erro ao ler cache de Hits do Dia:', e);
                }
            }

            // Se não houver cache válido, gera nova seleção
            if (!dailyHits.length) {
                const items = (currentData.featured || [])
                    .slice() // cópia
                    .sort(() => Math.random() - 0.5) // embaralha
                    .slice(0, count); // pega 12

                dailyHits = items;

                localStorage.setItem('dailyHit', JSON.stringify({
                    date: today,
                    items: dailyHits
                }));
            }

            // Renderiza cards
            if (!dailyHits.length) {
                $container.html('<p>Nenhum hit disponível hoje.</p>');
                return;
            }

            const html = dailyHits.map(item => `
				<div class="daily-hit">
					<article class="box post special avg">
						<div class="content">
							<div class="image fit" data-position="center">
								<img src="${item.image || ''}" alt="${escapeHtml(item.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><button type="button" class="icon solid fa-play"></button></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-artist">${escapeHtml(item.artist || '')}</h3>
							<p class="album-title">${escapeHtml(item.title || '')}</p>
							<ul class="actions">
								<li><a href="#" class="button big album-card md-ripples ripples-light" data-id="${item.id || ''}" data-type="featured">Play Music</a></li>
							</ul>
						</header>
					</article>
				</div>
			`).join('');

            $container.html(html);

            /*
            // Slick 
            if ($container.hasClass('slick-initialized')) {
                $container.slick('unslick');
            }

            $container.slick({
                focusOnSelect: true,
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 300,
                appendArrows: $('#hits-slick-arrow'),
                nextArrow: '<ul class="icons"><li><button type="button" class="icon solid fa-chevron-right md-ripples ripples-light"></button></li></ul>',
                prevArrow: '<ul class="icons"><li><button type="button" class="icon solid fa-chevron-left md-ripples ripples-light"></button></li></ul>',
                responsive: [{
					breakpoint: 1280, settings: { slidesToShow: 1 } }, {
					breakpoint: 980, settings: { slidesToShow: 1 } }, {
					breakpoint: 736,settings: { slidesToShow: 1 } }, {
					breakpoint: 480, settings: { slidesToShow: 1 } }
                ]
            });
			*/

            // Aplica fillColor apenas no container atual
            $container.find('.avg').fillColor({
                type: 'avg'
            });

            // 🔹 Clique abre player
            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // UTIL
        function shuffleArray(array) {
            const arr = array.slice();
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        // Funções de renderização dailyFeaturedTitles
        function renderDailyFeaturedTitles() {

            const $container = $('#dailyFeaturedTitles');
            const $titleElement = $('#dailyFeaturedTitle');
            if (!$container.length) return;

            const today = new Date().toISOString().split('T')[0];
            const cacheKey = 'dailyFeaturedTitlesCache';
            const indexKey = 'dailyFeaturedIndex';

            const targetThemes = [
                "Let Me Be",
                "I Believe",
                "Copernico",
                "DJ Bobo",
                "Masterboy",
                "Culture Beat",
                "Haddaway",
                "Da Blitz",
                "Taleesa",
                "T.F.O.",
                "Double You",
                "Future City",
                "ICE MC",
                "M.C. Sar & The Real McCoy",
                "Flexx",
                "Maxx",
                "F.B. Machine",
            ];

            let selected = [];
            let currentIndex = parseInt(localStorage.getItem(indexKey)) || 0;
            let themeOfDay = "";

            const normalize = str => (str || '').toLowerCase().trim();

            // TODAS as coleções
            const allItems = [
                ...(currentData.albums || []),
                ...(currentData.singles || []),
                ...(currentData.vinyls || []),
                ...(currentData.featured || [])
            ];

            // limpa cache se mudou o dia
            let cachedData = JSON.parse(localStorage.getItem(cacheKey)) || {};
            if (cachedData.date !== today) {
                localStorage.removeItem(cacheKey);
                cachedData = {};
            }

            if (cachedData.items && cachedData.items.length) {
                selected = cachedData.items;
                themeOfDay = cachedData.theme || "";
            } else {

                const total = targetThemes.length;
                let attempts = 0;

                while (attempts < total) {

                    themeOfDay = targetThemes[currentIndex % total];
                    const search = normalize(themeOfDay);

                    const matchingItems = allItems.filter(item => {
                        if (!item) return false;

                        const artist = normalize(item.artist);
                        const title = normalize(item.title);

                        return (
                            artist.includes(search) ||
                            title.includes(search)
                        );
                    });

                    if (matchingItems.length > 0) {

                        selected = shuffleArray(matchingItems);

                        localStorage.setItem(indexKey, (currentIndex + 1) % total);
                        localStorage.setItem(cacheKey, JSON.stringify({
                            date: today,
                            theme: themeOfDay,
                            items: selected
                        }));

                        break;

                    } else {
                        currentIndex++;
                        attempts++;
                    }
                }

                // FALLBACK (nunca vazio)
                if (!selected.length) {
                    selected = shuffleArray(allItems).slice(0, 6);
                    themeOfDay = "Destaques";
                }
            }

            // título
            if ($titleElement.length) {
                $titleElement.html(`Especial • <span class="artist-name">${escapeHtml(themeOfDay)}</span>`);

            }

            // render
            $container.html(selected.map(item => `
				<div class="album-card" data-id="${item.id || ''}" data-type="featured">
					<article class="box post">
						<div class="content">
							<div class="image fit avg md-ripples ripples-light" data-position="center">
								<img src="${item.image || ''}" alt="${escapeHtml(item.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><button type="button" class="icon solid fa-play"></button></li>
							</ul>
						</div>
						<header class="align-left">
							<h3>${escapeHtml(item.artist || '')}</h3>
							<p>${escapeHtml(item.title || '')}</p>
						</header>
					</article>
				</div>
			`).join(''));

            // Aplica fillColor apenas no container atual
            $container.find('.avg').fillColor({
                type: 'avg'
            });

            // 🔹 Slick 
            if ($container.hasClass('slick-initialized')) {
                $container.slick('unslick');
            }

            $container.slick({
                focusOnSelect: true,
                infinite: true,
                slidesToShow: 5,
                slidesToScroll: 1,
                speed: 300,
                appendArrows: $('#daily-slick-arrow'),
                nextArrow: '<ul class="icons"><li><button type="button" class="icon solid fa-chevron-right md-ripples ripples-light"></button></li></ul>',
                prevArrow: '<ul class="icons"><li><button type="button" class="icon solid fa-chevron-left md-ripples ripples-light"></button></li></ul>',
                responsive: [{
                        breakpoint: 1280,
                        settings: {
                            slidesToShow: 5
                        }
                    },
                    {
                        breakpoint: 980,
                        settings: {
                            slidesToShow: 4
                        }
                    },
                    {
                        breakpoint: 736,
                        settings: {
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 2
                        }
                    }
                ]
            });

            // clique
            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                if (!isNaN(id)) {
                    openPlayer(id, 'featured');
                }
            });
        }

        // Funções de renderização featuredDjs
        function renderFeaturedDjs() {
            const $container = $('#featuredDjs');
            if (!$container.length) return;

            const $titleElement = $('#featuredDjsTitle');
            if ($titleElement.length) {
                $titleElement.text('Mix de DJs');
            }

            // Filtrar apenas DJ Mix
            const featuredDjs = (currentData.featured || [])
                .filter(item => (item.format || '').toLowerCase().includes('dj'))
                .sort((a, b) => (b.id || 0) - (a.id || 0))
                .slice(0, 12);

            // Render HTML
            $container.html(featuredDjs.map(playlist => `
				<div class="album-card" data-id="${playlist.id || ''}" data-type="featured">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light" data-position="center">
								<img src="${playlist.image || ''}" alt="${escapeHtml(playlist.artist || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><button type="button" class="icon solid fa-play"></button></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="playlist-artist">${escapeHtml(playlist.artist || '')}</h3>
							<p class="playlist-title">${escapeHtml(playlist.title || '')}</p>
						</header>
					</article>
				</div>
			`).join(''));

            // Adicionar event listeners → abrir player
            $container.find('.album-card').on('click', function(e) {
                e.stopPropagation();
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });

            // Slick Slider
            if ($container.hasClass('slick-initialized')) {
                $container.slick('unslick');
            }

            $container.slick({
                focusOnSelect: true,
                infinite: true,
                slidesToShow: 6,
                slidesToScroll: 1,
                speed: 300,
                appendArrows: $('#djs-slick-arrow'),
                nextArrow: '<ul class="icons"><li><button type="button" class="icon solid fa-chevron-right md-ripples ripples-light"></button></li></ul>',
                prevArrow: '<ul class="icons"><li><button type="button" class="icon solid fa-chevron-left md-ripples ripples-light"></button></li></ul>',
                responsive: [{
                        breakpoint: 1280,
                        settings: {
                            slidesToShow: 6
                        }
                    },
                    {
                        breakpoint: 980,
                        settings: {
                            slidesToShow: 4
                        }
                    },
                    {
                        breakpoint: 736,
                        settings: {
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 2
                        }
                    }
                ]
            });

        }

        // Funções de renderização recentlyPlayed
        function renderRecentlyPlayed() {
            const $container = $('#recentlyPlayed');
            if (!$container.length) return;

            const $titleElement = $('#recentlyPlayedTitle');
            if ($titleElement.length) {
                $titleElement.text('Recente');
            }

            const stored = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];

            const sourceTypes = {
                album: currentData.albums || [],
                albums: currentData.albums || [],
                playlist: currentData.playlists || [],
                playlists: currentData.playlists || [],
                instrumental: currentData.instrumental || [],
                djs: currentData.djs || [],
                vinyls: currentData.vinyls || [],
                singles: currentData.singles || [],
                musics: currentData.musics || [],
                featured: currentData.featured || []
            };

            const html = stored.map(entry => {
                let item = sourceTypes[entry.type]?.find(i => i.id === entry.id);
                if (!item) return '';

                const title = item.title || item.name || "Sem título";
                const artist = item.artist || "Vários Artistas";
                const image = item.image || "https://i.ibb.co/m5Cb336C/music-default.jpg";

                return `
            <div class="album-card" data-id="${item.id || ''}" data-type="${entry.type}">
                <article class="box post">
                    <div class="content">
                        <div class="image fit md-ripples ripples-light" data-position="center">
                            <img src="${image}" alt="${escapeHtml(title)}" loading="lazy">
                        </div>
                        <ul class="icons">
                            <li><button type="button" class="icon solid fa-play"></button></li>
                        </ul>
                    </div>
                    <header class="align-left">
                        <h3>${escapeHtml(artist)}</h3>
						<p>${escapeHtml(title)}</p>
                    </header>
                </article>
            </div>
			`;
            }).join('');

            $container.html(html);

            // ⚡ Slick Slider (sem banner)
            if (stored.length > 0) {
                if ($container.hasClass('slick-initialized')) {
                    $container.slick('unslick');
                }

                $container.slick({
                    focusOnSelect: true,
                    infinite: true,
                    slidesToShow: 6,
                    slidesToScroll: 1,
                    speed: 300,
                    appendArrows: $('#recentlyPlayed-slick-arrow'),
                    nextArrow: '<ul class="icons"><li><button type="button" class="icon solid fa-chevron-right md-ripples ripples-light"></button></li></ul>',
                    prevArrow: '<ul class="icons"><li><button type="button" class="icon solid fa-chevron-left md-ripples ripples-light"></button></li></ul>',
                    responsive: [{
                            breakpoint: 1280,
                            settings: {
                                slidesToShow: 6
                            }
                        },
                        {
                            breakpoint: 980,
                            settings: {
                                slidesToShow: 4
                            }
                        },
                        {
                            breakpoint: 736,
                            settings: {
                                slidesToShow: 3
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 2
                            }
                        }
                    ]
                });
            }

            // Evento para abrir no player
            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });

        }

        // Save Recent Played
        function saveToRecentlyPlayed(item) {
            const key = 'recentlyPlayed';
            const stored = JSON.parse(localStorage.getItem(key)) || [];

            // Remove duplicados (mesmo id e tipo)
            const filtered = stored.filter(entry => !(entry.id === item.id && entry.type === item.type));

            // Coloca o novo no topo
            filtered.unshift(item);

            // Limita a 6
            const updated = filtered.slice(0, 8);
            localStorage.setItem(key, JSON.stringify(updated));

            renderRecentlyPlayed();
        }

        // Funções de renderização allInstrumentals
        function renderAllInstrumental() {
            const $container = $('#allInstrumentals');
            if (!$container.length) return;

            const $titleElement = $('#instrumentalTitle');
            if ($titleElement.length) {
                $titleElement.text('Instrumentais');
            }

            const combinedInstrumentals = [
                ...(currentData.featured || []).filter(item =>
                    item.format?.toLowerCase().includes('instrumental')
                )
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            $container.html(combinedInstrumentals.map(inst => `
				<div class="album-card" data-id="${inst.id || ''}" data-type="featured">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light" data-position="center">
								<img src="${inst.image || ''}" alt="${escapeHtml(inst.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><button type="button" class="icon solid fa-play"></button></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-artist">${escapeHtml(inst.artist || '')}</h3>
							<p class="album-title">${escapeHtml(inst.title || '')}</p>
						</header>
					</article>
				</div>
			`).join(''));

            setupBannerFillColorEvents('allInstrumentals');

            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // Funções de renderização allDjs
        function renderAllDjs() {
            const $container = $('#allDjs');
            if (!$container.length) return;

            const $titleElement = $('#djsTitle');
            if ($titleElement.length) {
                $titleElement.text('Mix de DJs');
            }

            const combinedDjs = [
                ...(currentData.featured || []).filter(item =>
                    item.format?.toLowerCase().includes('dj')
                )
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            $container.html(combinedDjs.map(dj => `
				<div class="album-card" data-id="${dj.id || ''}" data-type="featured">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light" data-position="center">
								<img src="${dj.image || ''}" alt="${escapeHtml(dj.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><button type="button" class="icon solid fa-play"></button></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-artist">${escapeHtml(dj.artist || '')}</h3>
							<p class="album-title">${escapeHtml(dj.title || '')}</p>
						</header>
					</article>
				</div>
			`).join(''));

            setupBannerFillColorEvents('allDjs');

            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // Funções de renderização allMusics
        function renderMusics() {
            const $container = $('#allMusics');
            if (!$container.length) return;

            const $titleElement = $('#musicsTitle');
            if ($titleElement.length) {
                $titleElement.text('Músicas');
            }

            const sortedMusics = (currentData.featured || [])
                .filter(music => music.format === "Music") // 🔍 apenas músicas
                .sort((a, b) => (b.id || 0) - (a.id || 0))
                .slice(0, 500);

            if (sortedMusics.length === 0) {
                $container.html(`<p class="icon solid fa-record-vinyl empty-message"> Nenhuma música encontrada.</p>`);
                return;
            }

            const html = sortedMusics.map(music => {
                const id = music.id || '';
                const title = escapeHtml(music.title || 'Sem título');
                const artist = escapeHtml(music.artist || 'Desconhecido');
                const image = music.image || 'https://i.ibb.co/m5Cb336C/music-default.jpg';

                return `
				<div class="album-card" data-id="${id}" data-type="featured">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light" data-position="center">
								<img src="${image}" alt="${title} - ${artist}" alt="${escapeHtml(music.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><button type="button" class="icon solid fa-play"></button></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-artist">${artist}</h3>
							<p class="album-title">${title}</p>
						</header>
					</article>
				</div>
			`;
            }).join('');

            $container.html(html);

            setupBannerFillColorEvents('allMusics');

            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // Funções de renderização allAlbums
        let albumsData = [];
        let albumsVisible = 0;
        const albumsPerLoad = 12;

        function renderAllAlbums() {
            const $container = $('#allAlbums');
            if (!$container.length) return;

            const $titleElement = $('#albumsTitle');
            if ($titleElement.length) {
                $titleElement.text('Álbuns');
            }

            // prepara os dados
            albumsData = [
                ...(currentData.featured || []).filter(item =>
                    item.format?.toLowerCase().includes('album')
                )
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            albumsVisible = 0;
            $container.empty();

            renderMoreAlbums();

            // remove botão antigo (evita duplicação em tabs/load)
            $('#loadMoreAlbums').parent().remove();

            // cria botão
            $container.after(`
				<div class="align-center" style="margin-top:50px;">
					<button id="loadMoreAlbums" class="button loadmore large">
						Carregar mais
					</button>
				</div>
			`);

            $('#loadMoreAlbums').off('click').on('click', function() {
                renderMoreAlbums();
            });
        }

        // carregar mais
        function renderMoreAlbums() {
            const $container = $('#allAlbums');

            const nextItems = albumsData.slice(albumsVisible, albumsVisible + albumsPerLoad);

            const html = nextItems.map(album => `
				<div class="album-card" data-id="${album.id || ''}" data-type="featured">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light" data-position="center">
								<img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><button type="button" class="icon solid fa-play"></button></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-artist">${escapeHtml(album.artist || '')}</h3>
							<p class="album-title">${escapeHtml(album.title || '')}</p>
						</header>
					</article>
				</div>
			`).join('');

            $container.append(html);

            albumsVisible += albumsPerLoad;

            // reativa efeitos
            setupBannerFillColorEvents('allAlbums');

            $container.find('.album-card').off('click').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });

            // esconder botão quando acabar
            if (albumsVisible >= albumsData.length) {
                $('#loadMoreAlbums').hide();
            }
        }

        // Funções de renderização allArtists

        // 1:VARIÁVEIS
        let allArtistsData = [];
        let artistsVisible = 0;
        const artistsPerLoad = 15;

        // 2:FUNÇÃO PRINCIPAL (renderAllArtists)
        function renderAllArtists() {

            const $container = $('#allArtists');
            if (!$container.length) return;

            const $titleElement = $('#artistsTitle');
            if ($titleElement.length) {
                $titleElement.text('Artistas');
            }

            const allAlbums = [
                ...(currentData.albums || []),
                ...(currentData.singles || []),
                ...(currentData.vinyls || []),
                ...(currentData.featured || [])
            ];

            const albumsByArtist = allAlbums.reduce((acc, album) => {

                if (!album || !album.artist) return acc;

                if (!acc[album.artist]) {
                    acc[album.artist] = {
                        name: album.artist,
                        albumCount: 0,
                        image: album.image || 'https://i.ibb.co/m5Cb336C/music-default.jpg'
                    };
                }

                acc[album.artist].albumCount++;
                return acc;

            }, {});

            // salva lista completa
            allArtistsData = Object.values(albumsByArtist)
                .sort((a, b) => b.albumCount - a.albumCount); // opcional (mais populares primeiro)

            artistsVisible = 0;

            $container.empty();

            loadMoreArtists(); // primeira carga
        }

        // 3:FUNÇÃO LOAD MORE
        function loadMoreArtists() {

            const $container = $('#allArtists');

            const nextItems = allArtistsData.slice(
                artistsVisible,
                artistsVisible + artistsPerLoad
            );

            if (!nextItems.length) return;

            const html = nextItems.map(artist => `
				<div class="artist-card" data-artist="${artist.name}">
					<article class="box post avg">
						<div class="content">
							<div class="image fit md-ripples ripples-light" data-position="center">
								<img src="${artist.image}" alt="${escapeHtml(artist.name)}" loading="lazy">
							</div>
						</div>
						<header class="align-center">
							<h3>${escapeHtml(artist.name)}</h3>
							<p>${artist.albumCount} Álbuns</p>
						</header>
					</article>
				</div>
			`).join('');

            $container.append(html);

            artistsVisible += artistsPerLoad;

            // eventos (rebind seguro)
            $container.find('.artist-card').off('click').on('click', function() {
                const artist = $(this).data('artist');
                renderSubAlbumsByArtist(artist);
            });

            // efeito visual
            $container.find('.avg').fillColor({
                type: 'avg'
            });

            setupBannerFillColorEvents('allArtists');

            updateLoadMoreButton();
        }

        // 4:BOTÃO LOAD MORE
        function updateLoadMoreButton() {

            let $btn = $('#loadMoreArtists');

            if (!$btn.length) {
                $('#allArtists').after(`
					<div class="align-center" style="margin-top:50px;">
						<button id="loadMoreArtists" class="button loadmore large">Carregar mais</button>
					</div>
				`);
                $btn = $('#loadMoreArtists');
            }

            if (artistsVisible >= allArtistsData.length) {
                $btn.hide();
            } else {
                $btn.show();
            }
        }

        // 5:EVENTO DO BOTÃO
        $(document).on('click', '#loadMoreArtists', function() {
            loadMoreArtists();
        });
		
// =====================================================
// Funções de renderização suballAlbums dos artistas
// =====================================================
	function renderSubAlbumsByArtist(artist) {

		// NORMALIZADOR (resolve bugs de comparação)
		const normalize = str => (str || '').toLowerCase().trim();

		const allAlbums = [
			...(currentData.albums || []),
			...(currentData.singles || []),
			...(currentData.vinyls || []),
			...(currentData.featured || [])
		]
		.slice()
		.sort((a, b) => (b.id || 0) - (a.id || 0))
		.slice(0, 5000);

		// FILTRO CORRIGIDO
		const albums = allAlbums.filter(album =>
			album && normalize(album.artist) === normalize(artist)
		);

		const $container = $('#suballAlbums');
		const $title = $('#subalbumsTitle');

		// NOVOS ELEMENTOS (layout artista)
		const $artistName = $('#artistName');
		const $artistImage = $('#artistImage');

		if (!$container.length || !$title.length) return;

		// HEADER
		$title.html(`Álbuns de <span class="artist-name">${artist}</span>`);

		// INFO ARTISTA
		if ($artistName.length) {
			$artistName.text(artist);
		}
	
		// BIO
		$('#artist-bio').text('Carregando biografia...');
		loadArtistBioOnly(artist);

		// IMAGEM DO ARTISTA (usa primeiro álbum)
		const firstAlbum = albums[0];
		if ($artistImage.length && firstAlbum) {
			$artistImage.attr('src', firstAlbum.image || '');
		}

		// RENDER DOS ÁLBUNS (com chave única)
		$container.html(albums.map(album => {

			let albumType = 'album';

			if ((currentData.singles || []).find(s => s.id === album.id)) albumType = 'singles';
			else if ((currentData.albums || []).find(v => v.id === album.id)) albumType = 'albums';
			else if ((currentData.vinyls || []).find(v => v.id === album.id)) albumType = 'vinyls';
			else if ((currentData.featured || []).find(f => f.id === album.id)) albumType = 'featured';

			return `
			<div class="album-card md-ripples ripples-light" data-id="${album.id || ''}" data-type="${albumType}" data-key="${albumType}-${album.id}">
				<article class="box post">
					<div class="image fit" data-position="center">
						<img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" loading="lazy">
					</div>
					<header class="song-info">
						<h3 class="album-title">${escapeHtml(album.title || '')}</h3>
						<span class="album-artist">${escapeHtml(album.artist || '')}</span>
					</header>
				</article>
			</div>
			`;
		}).join(''));

		// EVENTO CORRIGIDO (SEM BUG)
		$container.off('click').on('click', '.album-card', function(e) {
			e.preventDefault();
			
			const key = $(this).attr('data-key');
			
			if (!key) return;
			
			const [type, id] = key.split('-');
			
			if (id && type) {
				openPlayer(parseInt(id), type);
			}
		});

		// efeitos visuais (mantido)
		setupBannerFillColorEvents('suballAlbums');

		// troca de aba
		switchTab('subalbums');
	}

// =====================================================
// BIO
// =====================================================
function loadArtistBioOnly(artist) {

    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist)}&api_key=4959ac7ccf2055437d47a70303cc0ee0&format=json`;

    fetch(url)
        .then(res => res.json())
        .then(data => {

            const info = data.artist;

            if (!info) {
                $('#artist-bio').text(`Sem informações para ${artist}`);
                return;
            }

            let bio = info.bio?.content || info.bio?.summary || '';

            bio = bio
                .replace(/<a.*?>.*?<\/a>/g, '')
                .replace(/User-contributed text[\s\S]*$/i, '')
                .replace(/Read more[\s\S]*$/i, '')
                .trim();

            if (!bio || bio.length < 20) {
                bio = `Informações sobre ${artist} não disponíveis no momento.`;
            }

            renderBioReadMore(formatBio(bio));

        })
        .catch(() => {
            $('#artist-bio').text(`Não foi possível carregar a biografia de ${artist}`);
        });
}

function formatBio(text) {

    if (!text) return '';

    return text
        .replace(/<a.*?>.*?<\/a>/g, '')
        .replace(/User-contributed text[\s\S]*$/i, '')
        .replace(/Read more[\s\S]*$/i, '')
        .replace(/\n/g, '<br>')
        .trim();
}

// =====================================================
// LER MAIS BIO
// =====================================================

function renderBioReadMore(bio) {

    const limit = 300;
    const isLong = bio.length > limit;
    const shortBio = isLong ? bio.substring(0, limit) + '...' : bio;

    $('#artist-bio').html(`
		<span class="bio-text">${shortBio}</span>

        ${isLong ? `
            <button type="button" class="bio-read-more">
                Ler mais
            </button>
        ` : ''}
    `);

    $('#artist-bio')
        .data('full-bio', bio)
        .data('short-bio', shortBio);
}

// =====================================================
// EVENTO LER MAIS / LER MENOS
// =====================================================

$(document).on('click', '.bio-read-more', function () {

    const $btn = $(this);
    const $box = $('#artist-bio');
    const $text = $box.find('.bio-text');

    const fullBio = $box.data('full-bio');
    const shortBio = $box.data('short-bio');

    const opened = $btn.hasClass('opened');

    if (opened) {
		$text.html(shortBio);
        $btn.removeClass('opened').text('Ler mais');
    } else {
		$text.html(fullBio);
        $btn.addClass('opened').text('Ler menos');
    }

});


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

        // Funções de renderização allVinyls
        let vinylsData = [];
        let vinylsVisible = 0;
        const vinylsPerLoad = 12;

        function renderAllVinyls() {
            const $container = $('#allVinyls');
            if (!$container.length) return;

            const $titleElement = $('#vinylsTitle');
            if ($titleElement.length) {
                $titleElement.text('Vinyl, 12"');
            }

            // prepara os dados
            vinylsData = [
                ...(currentData.featured || []).filter(item =>
                    item.format?.toLowerCase().includes('vinyl')
                )
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            vinylsVisible = 0;
            $container.empty();

            renderMoreVinyls();

            // botão load more
            if (!$('#loadMoreVinyls').length) {
                $container.after(`
					<div class="align-center" style="margin-top:50px;">
						<button id="loadMoreVinyls" class="button loadmore large">
							Carregar mais
						</button>
					</div>
				`);
            }

            $('#loadMoreVinyls').off('click').on('click', function() {
                renderMoreVinyls();
            });
        }

        // carregar mais itens
        function renderMoreVinyls() {
            const $container = $('#allVinyls');

            const nextItems = vinylsData.slice(vinylsVisible, vinylsVisible + vinylsPerLoad);

            const html = nextItems.map(album => `
				<div class="album-card" data-id="${album.id || ''}" data-type="featured">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light" data-position="center">
								<img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><button type="button" class="icon solid fa-play"></button></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-artist">${escapeHtml(album.artist || '')}</h3>
							<p class="album-title">${escapeHtml(album.title || '')}</p>
						</header>
					</article>
				</div>
			`).join('');

            $container.append(html);

            vinylsVisible += vinylsPerLoad;

            // reativa efeitos
            setupBannerFillColorEvents('allVinyls');

            $container.find('.album-card').off('click').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });

            // esconder botão quando acabar
            if (vinylsVisible >= vinylsData.length) {
                $('#loadMoreVinyls').hide();
            }
        }

        // Funções de renderização allSingles
        let singlesData = [];
        let singlesVisible = 0;
        const singlesPerLoad = 12;

        function renderAllSingles() {
            const $container = $('#allSingles');
            if (!$container.length) return;

            const $titleElement = $('#singlesTitle');
            if ($titleElement.length) {
                $titleElement.text('CD, Maxi-Single');
            }

            // Prepara os dados apenas uma vez
            singlesData = [
                ...(currentData.featured || []).filter(item =>
                    item.format?.toLowerCase().includes('single')
                )
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            singlesVisible = 0;
            $container.empty();

            renderMoreSingles();

            // cria botão se não existir
            if (!$('#loadMoreSingles').length) {
                $container.after(`
					<div class="align-center" style="margin-top:50px;">
						<button id="loadMoreSingles" class="button loadmore large">
							Carregar mais
						</button>
					</div>
				`);
            }

            $('#loadMoreSingles').off('click').on('click', function() {
                renderMoreSingles();
            });
        }

        // Função que adiciona mais itens
        function renderMoreSingles() {
            const $container = $('#allSingles');

            const nextItems = singlesData.slice(singlesVisible, singlesVisible + singlesPerLoad);

            const html = nextItems.map(album => `
				<div class="album-card" data-id="${album.id || ''}" data-type="featured">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light" data-position="center">
								<img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><button type="button" class="icon solid fa-play"></button></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-artist">${escapeHtml(album.artist || '')}</h3>
							<p class="album-title">${escapeHtml(album.title || '')}</p>
						</header>
					</article>
				</div>
			`).join('');

            $container.append(html);

            singlesVisible += singlesPerLoad;

            // eventos
            setupBannerFillColorEvents('allSingles');

            $container.find('.album-card').off('click').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });

            // esconder botão quando acabar
            if (singlesVisible >= singlesData.length) {
                $('#loadMoreSingles').hide();
            }
        }

        // Funções de renderização allPlaylists
        function renderAllPlaylists() {
            const $container = $('#allPlaylists');
            if (!$container.length) return;

            const $titleElement = $('#playlistsTitle');
            if ($titleElement.length) {
                $titleElement.text('Playlists');
            }

            const combinedPlaylists = [
                ...(currentData.featured || []).filter(item =>
                    item.format?.toLowerCase().includes('playlist')
                )
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            $container.html(combinedPlaylists.map(playlist => `
				<div class="album-card" data-id="${playlist.id || ''}" data-type="featured">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light" data-position="center">
								<img src="${playlist.image || ''}" alt="${escapeHtml(playlist.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><button type="button" class="icon solid fa-play"></button></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-artist">${escapeHtml(playlist.artist || '')}</h3>
							<p class="album-title">${escapeHtml(playlist.title || '')}</p>
						</header>
					</article>
				</div>
			`).join(''));

            setupBannerFillColorEvents('allPlaylists');

            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // UTIL
        function switchTab(tabName) {
            // Atualiza menu ativo
            $('ul li button').removeClass('active');
            $(`ul li button[data-tab="${tabName}"]`).addClass('active');

            // Atualiza conteúdo
            $('.tab-content').removeClass('active');
            const $activeTab = $('#' + tabName).addClass('active');

            // Corrige Slick apenas na tab ativa
            setTimeout(() => {
                $activeTab.find('.slick-initialized').slick('setPosition');
            }, 50);
        }

        // Funções de renderização allTimeline
        function renderTimeline() {
            const $container = $('#allTimeline');
            if (!$container.length) return;

            const $titleElement = $('#timelineTitle');
            if ($titleElement.length) {
                $titleElement.text('Linha do Tempo');
            }

            const allAlbums = [
                ...(currentData.albums || []),
                ...(currentData.singles || []),
                ...(currentData.vinyls || []),
                ...(currentData.featured || [])
            ];

            const albumsByYear = allAlbums.reduce((acc, album) => {
                if (!album || !album.year) return acc;
                const yearStr = album.year.toString();
                if (!acc[yearStr]) {
                    acc[yearStr] = {
                        name: yearStr,
                        albumCount: 0
                    };
                }
                acc[yearStr].albumCount++;
                return acc;
            }, {});

            const timelineYears = Object.values(albumsByYear)
                .sort((a, b) => parseInt(b.name) - parseInt(a.name));

            $container.html(timelineYears.map(year => `
				<div class="timeline-card md-ripples ripples-light" data-year="${year.name}">
					<h3>${year.name}</h3>
					<p>${year.albumCount} álbuns</p>
				</div>
			`).join(''));

            // Evento de clique para cada ano
            $container.find('.timeline-card').on('click', function() {
                const year = $(this).data('year');
                renderAlbumsByYear(year);
            });

            // ⚡ Slick Slider
            if ($container.hasClass('slick-initialized')) {
                $container.slick('unslick');
            }

            $container.slick({
                focusOnSelect: true,
                infinite: true,
                slidesToShow: 6,
                slidesToScroll: 1,
                speed: 300,
                appendArrows: $('#timeline-slick-arrow'),
                nextArrow: '<ul class="icons"><li><button type="button" class="icon solid fa-chevron-right md-ripples ripples-light"></button></li></ul>',
                prevArrow: '<ul class="icons"><li><button type="button" class="icon solid fa-chevron-left md-ripples ripples-light"></button></li></ul>',
                responsive: [{
                        breakpoint: 1280,
                        settings: {
                            slidesToShow: 6
                        }
                    },
                    {
                        breakpoint: 980,
                        settings: {
                            slidesToShow: 4
                        }
                    },
                    {
                        breakpoint: 736,
                        settings: {
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 2
                        }
                    }
                ]
            });

            setupBannerFillColorEvents('allTimeline');
        }

        // Lista de álbuns do ano clicado
        // 1. VARIÁVEIS
        let yearAlbumsData = [];
        let yearAlbumsVisible = 0;
        const yearAlbumsPerLoad = 12;

        // 2. FUNÇÃO PRINCIPAL (ATUALIZADA)
        function renderAlbumsByYear(year) {

            const allAlbums = [
                ...(currentData.albums || []),
                ...(currentData.singles || []),
                ...(currentData.vinyls || []),
                ...(currentData.featured || [])
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            // salva global
            yearAlbumsData = allAlbums.filter(album =>
                album && album.year?.toString() === year.toString()
            );

            yearAlbumsVisible = 0;

            const $container = $('#yearAlbumsList');
            const $title = $('#yearAlbumsTitle');

            if (!$container.length || !$title.length) return;

            $title.html(`Álbuns de <span class="artist-year">${year}</span>`);
            // Mostrar quantidade no título
            // $title.html(`Álbuns de <span class="artist-year">${year}</span> (${yearAlbumsData.length})`);

            $container.empty();

            loadMoreYearAlbums(); // primeira carga

            switchTab('yearAlbums');
        }

        // 3. FUNÇÃO LOAD MORE
        function loadMoreYearAlbums() {

            const $container = $('#yearAlbumsList');

            const nextItems = yearAlbumsData.slice(
                yearAlbumsVisible,
                yearAlbumsVisible + yearAlbumsPerLoad
            );

            if (!nextItems.length) return;

            const html = nextItems.map(album => {

                let albumType = 'albums';

                if ((currentData.singles || []).find(s => s.id === album.id)) {
                    albumType = 'singles';
                } else if ((currentData.vinyls || []).find(v => v.id === album.id)) {
                    albumType = 'vinyls';
                } else if ((currentData.featured || []).find(f => f.id === album.id)) {
                    albumType = 'featured';
                }

                return `
				<div class="album-card" data-id="${album.id}" data-type="${albumType}">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light" data-position="center">
								<img src="${album.image}" alt="${escapeHtml(album.title)}" loading="lazy">
							</div>
							<ul class="icons">
								<li><button type="button" class="icon solid fa-play"></button></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-artist">${escapeHtml(album.artist)}</h3>
							<p class="album-title">${escapeHtml(album.title)}</p>
						</header>
					</article>
				</div>
				`;
            }).join('');

            $container.append(html);

            yearAlbumsVisible += yearAlbumsPerLoad;

            // eventos
            $container.find('.album-card').off('click').on('click', function(e) {
                e.preventDefault();
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) openPlayer(id, type);
            });

            setupBannerFillColorEvents('yearAlbumsList');

            updateLoadMoreYearAlbumsButton();
        }

        // 4. BOTÃO LOAD MORE
        function updateLoadMoreYearAlbumsButton() {

            let $btn = $('#loadMoreYearAlbums');

            if (!$btn.length) {
                $('#yearAlbumsList').after(`
					<div class="align-center" style="margin-top:50px;">
						<button id="loadMoreYearAlbums" class="button loadmore large">Carregar mais</button>
					</div>
				`);
                $btn = $('#loadMoreYearAlbums');
            }

            if (yearAlbumsVisible >= yearAlbumsData.length) {
                $btn.hide();
            } else {
                $btn.show();
            }
        }

        // 5. EVENTO DO BOTÃO
        $(document).on('click', '#loadMoreYearAlbums', function() {
            loadMoreYearAlbums();
        });

        // Funções de renderização AllGenres
        function renderAllGenres() {

            const $container = $('#AllGenres');
            if (!$container.length) return;

            const $titleElement = $('#genresTitle');
            if ($titleElement.length) {
                $titleElement.text('Gêneros');
            }

            const featured = currentData.featured || [];

            // função segura (garante que sempre funcione)
            const normalize = str => (str || '').toLowerCase().trim();

            const getStyles = (styleString) => {
                return (styleString || '')
                    .split(',')
                    .map(s => normalize(s))
                    .filter(Boolean);
            };

            // pegar todos os styles usados
            let usedStyles = [];

            featured.forEach(item => {
                if (!item || !item.style) return;
                usedStyles.push(...getStyles(item.style));
            });

            // remover duplicados
            usedStyles = [...new Set(usedStyles)];

            // DEBUG (pode remover depois)
            console.log('Styles encontrados:', usedStyles);

            // cruzar com mockGenres (normalizado)
            const validGenres = (mockGenres || []).filter(g =>
                usedStyles.includes(normalize(g.name))
            );

            if (!validGenres.length) {
                $container.html('<p>Nenhum gênero encontrado.</p>');
                return;
            }

            // ordenar
            const sortedGenres = validGenres
                .slice()
                .sort((a, b) => (b.id || 0) - (a.id || 0));

            // render
            $container.html(sortedGenres.map(genre => `
				<div class="genre-card md-ripples ripples-light" data-genre="${genre.name}">
					<article class="box post">
						<header class="align-center">
							<h3>${escapeHtml(genre.name)}</h3>
						</header>
					</article>
				</div>
			`).join(''));

            // clique
            $container.find('.genre-card').on('click', function() {
                const genreName = $(this).data('genre');
                renderAlbumsByStyle(genreName); // 👈 usa sua função nova
            });

        }

        // re-renderização album style

        // 1. VARIÁVEIS GLOBAIS
        let genresAlbumsData = [];
        let genresAlbumsVisible = 0;
        const genresAlbumsPerLoad = 12;

        // 2. FUNÇÃO PRINCIPAL (RENDER)
        function renderAlbumsByStyle(styleName) {

            const allAlbums = [
                ...(currentData.albums || []),
                ...(currentData.singles || []),
                ...(currentData.vinyls || []),
                ...(currentData.featured || [])
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            const normalize = str => (str || '').toLowerCase().trim();

            const getStyles = (styleString) => {
                return (styleString || '')
                    .split(',')
                    .map(s => normalize(s))
                    .filter(Boolean);
            };

            genresAlbumsData = allAlbums.filter(album => {
                if (!album || !album.style) return false;
                return getStyles(album.style).includes(normalize(styleName));
            });

            genresAlbumsVisible = 0;

            const $container = $('#genresAlbumsList');
            const $title = $('#genresAlbumsTitle');

            if (!$container.length || !$title.length) return;

            $title.html(`Gênero: <span class="artist-year">${escapeHtml(styleName)}</span>`);
            // Mostrar quantidade no título
            // $title.html(`Gênero: <span class="artist-year">${escapeHtml(styleName)}</span> (${genresAlbumsData.length})`);

            if (!genresAlbumsData.length) {
                $container.html('<p>Nenhum álbum encontrado.</p>');
                switchTab('genresAlbums');
                return;
            }

            $container.empty();

            loadMoreGenresAlbums();

            switchTab('genresAlbums');
        }

        // 3. FUNÇÃO LOAD MORE
        function loadMoreGenresAlbums() {

            const $container = $('#genresAlbumsList');

            const nextItems = genresAlbumsData.slice(
                genresAlbumsVisible,
                genresAlbumsVisible + genresAlbumsPerLoad
            );

            if (!nextItems.length) return;

            const html = nextItems.map(album => {

                let albumType = 'albums';

                if ((currentData.singles || []).find(s => s.id === album.id)) {
                    albumType = 'singles';
                } else if ((currentData.vinyls || []).find(v => v.id === album.id)) {
                    albumType = 'vinyls';
                } else if ((currentData.featured || []).find(f => f.id === album.id)) {
                    albumType = 'featured';
                }

                return `
				<div class="album-card" data-id="${album.id}" data-type="${albumType}">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light" data-position="center">
								<img src="${album.image}" alt="${escapeHtml(album.title)}" loading="lazy">
							</div>
							<ul class="icons">
								<li><button type="button" class="icon solid fa-play"></button></li>
							</ul>
						</div>
						<header class="align-left">
							<h3>${escapeHtml(album.artist)}</h3>
							<p>${escapeHtml(album.title)}</p>
						</header>
					</article>
				</div>
				`;
            }).join('');

            $container.append(html);

            genresAlbumsVisible += genresAlbumsPerLoad;

            // eventos
            $container.find('.album-card').off().on('click', function(e) {
                e.preventDefault();
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) openPlayer(id, type);
            });

            setupBannerFillColorEvents('genresAlbumsList');

            updateLoadMoreGenresButton();
        }

        // 4. BOTÃO LOAD MORE
        function updateLoadMoreGenresButton() {

            let $btn = $('#loadMoreGenresAlbums');

            if (!$btn.length) {
                $('#genresAlbumsList').after(`
					<div class="align-center" style="margin-top:50px;">
						<button id="loadMoreGenresAlbums" class="button loadmore large">Carregar mais</button>
					</div>
				`);
                $btn = $('#loadMoreGenresAlbums');
            }

            if (genresAlbumsVisible >= genresAlbumsData.length) {
                $btn.hide();
            } else {
                $btn.show();
            }
        }

        // 5. EVENTO DO BOTÃO
        $(document).on('click', '#loadMoreGenresAlbums', function() {
            loadMoreGenresAlbums();
        });

        // Labels List
        // 1. VARIÁVEIS
        let allLabelsData = [];
        let labelsVisible = 0;
        const labelsPerLoad = 12;

        // 2. FUNÇÃO PRINCIPAL (renderAllLabels)
        function renderAllLabels() {

            const $container = $('#labelsList');
            if (!$container.length) return;

            const $titleElement = $('#labelsTitle');
            if ($titleElement.length) {
                $titleElement.text('Labels / Selos');
            }

            if (!mockLabels || !mockLabels.length) {
                $container.html('<p>Nenhuma label disponível.</p>');
                return;
            }

            // salva lista ordenada
            allLabelsData = mockLabels
                .slice()
                .sort((a, b) => (b.id || 0) - (a.id || 0));

            labelsVisible = 0;

            $container.empty();

            loadMoreLabels(); // primeira carga
        }

        // 3. FUNÇÃO LOAD MORE
        function loadMoreLabels() {

            const $container = $('#labelsList');

            const nextItems = allLabelsData.slice(
                labelsVisible,
                labelsVisible + labelsPerLoad
            );

            if (!nextItems.length) return;

            const html = nextItems.map(label => `
				<div class="album-card label-card" data-label="${label.name}">
					<article class="box post">
						<div class="content">
							<div class="image fit circles md-ripples ripples-light" data-position="center">
								<img src="${label.image || ''}" alt="${escapeHtml(label.name)}" loading="lazy">
							</div>
						</div>
						<header class="align-center">
							<h3>${escapeHtml(label.name)}</h3>
							<p>${escapeHtml(label.country || '')}</p>
						</header>
					</article>
				</div>
			`).join('');

            $container.append(html);

            labelsVisible += labelsPerLoad;

            // evento de clique
            $container.find('.label-card').off('click').on('click', function() {
                const labelName = $(this).data('label');
                renderLabelDetails(labelName);
                switchTab('labelDetails');
            });

            setupBannerFillColorEvents('labelsList');

            updateLoadMoreLabelsButton();
        }

        // 4. BOTÃO LOAD MORE
        function updateLoadMoreLabelsButton() {

            let $btn = $('#loadMoreLabels');

            if (!$btn.length) {
                $('#labelsList').after(`
					<div class="align-center" style="margin-top:50px;">
						<button id="loadMoreLabels" class="button loadmore large">Carregar mais</button>
					</div>
				`);
                $btn = $('#loadMoreLabels');
            }

            if (labelsVisible >= allLabelsData.length) {
                $btn.hide();
            } else {
                $btn.show();
            }
        }

        // 5. EVENTO DO BOTÃO
        $(document).on('click', '#loadMoreLabels', function() {
            loadMoreLabels();
        });

        // 🔹 função de re-renderização dos artist label
        function renderLabelDetails(labelName) {
			
			updatePageTitle(labelName, 'label'); // 👈 AQUI

            const $title = $('#labelTitle');
            const $container = $('#labelArtistsList');

            if (!$container.length || !$title.length) return;

            // 🔹 título com estilo
            $title.html(`Selos de <span class="artist-labels">${escapeHtml(labelName)}</span>`);

            const items = (currentData.featured || [])
                .filter(item =>
                    (item.label || '').toLowerCase() === labelName.toLowerCase()
                );

            if (!items.length) {
                $container.html('<p class="no-artists-found icon solid fa-record-vinyl"> Nenhum albun encontrado.</p>');
                return;
            }

            $container.html(items.map(item => `
				<div class="album-card" data-id="${item.id}" data-type="featured">
					<article class="box post">
						<div class="content">
							<div class="image fit md-ripples ripples-light" data-position="center">
								<img src="${item.image || ''}" alt="${escapeHtml(item.title || '')}" loading="lazy">
							</div>
							<ul class="icons">
								<li><button type="button" class="icon solid fa-play"></button></li>
							</ul>
						</div>
						<header class="align-left">
							<h3>${escapeHtml(item.artist || '')}</h3>
							<p>${escapeHtml(item.title || '')}</p>
						</header>
					</article>
				</div>
			`).join(''));

            // 🔹 abrir player
            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');

                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // Função openPlayer
        window.openPlayer = function(id) {

            const item = (currentData.featured || [])
                .find(x => parseInt(x.id) === parseInt(id));

            if (!item || !item.embedUrl) {
                console.warn('❌ Item não encontrado:', id);
                return;
            }
			
			// 🧠 AQUI 👇 (POSIÇÃO CERTA)
			updatePageTitle(item, 'song');

            console.log('🎵 PLAYER:', item);

            // Iframe
            const $embedContainer = $('.player-embed');

            $embedContainer.html(`
				<div class="player-loading">
					<span class="spinner"></span>
					<p>Carregando...</p>
				</div>
			`);

            const $iframe = $(`
				<iframe 
					src="${item.embedUrl}" 
					frameborder="0" 
					allow="autoplay" 
					scrolling="no">
				</iframe>
			`);

            $iframe.on('load', function() {
                $embedContainer.fadeOut(100, function() {
                    $embedContainer.html($iframe).fadeIn(200);
                });
            });

            $iframe.css('opacity', 0);
            $embedContainer.append($iframe);

            setTimeout(() => {
                if ($embedContainer.find('.player-loading').length) {
                    $embedContainer.html($iframe);
                    $iframe.css('opacity', 1);
                }
            }, 5000);

            // UI
            $('#playerImage').attr('src', item.image || '');
            $('#playerTitle').text(item.title || '');
            $('#playerArtist').text(item.artist || '');

            $('#detailArtist').text(item.artist || '');
            $('#detailYear').text(item.year || '');
            $('#detailLabel').text(item.label || '');
            $('#detailCountry').text(item.country || '');
            $('#detailFormat').text(item.format || '');
            $('#detailGenre').text(item.genre || '');
            $('#detailStyle').text(item.style || '');

            // Ativar Player
            $('#player-bar').addClass('opened active').fadeIn(200);
            $('#player-page').addClass('showmore').fadeIn(200);

            // Extras
            showRelatedAlbums(item.artist, id);
            saveToRecentlyPlayed({
                id,
                type: 'featured'
            });
        };

        // Funções de renderização relatedAlbums
        function showRelatedAlbums(artist, currentId) {
            const $container = $('#relatedAlbums');
            const $title = $('#relatedArtistName');

            if (!$container.length || !$title.length) return;

            const allItems = [
                ...(currentData.albums || []),
                ...(currentData.singles || []),
                ...(currentData.vinyls || []),
                ...(currentData.featured || []),
                ...(currentData.playlists || []),
                ...(currentData.djs || []),
                ...(currentData.instrumental || [])
            ];

            // Todos os álbuns do artista
            const artistAlbums = allItems
                .filter(item => item.artist === artist)
                .sort((a, b) => {
                    if (a.id === currentId) return -1; // joga pra cima
                    if (b.id === currentId) return 1;
                    return (b.id || 0) - (a.id || 0); // mantém ordenação por id
                });

            $title.html(`Mais de <span class="artist-name">${artist}</span>`);

            if (artistAlbums.length === 0) {
                $container.html('<p>Nenhum álbum encontrado.</p>');
                return;
            }

            $container.html(artistAlbums.map(album => `
				<div class="album-card ${album.id === currentId ? 'current' : ''}" data-id="${album.id}" data-type="featured">
					<article class="box post avg md-ripples ripples-light">
						<div class="content">
							<div class="image fit" data-position="center">
								<img src="${album.image}" alt="${escapeHtml(album.title)}" loading="lazy">
							</div>
							<ul class="icons">
								<li class="alt1"><button type="button" class="icon solid fa-play"></button></li>
								<li class="alt2"><button type="button" class="icon wave"><span></span><span></span><span></span></span></button></li>
							</ul>
						</div>
						<header class="align-left">
							<h3 class="album-artist">${escapeHtml(album.artist)}</h3>
							<p class="album-title">${escapeHtml(album.title)}</p>
						</header>
					</article>
				</div>
			`).join(''));

            // Aplica fillColor apenas no container atual
            $container.find('.avg').fillColor({
                type: 'avg'
            });

            // Reaplica eventos de clique
            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                openPlayer(id, type);
            });
        }

        function toggleRelated(li) {
            const $relatedContainer = $('#relatedContainer');
            if (!$relatedContainer.length) return;

            $relatedContainer.slideToggle(300, () => {
                if ($relatedContainer.is(':visible')) {
                    $(li).addClass('active'); // marca como ativo
                } else {
                    $(li).removeClass('active'); // remove ativo
                }
            });
        }

        $(document).on("click", ".fa-list", function(e) {
            e.preventDefault();
            toggleRelated(this);
        });

        // Alterna o corpo do player
        function togglePlayerBody() {
            const $playerPage = $("#player-page");
            const $mainPanel = $("#main-panel");
            const $sidePanel = $("#side-panel");
            const $arrow = $("#player-bar .fa-long-arrow-down"); // seta única

            if (!$playerPage.length) return;

            // alterna visibilidade do player
            $playerPage.toggleClass("showmore");
            const isOpen = $playerPage.hasClass("showmore");

            if ($mainPanel.length) $mainPanel.css('display', isOpen ? "block" : "none");
            if ($sidePanel.length) $sidePanel.css('display', isOpen ? "block" : "none");

            // alterna a rotação da seta
            $arrow.toggleClass("rotated", isOpen);
        }

        // Clique no ícone
        $(document).on("click", "#player-bar .fa-long-arrow-down", function(e) {
            e.preventDefault();
            togglePlayerBody();
        });

        // Quando clicar num album-card → abre player e garante seta pra baixo
        $(document).on("click", ".play-album, .fa-play", function() {
            const $playerPage = $("#player-page");
            const $arrow = $("#player-bar .fa-long-arrow-down");

            $playerPage.addClass("showmore");
            $("#main-panel, #side-panel").css('display', "block");
            $arrow.addClass("rotated"); // seta desce
        });

        // Content transition
        $(document).on('click', function(e) {
            const target = $(e.target).closest('.album-card, .playlist-card, .artist-card, .genre-card');
            if (target.length) {
                target.css('transform', 'scale(0.98)');
                setTimeout(() => {
                    target.css('transform', '');
                }, 100);
            }
        });

        // Funções utilitárias adicionais
        function clearSearch() {
            if ($searchInput.length) {
                $searchInput.val('');
                handleSearch(); // Isso fará o reset dos dados
            }
        }

        function performSearch(term) {
            if ($searchInput.length) {
                $searchInput.val(term);
                handleSearch();
            }
        }

        function debugSearch(searchTerm = '') {
            console.log('=== DEBUG SEARCH ===');
            console.log('Search term:', searchTerm);
            console.log('Original data counts:', {
                albums: (originalData.albums || []).length,
                artists: (originalData.artists || []).length,
                playlists: (originalData.playlists || []).length,
                musics: (originalData.musics || []).length,
                singles: (originalData.singles || []).length,
                vinyls: (originalData.vinyls || []).length,
                instrumental: (originalData.instrumental || []).length,
                djs: (originalData.djs || []).length,
                featured: (originalData.featured || []).length
            });
            console.log('Current data counts:', {
                albums: (currentData.albums || []).length,
                artists: (currentData.artists || []).length,
                playlists: (currentData.playlists || []).length,
                musics: (currentData.musics || []).length,
                singles: (currentData.singles || []).length,
                vinyls: (currentData.vinyls || []).length,
                instrumental: (currentData.instrumental || []).length,
                djs: (currentData.djs || []).length,
                featured: (currentData.featured || []).length
            });
            console.log('SearchInput element:', $searchInput);
        }

        // Funções utilitárias adicionais a banner
        function setupBannerFillColorEvents(sectionId, cardSelector = '.album-card') {

            const $section = $('#' + sectionId);
            const $banner = $('.filtered');

            if (!$section.length || !$banner.length) return;

            function resetBanner() {
                $banner.stop(true, true);
                $banner.removeAttr('style');
                $banner.empty();
            }

            function applyBanner(src) {
                if (!src) return;

                resetBanner();

                const $img = $(`<img src="${src}" alt="Banner">`);
                $banner.append($img);

                $img.one('load', function() {
                    setTimeout(() => {
                        $banner.fillColor({
                            type: 'avgYUV'
                        });
                    }, 10);
                });
            }

            // primeira imagem
            const $firstImage = $section
                .find(`${cardSelector}:not(.slick-cloned) img`)
                .first();

            if ($firstImage.length) {
                applyBanner($firstImage.attr('src'));
            }

            // clique
            $section
                .off('click.bannerFillColor')
                .on('click.bannerFillColor', `${cardSelector}:not(.slick-cloned)`, function() {
                    const src = $(this).find('img').attr('src');
                    applyBanner(src);
                });
        }

        // Load Progress Bar

        // Cria progress-bar se não existir
        if (!$('#progress-bar').length) {
            $('body').prepend('<div id="progress-bar"></div>');
        }

        // Cria spinner dentro do player se não existir
        if (!$('#spinner').length) {
            $('.player-embed').prepend(`
				<div id="spinner" aria-label="Carregando">
					<div class="inner">
						<svg viewBox="0 0 50 50" class="spinner-svg">
							<circle class="spinner-path" cx="25" cy="25" r="20" fill="none" stroke-width="3"></circle>
						</svg>
					</div>
				</div>
			`);
        }

        // Estilo único para progress-bar e spinner
        const style = `
			<style>
				#progress-bar {position: fixed;top: 0;left: 0;height: 2px;width: 0%;background: #f00;z-index: 100001;opacity: 0;}.player-embed {position: relative;min-height: 300px;}#spinner {position: relative;background: #000;height: 100%;width: 100%;display: none;z-index: 1;}.inner {position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 10;}.spinner-svg {width: 48px;height: 48px;animation: rotate 2s linear infinite;}.spinner-path {stroke: #f00;stroke-linecap: round;animation: dash 1.5s ease-in-out infinite;}@keyframes rotate {100% {transform: rotate(360deg);}}@keyframes dash {0% {stroke-dasharray: 1, 150;stroke-dashoffset: 0;}50% {stroke-dasharray: 90, 150;stroke-dashoffset: -35;}100% {stroke-dasharray: 90, 150;stroke-dashoffset: -124;}}
			</style>
		`;
        $('head').append(style);

        // Funções de controle
        const startProgress = () => {
            $('#progress-bar')
                .stop(true, true)
                .css({
                    width: '0%',
                    opacity: 1,
                    display: 'block'
                })
                .animate({
                    width: '80%'
                }, 500);
        };

        const finishProgress = () => {
            $('#progress-bar')
                .stop(true)
                .animate({
                    width: '100%'
                }, 300, function() {
                    $(this).delay(100).fadeOut(400, () => {
                        $(this).css({
                            width: '0%',
                            display: 'none'
                        });
                    });
                });
        };

        // 1. Ao abrir o site
        startProgress();
        $(document).ready(function() {
            setTimeout(() => finishProgress(), 500);
        });

    });

})(jQuery);
