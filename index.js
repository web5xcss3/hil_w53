/*======================================================
 PLAY 90 MUSIC - SPA CORE BY WEB5XCSS3 - W53 DEVELOPMENT
========================================================*/

(function($) {

    "use strict";

    $(function() {

        // ===
        // API
        // ===
        const API = 'https://eurodance-api.onrender.com';

        // =====
        // DADOS
        // =====
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

        // ============
        // CARREGAR API
        // ============
        Promise.all([
                fetch(`${API}/mock`).then(res => res.json()),
                fetch(`${API}/adminItems`).then(res => res.json()),
                fetch(`${API}/labels`).then(res => res.json()),
                fetch(`${API}/genres`).then(res => res.json())
            ])

            .then(([featured, adminItems, labels, genres]) => {

                const allData = [
                    ...(adminItems || []),
                    ...(featured || [])
                ];

                console.log('API carregada:', allData);

                currentData = {

                    featured: allData,

                    albums: allData.filter(item =>
                        item.type === 'albums'
                    ),

                    singles: allData.filter(item =>
                        item.type === 'singles'
                    ),

                    vinyls: allData.filter(item =>
                        item.type === 'vinyls'
                    ),

                    instrumental: allData.filter(item =>
                        item.type === 'instrumental'
                    ),

                    djs: allData.filter(item =>
                        item.type === 'djs'
                    ),

                    musics: allData.filter(item =>
                        item.type === 'musics' || item.type === 'music'
                    ),

                    playlists: allData.filter(item =>
                        item.type === 'playlists'
                    )
                };

                // globals antigas
                window.currentData = currentData;
                window.mockFeatured = allData;
                window.mockLabels = labels;
                window.mockGenres = genres;

                // backup
                originalData.featured = [...allData];

                // RENDER
                renderAllAlbums();
                renderAllArtists();
                renderAllPlaylists();
                renderTimeline();
                renderMusics();
                renderAllSingles();
                renderAllVinyls();
                renderAllDjs();
                renderAllInstrumental();
                renderAllVideos();
                renderFeaturedAlbums();
                renderRecentlyPlayed();
                renderFeaturedDjs();
                renderAllLabels();
                renderDailyFeaturedTitles();
                renderAllGenres();
                renderTopArtistsHome();

            })
            .catch(err => {
                console.error('Erro API:', err);
            });

        // UTILS
        function escapeHtml(str) {
            if (!str) return '';
            return String(str).replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }

        let searchTimeout;

        // ==================
        // EVENTOS (SPA SAFE)
        // ==================
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
				#backToInstrumentaisBtn,
				#backToVideos
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

        // ==================
        // TABS (SEM CACHE ❗)
        // ==================
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

        // =====
        // STATS
        // =====
        function updateStats() {
            $('#albumCount').text((currentData.albums || []).length);
            $('#artistCount').text((currentData.artists || []).length);
            $('#playlistCount').text((currentData.playlists || []).length);
        }

        // EXPOR GLOBAL
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
        window.renderAllVideos = renderAllVideos;
        window.renderFeaturedAlbums = renderFeaturedAlbums;
        window.renderRecentlyPlayed = renderRecentlyPlayed;
        window.renderFeaturedDjs = renderFeaturedDjs;
        window.renderAllLabels = renderAllLabels;
        window.renderDailyFeaturedTitles = renderDailyFeaturedTitles;
        window.renderAllGenres = renderAllGenres;
        window.renderVideos = renderVideos;
        window.renderHomeVideos = renderHomeVideos;

        // INIT
        setupEventListeners();

        // ====================
        // HOME FEATURED ALBUMS
        // ====================
        function renderFeaturedAlbums() {

            const $container = $('#featuredAlbums');
            if (!$container.length) return;

            const $titleElement = $('#featuredTitle');
            if ($titleElement.length) {
                $titleElement.text('Featured álbuns');
            }

            const $banner = $('.filtered');
            let bannerTimeout;

            const featuredAlbums = (currentData.featured || [])
                .slice()
                .sort((a, b) => (b.id || 0) - (a.id || 0))
                .slice(0, 20);

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

            function updateBannerFromImage(imgUrl) {

                if (!imgUrl || !$banner.length) return;

                clearTimeout(bannerTimeout);

                bannerTimeout = setTimeout(() => {

                    if ($banner.data('current') === imgUrl) return;

                    $banner.data('current', imgUrl);
                    $banner.html(`<img src="${imgUrl}" alt="Banner Image">`);

                    const img = new Image();

                    img.onload = function() {
                        if ($.fn.fillColor) {
                            $banner.fillColor({
                                type: 'avgYUV'
                            });
                        }
                    };

                    img.src = imgUrl;

                }, 80);
            }

            function updateBannerFromSlide($slide) {
                const imgUrl = $slide.find('img').attr('src');
                updateBannerFromImage(imgUrl);
            }

            if ($container.hasClass('slick-initialized')) {
                $container.slick('unslick');
            }

            $container
                .off('init.featuredBanner')
                .off('afterChange.featuredBanner')
                .on('init.featuredBanner', function(event, slick) {
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
                    <li>
                        <button type="button" class="icon solid fa-chevron-right md-ripples ripples-light"></button>
                    </li>
                </ul>`,

                    prevArrow: `
                <ul class="icons">
                    <li>
                        <button type="button" class="icon solid fa-chevron-left md-ripples ripples-light"></button>
                    </li>
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
                .on('afterChange.featuredBanner', function(event, slick, currentSlide) {
                    const $current = slick.$slides.eq(currentSlide);
                    updateBannerFromSlide($current);
                });

            $container
                .off('click.featuredPlayer')
                .on('click.featuredPlayer', '.album-card:not(.slick-cloned)', function() {

                    const id = parseInt($(this).data('id'), 10);
                    const type = $(this).data('type');
                    const imgUrl = $(this).find('img').attr('src');

                    updateBannerFromImage(imgUrl);

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

        // ==========================
        // HOME DAILY FEATURED TITLES
        // ==========================
        function renderDailyFeaturedTitles() {

            const $container = $('#dailyFeaturedTitles');
            const $titleElement = $('#dailyFeaturedTitle');

            if (!$container.length) return;

            const today = new Date().toISOString().split('T')[0];

            // cache novo para evitar usar cache antigo duplicado
            const cacheKey = 'dailyFeaturedTitlesCache_v3';
            const indexKey = 'dailyFeaturedIndex_v3';

            const normalize = text => String(text || '').toLowerCase().trim();

            // dados automáticos da mockData/mockFeatured
            const allItemsRaw = window.mockFeatured || currentData.featured || [];

            // remove duplicados
            const seen = new Set();

            const allItems = allItemsRaw.filter(item => {
                if (!item) return false;

                const key = [
                    normalize(item.artist),
                    normalize(item.title || item.name),
                    normalize(item.embedUrl)
                ].join('|');

                if (seen.has(key)) return false;

                seen.add(key);
                return true;
            });

            // artistas automáticos vindos da mockData
            const targetThemes = [
                ...new Set(
                    allItems
                    .map(item => item.artist)
                    .filter(Boolean)
                )
            ];

            let selected = [];
            let currentIndex = parseInt(localStorage.getItem(indexKey), 10) || 0;
            let themeOfDay = '';

            let cachedData = JSON.parse(localStorage.getItem(cacheKey)) || {};

            if (cachedData.date !== today) {
                localStorage.removeItem(cacheKey);
                cachedData = {};
            }

            if (cachedData.items && cachedData.items.length) {

                selected = cachedData.items;
                themeOfDay = cachedData.theme || '';

            } else {

                const total = targetThemes.length;
                let attempts = 0;

                while (attempts < total) {

                    themeOfDay = targetThemes[currentIndex % total];

                    const matchingItems = allItems.filter(item =>
                        normalize(item.artist) === normalize(themeOfDay)
                    );

                    if (matchingItems.length > 0) {

                        selected = shuffleArray(matchingItems).slice(0, 12);

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

                if (!selected.length) {
                    selected = shuffleArray(allItems).slice(0, 12);
                    themeOfDay = 'Destaques';
                }
            }

            if ($titleElement.length) {
                $titleElement.html(
                    `Especial • <span class="artist-name">${escapeHtml(themeOfDay)}</span>`
                );
            }

            if ($container.hasClass('slick-initialized')) {
                $container.slick('unslick');
            }

            $container.html(selected.map(item => `
    <div class="daily-hero-slide">
        <article class="daily-hero-card avgYUV">

            <div class="daily-hero-content">
                <span class="daily-badge">DESTAQUE</span>

                <h2>${escapeHtml(item.artist || '')}<br>
                    ${escapeHtml(item.title || item.name || '')}
                </h2>

                <p>Os clássicos que marcaram uma geração. Reviva agora!</p>

                <button type="button"
                    class="daily-play md-ripples ripples-light"
                    data-id="${item.id || ''}"
                    data-type="${item.type || 'featured'}">
                    Ouvir agora
                </button>
            </div>

            <div class="daily-hero-image">
                <img src="${item.image || ''}" alt="${escapeHtml(item.title || item.name || '')}" loading="lazy">
            </div>

        </article>
    </div>
`).join(''));

            $container.find('.avgYUV').fillColor({
                type: 'avgYUV'
            });

            $container.slick({
                focusOnSelect: true,
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 300,

                appendArrows: $('#daily-slick-arrow'),

                nextArrow: `
        <button type="button"
            class="daily-arrow next icon solid fa-chevron-right md-ripples ripples-light">
        </button>
    `,

                prevArrow: `
        <button type="button"
            class="daily-arrow prev icon solid fa-chevron-left md-ripples ripples-light">
        </button>
    `
            });

            $container.find('.daily-play').off('click').on('click', function() {
                const id = $(this).attr('data-id');
                const type = $(this).attr('data-type');

                if (id) {
                    openPlayer(id, type);
                }
            });

        }

        // ===================
        // FUCTION TOP ARTISTS HOME
        // ===================
        function renderTopArtistsHome() {

            const $container = $('#topArtistsHome');
            if (!$container.length) return;

            const $titleElement = $('#topArtistsHomeTitle');
            if ($titleElement.length) {
                $titleElement.text('Top Artistas');
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

            const topArtists = Object.values(albumsByArtist)
                .sort((a, b) => b.albumCount - a.albumCount)
                .slice(0, 12);

            if (!topArtists.length) {
                $container.html('<p>Nenhum artista encontrado.</p>');
                return;
            }

            if ($container.hasClass('slick-initialized')) {
                $container.slick('unslick');
            }

            $container.html(topArtists.map(artist => `
        <div class="top-artist-slide">
			<article class="box post avg top-artist-card" data-artist="${escapeHtml(artist.name)}">
                <div class="content">
                    <div class="image fit md-ripples ripples-light" data-position="center">
                        <img src="${artist.image}" alt="${escapeHtml(artist.name)}" loading="lazy">
                    </div>
                    <ul class="icons">
                        <li><button type="button" class="icon solid fa-play"></button></li>
                    </ul>
                </div>
                <header class="align-center">
                    <h3 class="album-artist">${escapeHtml(artist.name)}</h3>
                    <p class="album-title">${artist.albumCount} Álbuns</p>
                </header>
            </article>
			
        </div>
    `).join(''));

            $container.slick({
                focusOnSelect: true,
                infinite: true,
                slidesToShow: 6,
                slidesToScroll: 1,
                speed: 300,
                appendArrows: $('#topArtists-slick-arrow'),

                nextArrow: `
                <ul class="icons">
                    <li>
                        <button type="button" class="icon solid fa-chevron-right md-ripples ripples-light"></button>
                    </li>
                </ul>`,

                prevArrow: `
                <ul class="icons">
                    <li>
                        <button type="button" class="icon solid fa-chevron-left md-ripples ripples-light"></button>
                    </li>
                </ul>`,

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
                            slidesToShow: 2
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

            // efeito visual
            $container.find('.avg').fillColor({
                type: 'avg'
            });

            $container.find('.top-artist-card').off('click').on('click', function() {
                const artistName = $(this).data('artist');
                if (!artistName) return;

                switchTab('subalbums');
                renderSubAlbumsByArtist(artistName);
            });

        }

        // =================
        // HOME FEATURED DJS
        // =================
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

        // =====================
        // HOME RECENT PLAYED
        // =====================
        function renderRecentlyPlayed() {
            const $container = $('#recentlyPlayed');
            if (!$container.length) return;

            const $titleElement = $('#recentlyPlayedTitle');

            if ($titleElement.length) {
                $titleElement.text('Recently Played');
            }

            const stored = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
            const allItems = window.mockFeatured || currentData.featured || [];

            const items = stored.map(entry => {

                // YouTube
                if (entry.type === 'youtube') {
                    return {
                        id: entry.id,
                        type: 'youtube',
                        title: entry.title || 'YouTube Video',
                        artist: entry.artist || 'YouTube',
                        image: entry.image || `https://img.youtube.com/vi/${entry.id}/hqdefault.jpg`
                    };
                }

                // MockData
                const item = allItems.find(album =>
                    String(album.id) === String(entry.id) &&
                    String(album.type || 'featured') === String(entry.type || 'featured')
                );

                if (!item) return null;

                return {
                    ...item,
                    type: item.type || entry.type || 'featured'
                };

            }).filter(Boolean);

            if ($container.hasClass('slick-initialized')) {
                $container.slick('unslick');
            }

            if (!items.length) {
                $container.html('');
                return;
            }

            $container.html(items.map(item => {
                const title = item.title || item.name || 'Sem título';
                const artist = item.artist || 'Vários Artistas';
                const image = item.image || 'https://i.ibb.co/m5Cb336C/music-default.jpg';

                return `
            <div class="album-card"
                 data-id="${item.id}"
                 data-type="${item.type}"
                 data-title="${escapeHtml(title)}"
                 data-artist="${escapeHtml(artist)}"
                 data-image="${image}">

                <article class="box post">
                    <div class="content">
                        <div class="image fit md-ripples ripples-light" data-position="center">
                            <img src="${image}" alt="${escapeHtml(title)}" loading="lazy">
                        </div>

                        <ul class="icons">
                            <li>
                                <button type="button" class="icon solid fa-play"></button>
                            </li>
                        </ul>
                    </div>

                    <header class="align-left">
                        <h3>${escapeHtml(artist)}</h3>
                        <p>${escapeHtml(title)}</p>
                    </header>
                </article>
            </div>
        `;
            }).join(''));

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

            $container.find('.album-card').off('click').on('click', function() {
                const id = $(this).attr('data-id');
                const type = $(this).attr('data-type');
                const title = $(this).attr('data-title');
                const artist = $(this).attr('data-artist');
                const image = $(this).attr('data-image');

                if (type === 'youtube') {
                    openPlayerYoutube(id, title, image, artist);
                    return;
                }

                openPlayer(id, type);
            });
        }


        function saveToRecentlyPlayed(item) {
            const key = 'recentlyPlayed';
            const stored = JSON.parse(localStorage.getItem(key)) || [];

            const id = String(item.id);
            const type = String(item.type || 'featured');

            const filtered = stored.filter(entry =>
                !(String(entry.id) === id && String(entry.type || 'featured') === type)
            );

            filtered.unshift({
                id: id,
                type: type,
                title: item.title || '',
                artist: item.artist || '',
                image: item.image || ''
            });

            localStorage.setItem(key, JSON.stringify(filtered.slice(0, 8)));

            renderRecentlyPlayed();
        }

        // =========================
        // FUCTION ALL INSTRUMENTALS
        // =========================
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

            setupBannerFillColorEvents('allInstrumentals', {
                autoFirstImage: false
            });

            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // ===============
        // FUCTION ALL DJS
        // ===============
        let djsData = [];
        let djsVisible = 0;
        const djsPerLoad = 11;

        function renderAllDjs() {

            const $container = $('#allDjs');
            if (!$container.length) return;

            $('#djsTitle').text('Mix de DJs');

            djsData = [
                ...(currentData.featured || []).filter(item =>
                    item.format?.toLowerCase().includes('dj')
                )
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            djsVisible = 0;

            $container.empty();

            renderMoreDjs();
        }


        // carregar mais DJs
        function renderMoreDjs() {

            const $container = $('#allDjs');
            if (!$container.length) return;

            $('.loadmore-djs-card').remove();

            const nextItems = djsData.slice(
                djsVisible,
                djsVisible + djsPerLoad
            );

            const html = nextItems.map(dj => `
        <div class="album-card" data-id="${dj.id || ''}" data-type="featured">
            <article class="box post">
                <div class="content">
                    <div class="image fit md-ripples ripples-light" data-position="center">
                        <img src="${dj.image || ''}" alt="${escapeHtml(dj.title || '')}" loading="lazy">
                    </div>

                    <ul class="icons">
                        <li>
                            <button type="button" class="icon solid fa-play"></button>
                        </li>
                    </ul>
                </div>

                <header class="align-left">
                    <h3 class="album-artist">${escapeHtml(dj.artist || '')}</h3>
                    <p class="album-title">${escapeHtml(dj.title || '')}</p>
                </header>
            </article>
        </div>
    `).join('');

            $container.append(html);

            djsVisible += djsPerLoad;

            renderLoadMoreDjsCard();

            setupBannerFillColorEvents('allDjs', {
                autoFirstImage: false
            });

            $container.find('.album-card')
                .not('.loadmore-djs-card')
                .off('click')
                .on('click', function() {

                    const id = parseInt($(this).data('id'));
                    const type = $(this).data('type');

                    if (!isNaN(id)) {
                        openPlayer(id, type);
                    }
                });
        }


        // botão load more como card
        function renderLoadMoreDjsCard() {

            const $container = $('#allDjs');

            $('#loadMoreDjs').closest('.align-center').remove();
            $('.loadmore-djs-card').remove();

            if (djsVisible >= djsData.length) return;

            $container.append(`
        <div class="album-card loadmore-djs-card">
            <article class="box post loadmore-post">
                <button id="loadMoreDjs"
                        type="button"
                        class="loadmore-card-button md-ripples ripples-light">

                    <span class="loadmore-plus">
                        <i class="icon solid fa-plus"></i>
                    </span>

                    <strong>Adicionar mais</strong>
                    <small>DJs</small>

                </button>
            </article>
        </div>
    `);
        }


        // evento
        $(document)
            .off('click', '#loadMoreDjs')
            .on('click', '#loadMoreDjs', function(e) {
                e.preventDefault();
                e.stopPropagation();

                renderMoreDjs();
            });

        // ==================
        // FUCTION ALL MUSICS
        // ==================
        function renderMusics() {
            const $container = $('#allMusics');
            if (!$container.length) return;

            const $titleElement = $('#musicsTitle');
            if ($titleElement.length) {
                $titleElement.text('Músicas');
            }

            const sortedMusics = (currentData.featured || [])
                .filter(music => music.format === "Music") // apenas músicas
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

            setupBannerFillColorEvents('allMusics', {
                autoFirstImage: false
            });

            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');
                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // ==================
        // FUCTION ALL ALBUMS
        // ==================
        let albumsData = [];
        let albumsVisible = 0;
        const albumsPerLoad = 11;

        function renderAllAlbums() {

            const $container = $('#allAlbums');
            if (!$container.length) return;

            $('#albumsTitle').text('Álbuns');

            albumsData = [
                ...(currentData.featured || []).filter(item =>
                    item.format?.toLowerCase().includes('album')
                )
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            albumsVisible = 0;

            $container.empty();

            renderMoreAlbums();
        }


        // ==================
        // LOAD MORE
        // ==================
        function renderMoreAlbums() {

            const $container = $('#allAlbums');

            // remove botão/card antigo
            $('.loadmore-card').remove();

            const nextItems = albumsData.slice(
                albumsVisible,
                albumsVisible + albumsPerLoad
            );

            const html = nextItems.map(album => `
        <div class="album-card"
             data-id="${album.id || ''}"
             data-type="featured">

            <article class="box post">
                <div class="content">

                    <div class="image fit md-ripples ripples-light"
                         data-position="center">

                        <img src="${album.image || ''}"
                             alt="${escapeHtml(album.title || '')}"
                             loading="lazy">

                    </div>

                    <ul class="icons">
                        <li>
                            <button type="button"
                                    class="icon solid fa-play"></button>
                        </li>
                    </ul>

                </div>

                <header class="align-left">
                    <h3 class="album-artist">
                        ${escapeHtml(album.artist || '')}
                    </h3>

                    <p class="album-title">
                        ${escapeHtml(album.title || '')}
                    </p>
                </header>
            </article>
        </div>
    `).join('');

            $container.append(html);

            albumsVisible += albumsPerLoad;

            // ==================
            // BOTÃO COMO CARD
            // ==================
            if (albumsVisible < albumsData.length) {

                $container.append(`
    <div class="album-card loadmore-card">
        <article class="box post loadmore-post">
            <button id="loadMoreAlbums"
                    type="button"
                    class="loadmore-card-button md-ripples ripples-light">

                <span class="loadmore-plus">
                    <i class="icon solid fa-plus"></i>
                </span>

                <strong>Adicionar mais</strong>
                <small>Álbuns</small>

            </button>
        </article>
    </div>
`);

                $('#loadMoreAlbums')
                    .off('click')
                    .on('click', function() {
                        renderMoreAlbums();
                    });
            }

            // reativa efeitos
            setupBannerFillColorEvents('allAlbums', {
                autoFirstImage: false
            });

            $container.find('.album-card')
                .not('.loadmore-card')
                .off('click')
                .on('click', function() {

                    const id = parseInt($(this).data('id'));
                    const type = $(this).data('type');

                    if (!isNaN(id)) {
                        openPlayer(id, type);
                    }
                });
        }

        // ===================
        // FUCTION ALL ARTISTS
        // ===================

        // 1:VARIÁVEIS
        let allArtistsData = [];
        let artistsVisible = 0;
        const artistsPerLoad = 17;

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
                        image: album.image || 'https://i.ibb.co/m5Cb336C/music-default.jpg',
                        latestId: album.id || 0
                    };
                }

                // conta álbuns
                acc[album.artist].albumCount++;

                // pega o maior ID (mais recente)
                if ((album.id || 0) > acc[album.artist].latestId) {
                    acc[album.artist].latestId = album.id;
                    acc[album.artist].image = album.image || acc[album.artist].image;
                }

                return acc;

            }, {});

            // ORDENA PELOS MAIS RECENTES
            allArtistsData = Object.values(albumsByArtist)
                .sort((a, b) => (b.latestId || 0) - (a.latestId || 0));

            artistsVisible = 0;

            $container.empty();

            loadMoreArtists();
        }

        // 3:FUNÇÃO LOAD MORE
        function loadMoreArtists() {

            const $container = $('#allArtists');
            if (!$container.length) return;

            // remove o card antigo antes de adicionar novos artistas
            $('.loadmore-artist-card').remove();

            const nextItems = allArtistsData.slice(
                artistsVisible,
                artistsVisible + artistsPerLoad
            );

            if (!nextItems.length) return;

            const html = nextItems.map(artist => `
        <div class="artist-card" data-artist="${escapeHtml(artist.name)}">
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

            // adiciona o botão/card no final
            renderLoadMoreArtistCard();

            // eventos
            $container.find('.artist-card')
                .not('.loadmore-artist-card')
                .off('click')
                .on('click', function() {
                    const artist = $(this).data('artist');
                    renderSubAlbumsByArtist(artist);
                });

            // efeito visual
            $container.find('.avg').fillColor({
                type: 'avg'
            });

            setupBannerFillColorEvents('allArtists', {
                autoFirstImage: false
            });
        }


        // 4:BOTÃO LOAD MORE COMO CARD
        function renderLoadMoreArtistCard() {

            const $container = $('#allArtists');

            // remove qualquer botão antigo fora do grid
            $('#loadMoreArtists').closest('.align-center').remove();

            // remove card antigo
            $('.loadmore-artist-card').remove();

            if (artistsVisible >= allArtistsData.length) return;

            $container.append(`
        <div class="artist-card loadmore-artist-card">
            <article class="box post loadmore-post">
                <button id="loadMoreArtists"
                        type="button"
                        class="loadmore-card-button md-ripples ripples-light">

                    <span class="loadmore-plus">
                        <i class="icon solid fa-plus"></i>
                    </span>

                    <strong>Adicionar mais</strong>
                    <small>Artistas</small>

                </button>
            </article>
        </div>
    `);
        }


        // 5:EVENTO DO BOTÃO
        $(document).off('click', '#loadMoreArtists').on('click', '#loadMoreArtists', function(e) {
            e.preventDefault();
            e.stopPropagation();

            loadMoreArtists();
        });

        // =================================================
        // Funções de renderização suballAlbums dos artistas
        // =================================================
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
            setupBannerFillColorEvents('suballAlbums', {
                autoFirstImage: false
            });

            // troca de aba
            switchTab('subalbums');

        }

        // ===
        // BIO
        // ===
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

        // ============
        // LER MAIS BIO
        // ============
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

        // ===========================
        // EVENTO LER MAIS / LER MENOS
        // ===========================
        $(document).on('click', '.bio-read-more', function() {

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


        // ===========
        // ESCAPE HTML
        // ===========
        function escapeHtml(text) {
            return String(text || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        // ==================
        // FUCTION ALL VINYLS
        // ==================
        let vinylsData = [];
        let vinylsVisible = 0;
        const vinylsPerLoad = 11;

        function renderAllVinyls() {

            const $container = $('#allVinyls');
            if (!$container.length) return;

            $('#vinylsTitle').text('Vinyl, 12"');

            // prepara os dados
            vinylsData = [
                ...(currentData.featured || []).filter(item =>
                    item.format?.toLowerCase().includes('vinyl')
                )
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            vinylsVisible = 0;

            $container.empty();

            renderMoreVinyls();
        }


        // carregar mais itens
        function renderMoreVinyls() {

            const $container = $('#allVinyls');
            if (!$container.length) return;

            // remove botão/card antigo
            $('.loadmore-vinyls-card').remove();

            const nextItems = vinylsData.slice(
                vinylsVisible,
                vinylsVisible + vinylsPerLoad
            );

            const html = nextItems.map(album => `
        <div class="album-card"
             data-id="${album.id || ''}"
             data-type="featured">

            <article class="box post">

                <div class="content">

                    <div class="image fit md-ripples ripples-light"
                         data-position="center">

                        <img src="${album.image || ''}"
                             alt="${escapeHtml(album.title || '')}"
                             loading="lazy">

                    </div>

                    <ul class="icons">
                        <li>
                            <button type="button"
                                    class="icon solid fa-play"></button>
                        </li>
                    </ul>

                </div>

                <header class="align-left">
                    <h3 class="album-artist">
                        ${escapeHtml(album.artist || '')}
                    </h3>

                    <p class="album-title">
                        ${escapeHtml(album.title || '')}
                    </p>
                </header>

            </article>
        </div>
    `).join('');

            $container.append(html);

            vinylsVisible += vinylsPerLoad;

            // adiciona botão/card no final
            renderLoadMoreVinylsCard();

            // efeitos
            setupBannerFillColorEvents('allVinyls', {
                autoFirstImage: false
            });

            // eventos
            $container.find('.album-card')
                .not('.loadmore-vinyls-card')
                .off('click')
                .on('click', function() {

                    const id = parseInt($(this).data('id'));
                    const type = $(this).data('type');

                    if (!isNaN(id)) {
                        openPlayer(id, type);
                    }
                });
        }


        // ==================
        // LOAD MORE CARD
        // ==================
        function renderLoadMoreVinylsCard() {

            const $container = $('#allVinyls');

            // remove botão antigo fora do grid
            $('#loadMoreVinyls').closest('.align-center').remove();

            // remove card antigo
            $('.loadmore-vinyls-card').remove();

            // se acabou os itens
            if (vinylsVisible >= vinylsData.length) return;

            $container.append(`
        <div class="album-card loadmore-vinyls-card">

            <article class="box post loadmore-post">

                <button id="loadMoreVinyls"
                        type="button"
                        class="loadmore-card-button md-ripples ripples-light">

                    <span class="loadmore-plus">
                        <i class="icon solid fa-plus"></i>
                    </span>

                    <strong>Adicionar mais</strong>
                    <small>Vinyls</small>

                </button>

            </article>

        </div>
    `);
        }


        // ==================
        // EVENTO
        // ==================
        $(document)
            .off('click', '#loadMoreVinyls')
            .on('click', '#loadMoreVinyls', function(e) {

                e.preventDefault();
                e.stopPropagation();

                renderMoreVinyls();
            });

        // ===================
        // FUCTION ALL SINGLES
        // ===================
        let singlesData = [];
        let singlesVisible = 0;
        const singlesPerLoad = 11;

        function renderAllSingles() {

            const $container = $('#allSingles');
            if (!$container.length) return;

            $('#singlesTitle').text('CD, Maxi-Single');

            singlesData = [
                ...(currentData.featured || []).filter(item =>
                    item.format?.toLowerCase().includes('single')
                )
            ].sort((a, b) => (b.id || 0) - (a.id || 0));

            singlesVisible = 0;

            $container.empty();

            renderMoreSingles();
        }


        // Função que adiciona mais itens
        function renderMoreSingles() {

            const $container = $('#allSingles');
            if (!$container.length) return;

            // remove card antigo do botão
            $('.loadmore-singles-card').remove();

            const nextItems = singlesData.slice(
                singlesVisible,
                singlesVisible + singlesPerLoad
            );

            const html = nextItems.map(album => `
        <div class="album-card" data-id="${album.id || ''}" data-type="featured">
            <article class="box post">
                <div class="content">
                    <div class="image fit md-ripples ripples-light" data-position="center">
                        <img src="${album.image || ''}" alt="${escapeHtml(album.title || '')}" loading="lazy">
                    </div>

                    <ul class="icons">
                        <li>
                            <button type="button" class="icon solid fa-play"></button>
                        </li>
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

            // botão/card sempre no final
            renderLoadMoreSinglesCard();

            setupBannerFillColorEvents('allSingles', {
                autoFirstImage: false
            });

            $container.find('.album-card')
                .not('.loadmore-singles-card')
                .off('click')
                .on('click', function() {

                    const id = parseInt($(this).data('id'));
                    const type = $(this).data('type');

                    if (!isNaN(id)) {
                        openPlayer(id, type);
                    }
                });
        }


        // BOTÃO LOAD MORE COMO CARD
        function renderLoadMoreSinglesCard() {

            const $container = $('#allSingles');

            // remove botão antigo fora do grid
            $('#loadMoreSingles').closest('.align-center').remove();

            // remove card antigo
            $('.loadmore-singles-card').remove();

            if (singlesVisible >= singlesData.length) return;

            $container.append(`
        <div class="album-card loadmore-singles-card">
            <article class="box post loadmore-post">
                <button id="loadMoreSingles"
                        type="button"
                        class="loadmore-card-button md-ripples ripples-light">

                    <span class="loadmore-plus">
                        <i class="icon solid fa-plus"></i>
                    </span>

                    <strong>Adicionar mais</strong>
                    <small>Singles</small>

                </button>
            </article>
        </div>
    `);
        }


        // EVENTO DO BOTÃO
        $(document).off('click', '#loadMoreSingles').on('click', '#loadMoreSingles', function(e) {
            e.preventDefault();
            e.stopPropagation();

            renderMoreSingles();
        });

        // =====================
        // FUCTION ALL PLAYLISTS
        // =====================
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

            setupBannerFillColorEvents('allPlaylists', {
                autoFirstImage: false
            });

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

        // ====================
        // FUCTION ALL TIMELINE
        // ====================
        function renderTimeline() {
            const $container = $('#allTimeline');
            if (!$container.length) return;

            const $titleElement = $('#timelineTitle');
            if ($titleElement.length) {
                $titleElement.text('Linha do Tempo');
            }

            const $descElement = $('#timelineTitleDesc');
            if ($descElement.length) {
                $descElement.text('A história da música eletronica no tempo');
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

            setupBannerFillColorEvents('allTimeline', {
                autoFirstImage: false
            });
        }

        // Lista de álbuns do ano clicado
        // 1. VARIÁVEIS
        let yearAlbumsData = [];
        let yearAlbumsVisible = 0;
        const yearAlbumsPerLoad = 11;

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
            if (!$container.length) return;

            $('.loadmore-yearalbums-card').remove();

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
                            <li>
                                <button type="button" class="icon solid fa-play"></button>
                            </li>
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

            renderLoadMoreYearAlbumsCard();

            $container.find('.album-card')
                .not('.loadmore-yearalbums-card')
                .off('click')
                .on('click', function(e) {
                    e.preventDefault();

                    const id = parseInt($(this).data('id'));
                    const type = $(this).data('type');

                    if (!isNaN(id)) {
                        openPlayer(id, type);
                    }
                });

            setupBannerFillColorEvents('yearAlbumsList', {
                autoFirstImage: false
            });
        }


        // 4. BOTÃO LOAD MORE COMO CARD
        function renderLoadMoreYearAlbumsCard() {

            const $container = $('#yearAlbumsList');

            $('#loadMoreYearAlbums').closest('.align-center').remove();
            $('.loadmore-yearalbums-card').remove();

            if (yearAlbumsVisible >= yearAlbumsData.length) return;

            $container.append(`
        <div class="album-card loadmore-yearalbums-card">
            <article class="box post loadmore-post">
                <button id="loadMoreYearAlbums"
                        type="button"
                        class="loadmore-card-button md-ripples ripples-light">

                    <span class="loadmore-plus">
                        <i class="icon solid fa-plus"></i>
                    </span>

                    <strong>Adicionar mais</strong>
                    <small>Álbuns</small>

                </button>
            </article>
        </div>
    `);
        }


        // 5. EVENTO DO BOTÃO
        $(document)
            .off('click', '#loadMoreYearAlbums')
            .on('click', '#loadMoreYearAlbums', function(e) {
                e.preventDefault();
                e.stopPropagation();

                loadMoreYearAlbums();
            });

        // ==================
        // FUCTION ALL GENRES
        // ==================
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
        const genresAlbumsPerLoad = 11;

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
            if (!$container.length) return;

            $('.loadmore-genres-card').remove();

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
                            <li>
                                <button type="button" class="icon solid fa-play"></button>
                            </li>
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

            renderLoadMoreGenresCard();

            $container.find('.album-card')
                .not('.loadmore-genres-card')
                .off('click')
                .on('click', function(e) {
                    e.preventDefault();

                    const id = parseInt($(this).data('id'));
                    const type = $(this).data('type');

                    if (!isNaN(id)) {
                        openPlayer(id, type);
                    }
                });

            setupBannerFillColorEvents('genresAlbumsList', {
                autoFirstImage: false
            });
        }


        // 4. BOTÃO LOAD MORE COMO CARD
        function renderLoadMoreGenresCard() {

            const $container = $('#genresAlbumsList');

            $('#loadMoreGenresAlbums').closest('.align-center').remove();
            $('.loadmore-genres-card').remove();

            if (genresAlbumsVisible >= genresAlbumsData.length) return;

            $container.append(`
        <div class="album-card loadmore-genres-card">
            <article class="box post loadmore-post">
                <button id="loadMoreGenresAlbums"
                        type="button"
                        class="loadmore-card-button md-ripples ripples-light">

                    <span class="loadmore-plus">
                        <i class="icon solid fa-plus"></i>
                    </span>

                    <strong>Adicionar mais</strong>
                    <small>Gêneros</small>

                </button>
            </article>
        </div>
    `);
        }


        // 5. EVENTO DO BOTÃO
        $(document)
            .off('click', '#loadMoreGenresAlbums')
            .on('click', '#loadMoreGenresAlbums', function(e) {
                e.preventDefault();
                e.stopPropagation();

                loadMoreGenresAlbums();
            });

        // ==========
        // ALL LABELS
        // ==========
        // Labels List
        // 1. VARIÁVEIS
        let allLabelsData = [];
        let labelsVisible = 0;
        const labelsPerLoad = 11;

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
            if (!$container.length) return;

            $('.loadmore-labels-card').remove();

            const nextItems = allLabelsData.slice(
                labelsVisible,
                labelsVisible + labelsPerLoad
            );

            if (!nextItems.length) return;

            const html = nextItems.map(label => `
        <div class="album-card label-card" data-label="${escapeHtml(label.name)}">
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

            renderLoadMoreLabelsCard();

            $container.find('.label-card')
                .not('.loadmore-labels-card')
                .off('click')
                .on('click', function() {
                    const labelName = $(this).data('label');
                    renderLabelDetails(labelName);
                    switchTab('labelDetails');
                });

            setupBannerFillColorEvents('labelsList', {
                autoFirstImage: false
            });
        }


        // 4. BOTÃO LOAD MORE COMO CARD
        function renderLoadMoreLabelsCard() {

            const $container = $('#labelsList');

            $('#loadMoreLabels').closest('.align-center').remove();
            $('.loadmore-labels-card').remove();

            if (labelsVisible >= allLabelsData.length) return;

            $container.append(`
        <div class="album-card label-card loadmore-labels-card">
            <article class="box post loadmore-post">
                <button id="loadMoreLabels"
                        type="button"
                        class="loadmore-card-button md-ripples ripples-light">

                    <span class="loadmore-plus">
                        <i class="icon solid fa-plus"></i>
                    </span>

                    <strong>Adicionar mais</strong>
                    <small>Labels</small>

                </button>
            </article>
        </div>
    `);
        }


        // 5. EVENTO DO BOTÃO
        $(document)
            .off('click', '#loadMoreLabels')
            .on('click', '#loadMoreLabels', function(e) {
                e.preventDefault();
                e.stopPropagation();

                loadMoreLabels();
            });

        // função de re-renderização dos artist label
        function renderLabelDetails(labelName) {

            updatePageTitle(labelName, 'label'); // 👈 AQUI

            const $title = $('#labelTitle');
            const $container = $('#labelArtistsList');

            if (!$container.length || !$title.length) return;

            // título com estilo
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

            // abrir player
            $container.find('.album-card').on('click', function() {
                const id = parseInt($(this).data('id'));
                const type = $(this).data('type');

                if (!isNaN(id)) {
                    openPlayer(id, type);
                }
            });
        }

        // =========
        // YT VIDEOS
        // =========
        function loadVideos(query = 'eurodance 90s') {
            const API = 'https://eurodance-api.onrender.com';

            fetch(`${API}/youtube?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.items || !data.items.length) {
                        $('#allVideos').html('<p>Nenhum vídeo encontrado.</p>');
                        return;
                    }

                    renderVideos(data.items);
                })
                .catch(err => {
                    console.error('Erro YouTube:', err);
                    $('#allVideos').html('<p>Erro ao carregar vídeos.</p>');
                });
        }

        function renderVideos(items) {
            const $container = $('#allVideos');
            if (!$container.length) return;

            $container.html(items.map(video => {
                const videoId = video.id.videoId;
                const title = video.snippet.title;
                const thumb = video.snippet.thumbnails.medium.url;

                return `
            <div class="video-card"
                 data-video-id="${videoId}"
                 data-title="${escapeHtml(title)}"
                 data-thumb="${thumb}">

                <article class="box post">
                    <div class="content">
                        <div class="image fit md-ripples ripples-light" data-position="center">
                            <img src="${thumb}" alt="${escapeHtml(title)}" loading="lazy">
                        </div>

                        <ul class="icons">
                            <li class="alt1">
                                <button type="button" class="icon solid fa-play"></button>
                            </li>
                        </ul>
                    </div>

                    <header class="align-left">
                        <h3 class="album-title">${escapeHtml(title)}</h3>
                    </header>
                </article>
            </div>
        `;
            }).join(''));
        }

        function openPlayerYoutube(videoId, title, thumb, artist = 'YouTube') {

            if (!videoId) return;

            const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`;

            $('.player-embed').html(`
        <iframe 
            src="${embedUrl}"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen>
        </iframe>
    `);

            $('#playerImage').attr('src', thumb || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
            $('#playerTitle').text(title || 'YouTube Video');
            $('#playerArtist').text(artist || 'YouTube');

            $('#detailArtist').text(artist || 'YouTube');
            $('#detailYear').text('');
            $('#detailLabel').text('');
            $('#detailCountry').text('');
            $('#detailFormat').text('Video');
            $('#detailGenre').text('');
            $('#detailStyle').text('');

            // Ativar Player
            openPlayerPanels();

            saveToRecentlyPlayed({
                id: videoId,
                type: 'youtube',
                title: title || 'YouTube Video',
                artist: artist || 'YouTube',
                image: thumb || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            });

            if (artist && artist !== 'YouTube') {
                showRelatedAlbums(artist, videoId, 'youtube');
            }
        }

        function getRandomArtist() {

            const counts = {};

            (window.mockFeatured || []).forEach(item => {

                if (!item.artist) return;

                counts[item.artist] = (counts[item.artist] || 0) + 1;

            });

            const artists = Object.entries(counts)
                .filter(([artist, count]) => count >= 2)
                .map(([artist]) => artist);

            if (!artists.length) return 'eurodance';

            return artists[
                Math.floor(Math.random() * artists.length)
            ];
        }

        function renderAllVideos() {

            const artist = getRandomArtist();

            $('#videosTitle').html(
                `Vídeos de <span class="artist-name">${artist}</span>`
            );

            loadVideos(`${artist} eurodance`);

            renderVideosArtistAlbums(artist);
        }

        function renderVideosArtistAlbums(artist) {
            const $container = $('#videosArtistAlbums');
            const $title = $('#videosArtistAlbumsTitle');

            if (!$container.length) return;

            const clean = text => String(text || '').toLowerCase().trim();

            const items = (window.mockFeatured || []).filter(item =>
                clean(item.artist) === clean(artist)
            );

            $title.html(`Músicas de <span class="artist-name">${artist}</span>`);

            if (!items.length) {
                $container.html('<p>Nenhuma música encontrada.</p>');
                return;
            }

            $container.html(items.map(item => `
        <div class="album-card"
             data-id="${item.id}"
             data-type="${item.type || 'featured'}">

            <article class="box post">
                <div class="content">
                    <div class="image fit md-ripples ripples-light">
                        <img src="${item.image || ''}" alt="${escapeHtml(item.title || '')}" loading="lazy">
                    </div>

                    <ul class="icons">
                        <li class="alt1">
                            <button type="button" class="icon solid fa-play"></button>
                        </li>
                    </ul>
                </div>

                <header class="align-left">
                    <h3 class="album-artist">${escapeHtml(item.artist || '')}</h3>
                    <p class="album-title">${escapeHtml(item.title || '')}</p>
                </header>
            </article>
        </div>
    `).join(''));

            $container.find('.avg').fillColor({
                type: 'avg'
            });

            setupBannerFillColorEvents('videosArtistAlbums', {
                autoFirstImage: false
            });
        }

        // Clique nos vídeos do YouTube
        $(document)
            .off('click', '.video-card')
            .on('click', '.video-card', function(e) {
                e.preventDefault();

                const videoId = $(this).attr('data-video-id');
                const title = $(this).attr('data-title');
                const thumb = $(this).attr('data-thumb');
                const artist = $(this).attr('data-artist') || $('#videosTitle .artist-name, #homeVideosTitle .artist-name').first().text() || 'YouTube';

                openPlayerYoutube(videoId, title, thumb, artist);
            });

        // Clique nos álbuns/músicas abaixo dos vídeos
        $(document)
            .off('click', '#videosArtistAlbums .album-card')
            .on('click', '#videosArtistAlbums .album-card', function(e) {
                e.preventDefault();

                const id = $(this).attr('data-id');
                const type = $(this).attr('data-type');

                openPlayer(id, type);
            });

        // ===========
        // HOME VIDEOS
        // ===========
        function renderHomeVideos() {

            const artist = getRandomArtist();

            $('#homeVideosTitle').html(
                `Vídeos de <span class="artist-name">${artist}</span>`
            );

            loadHomeVideos(`${artist} eurodance`);
        }


        // Load Home Videos
        function loadHomeVideos(query) {

            const API = 'https://eurodance-api.onrender.com';

            fetch(`${API}/youtube?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {

                    if (!data.items || !data.items.length) {

                        $('#homeVideos').html(
                            '<p>Nenhum vídeo encontrado.</p>'
                        );

                        return;
                    }

                    renderHomeVideosSlider(data.items);

                })
                .catch(err => {

                    console.error('Erro Home Videos:', err);

                    $('#homeVideos').html(
                        '<p>Erro ao carregar vídeos.</p>'
                    );

                });
        }

        // Render Home Videos Slider
        function renderHomeVideosSlider(items) {

            const $container = $('#homeVideos');

            if (!$container.length) return;

            // destroy slick
            if ($container.hasClass('slick-initialized')) {
                $container.slick('unslick');
            }

            $container.html(items.map(video => {

                const videoId = video.id.videoId;
                const title = video.snippet.title;
                const thumb = video.snippet.thumbnails.medium.url;

                return `
            <div class="video-card"
                 data-video-id="${videoId}"
                 data-title="${escapeHtml(title)}"
                 data-thumb="${thumb}">

                <article class="box post">

                    <div class="content">

                        <div class="image fit md-ripples ripples-light" data-position="center">
                            <img src="${thumb}" alt="${escapeHtml(title)}" loading="lazy">
                        </div>

                        <ul class="icons">
                            <li>
                                <button type="button" class="icon solid fa-play"></button>
                            </li>
                        </ul>

                    </div>

                    <header class="align-left">
                        <p class="album-title">${escapeHtml(title)}</p>
                    </header>

                </article>
            </div>
        `;

            }).join(''));

            $container.slick({
                focusOnSelect: true,
                infinite: true,
                slidesToShow: 4,
                slidesToScroll: 1,
                speed: 300,

                appendArrows: $('#homeVideos-slick-arrow'),

                nextArrow: '<ul class="icons"><li><button type="button" class="icon solid fa-chevron-right md-ripples ripples-light"></button></li></ul>',

                prevArrow: '<ul class="icons"><li><button type="button" class="icon solid fa-chevron-left md-ripples ripples-light"></button></li></ul>',

                responsive: [{
                        breakpoint: 1280,
                        settings: {
                            slidesToShow: 4
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

        // ======================
        // FUCTION RELATED ALBUMS
        // ======================
        function showRelatedAlbums(artist, currentId, currentType = '') {
            const $container = $('#relatedAlbums');
            const $title = $('#relatedArtistName');

            if (!$container.length || !$title.length) return;

            const normalize = text => String(text || '').toLowerCase().trim();

            const allItemsRaw = window.mockFeatured || currentData.featured || [];

            const seen = new Set();

            const allItems = allItemsRaw.filter(item => {
                if (!item) return false;

                const key = [
                    normalize(item.artist),
                    normalize(item.title || item.name),
                    normalize(item.embedUrl)
                ].join('|');

                if (seen.has(key)) return false;

                seen.add(key);
                return true;
            });

            const artistAlbums = allItems
                .filter(item => normalize(item.artist) === normalize(artist))
                .sort((a, b) => {
                    const aCurrent =
                        String(a.id) === String(currentId) &&
                        String(a.type || 'featured') === String(currentType || a.type || 'featured');

                    const bCurrent =
                        String(b.id) === String(currentId) &&
                        String(b.type || 'featured') === String(currentType || b.type || 'featured');

                    if (aCurrent) return -1;
                    if (bCurrent) return 1;

                    return String(b.id).localeCompare(String(a.id));
                });

            $title.html(`Mais de <span class="artist-name">${escapeHtml(artist || '')}</span>`);

            if (!artistAlbums.length) {
                $container.html('<p>Nenhum álbum encontrado.</p>');
                return;
            }

            $container.html(artistAlbums.map(album => `
        <div class="album-card ${
            String(album.id) === String(currentId) &&
            String(album.type || 'featured') === String(currentType || album.type || 'featured')
                ? 'current'
                : ''
        }"
             data-id="${album.id}"
             data-type="${album.type || 'featured'}">

            <article class="box post avg md-ripples ripples-light">
                <div class="content">
                    <div class="image fit" data-position="center">
                        <img src="${album.image || ''}" alt="${escapeHtml(album.title || album.name || '')}" loading="lazy">
                    </div>

                    <ul class="icons">
                        <li class="alt1">
                            <button type="button" class="icon solid fa-play"></button>
                        </li>
                        <li class="alt2">
                            <button type="button" class="icon wave">
                                <span></span><span></span><span></span>
                            </button>
                        </li>
                    </ul>
                </div>

                <header class="align-left">
                    <h3 class="album-artist">${escapeHtml(album.artist || '')}</h3>
                    <p class="album-title">${escapeHtml(album.title || album.name || '')}</p>
                </header>
            </article>
        </div>
    `).join(''));

            $container.find('.avg').fillColor({
                type: 'avg'
            });

            $container.find('.album-card').off('click').on('click', function() {
                const id = $(this).attr('data-id');
                const type = $(this).attr('data-type');

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

        // ===================
        // FUCTION OPEN PLAYER
        // ===================
        window.openPlayer = function(id) {

            const item = (currentData.featured || [])
                .find(x => parseInt(x.id) === parseInt(id));

            if (!item || !item.embedUrl) {
                console.warn('❌ Item não encontrado:', id);
                return;
            }

            // AQUI 👇 (POSIÇÃO CERTA)
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
					allow="autoplay; encrypted-media; clipboard-write; fullscreen"
					allowfullscreen
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
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
            openPlayerPanels();

            // Extras
            showRelatedAlbums(item.artist, id);

            saveToRecentlyPlayed({
                id: item.id,
                type: item.type || 'featured',
                title: item.title || item.name || '',
                artist: item.artist || '',
                image: item.image || '',
                embedUrl: item.embedUrl || ''
            });

        };

        // Ativar Player
        function openPlayerPanels() {
            $('#player-bar').addClass('opened active').fadeIn(200);
            $('#player-page').addClass('showmore').fadeIn(200);
            $('#main-panel, #side-panel').fadeIn(200);
        }

        // ===================
        // ALTERNAR O CORPO DO PLAYER
        // ===================
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
        $(document).on("click", ".album-card", function() {
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

        // ==============================
        // Funções utilitárias adicionais
        // ==============================
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

        // =======================================
        // Funções utilitárias adicionais a banner
        // =======================================
        function setupBannerFillColorEvents(sectionId, options = {}) {

            const {
                cardSelector = '.album-card, .artist-card',
                    autoFirstImage = false
            } = options;

            const $section = $('#' + sectionId);
            const $banner = $('.filtered');

            if (!$section.length || !$banner.length) return;

            function applyBanner(src) {
                if (!src) return;

                if ($banner.data('current') === src) return;
                $banner.data('current', src);

                $banner.html(`<img src="${src}" alt="Banner">`);

                const img = new Image();

                img.onload = function() {
                    if ($.fn.fillColor) {
                        $banner.fillColor({
                            type: 'avgYUV'
                        });
                    }
                };

                img.src = src;
            }

            // Só aplica a primeira imagem se for permitido
            if (autoFirstImage) {
                const $firstImage = $section
                    .find(`${cardSelector}:not(.slick-cloned) img`)
                    .first();

                if ($firstImage.length) {
                    applyBanner($firstImage.attr('src'));
                }
            }

            // Todas as seções podem mudar banner no clique
            $section
                .off('click.bannerFillColor')
                .on('click.bannerFillColor', `${cardSelector}:not(.slick-cloned)`, function() {
                    const src = $(this).find('img').attr('src');
                    applyBanner(src);
                });
        }

        // ================================
        // FUCTION LOAD PROGRESS BAR ALBUMS
        // ================================
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
