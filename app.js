/*
===========================================================================
 PLAY 90 MUSIC - APP.JS (UI & SPA STRUCTURE) BY WEB5XCSS3 - W53 DEVELOPMENT
===========================================================================
*/

// =====================================================
// TITLE SYSTEM (SEO + SPA)
// =====================================================
window.BASE_TITLE = 'Play 90 Music';

window.updatePageTitle = function(data = null, type = '') {

    let title = '';

    if (!data) {
        title = `${BASE_TITLE} | Hits dos Anos 90, Playlists e Rádio Online`;
    } else {

        switch(type) {

            case 'song':
                title = `${data.artist} - ${data.title} (${data.year}) | ${BASE_TITLE}`;
                break;

            case 'artist':
                title = `${data.artist} - Artista | ${BASE_TITLE}`;
                break;

            case 'album':
                title = `${data.title} - Álbum (${data.year}) | ${BASE_TITLE}`;
                break;

            case 'genre':
                title = `${data} - Gênero | ${BASE_TITLE}`;
                break;

            case 'label':
                title = `${data} - Selo | ${BASE_TITLE}`;
                break;

            case 'search':
                title = `Busca: "${data}" | ${BASE_TITLE}`;
                break;

            default:
                title = `${BASE_TITLE}`;
        }
    }

    document.title = title;
};

// Header Component
	function Header() {
		return `
			<!-- Header -->
			<header id="header" class="alt">
				<!-- Logo -->
				<div class="logo">
					<a href="index.html">
						<picture>
							<source srcset="https://cdn.jsdelivr.net/gh/web5xcss3/icons/desktop.svg" media="(max-width: 767px)">
							<img src="https://cdn.jsdelivr.net/gh/web5xcss3/icons/desktop.svg" alt="Play 90 Music" />
						</picture>
					</a>
					<ul class="icons">
						<li><button type="button" class="icon solid fa-bars md-ripples ripples-light menuToogle"></button></li>
					</ul>
				</div>

            <!-- Search -->
				<nav id="search">
					<ul>
						<li>
							<form class="search">
								<input type="text" id="searchInput" placeholder="Pesquise Albuns, Artistas, CD, Maxi-Single, Vinyl, Selos, Timeline...">
								<div id="searchDropdown" class="dropdown-results"></div>
							</form>
						</li>
					</ul>
				</nav>

            <!-- Nav -->
				<nav id="nav">
					<ul class="icons">
						<li class="alt"><button type="button" class="icon solid fa-magnifying-glass md-ripples ripples-light"></button></li>
						<li>
							<button type="button" class="toggle-dropdown icon solid fa-ellipsis-vertical md-ripples ripples-light"></button>
							<ul class="dropotron level-0">
								<li><button type="button" data-toggle="fullscreen" class="md-ripples ripples-light">Modo Fullscreen</button></li>
								<li><button type="button" id="toggleBanner" class="md-ripples ripples-light">Background Image</button></li>
							</ul>
						</li>
					</ul>
				</nav>

			</header>
		`;
	}

// Menu Component
	function Menu() {
		return `
			<!-- Menu -->
			<section id="menu">
				<ul class="menu">
					<li><button type="button" class="active md-ripples ripples-light" data-tab="home"><i class="icon solid fa-house"></i><span class="label">Início</span></button></li>
					<li><button type="button" class="md-ripples ripples-light" data-tab="timeline"><i class="icon solid fa-compass"></i><span class="label">Explorar</span></button></li>
					<li><button type="button" class="md-ripples ripples-light" data-tab="artists"><i class="icon solid fa-chart-simple"></i><span class="label">Biblioteca</span></button></li>
				</ul>
			</section>
		`;
	}

// Banner Component
	function Banner() {
		return `
			<!-- Banner -->
			<section id="banner">
				<div class="image filtered" data-position="center"></div>
			</section>
		`;
	}

// Home Content Component
	function HomeContent() {
		return `
        <!-- Content Home Tab -->
			<div id="home" class="tab-content active">
			
            <!-- Destaque -->
				<section class="wrapper style">
					<header class="major">
						<h2 id="featuredTitle"></h2>
						<div class="slick-actions">
							<div id="new-slick-arrow" class="slick-arrows"></div>
						</div>
					</header>
					<div id="featuredAlbums" class="grid col-6"></div>
				</section>
				
			<!-- Videos Home -->
				<section class="wrapper style">
					<header class="major">
						<h2 id="homeVideosTitle"></h2>
						<div class="slick-actions">
							<div id="homeVideos-slick-arrow" class="slick-arrows"></div>
						</div>
					</header>
					<div id="homeVideos" class="grid col-6"></div>
				</section>
            
            <!-- Day Titulos -->
				<section class="wrapper style">
					<header class="major">
						<h2 id="dailyFeaturedTitle"></h2>
						<div class="slick-actions">
							<div id="daily-slick-arrow" class="slick-arrows"></div>
						</div>
					</header>
					<div id="dailyFeaturedTitles" class="grid col-6"></div>
				</section>

            <!-- DJS -->
				<section class="wrapper style">
					<header class="major">
						<h2 id="featuredDjsTitle"></h2>
						<div class="slick-actions">
							<div id="djs-slick-arrow" class="slick-arrows"></div>
						</div>
					</header>
					<div id="featuredDjs"></div>
				</section>
            
            <!-- Recent -->
				<section class="wrapper style">
					<header class="major">
						<h2 id="recentlyPlayedTitle"></h2>
						<div class="slick-actions">
							<div id="recentlyPlayed-slick-arrow" class="slick-arrows"></div>
						</div>
					</header>
					<div id="recentlyPlayed"></div>
				</section>
			</div>
		`;
	}

// Artists Component
	function ArtistsContent() {
		return `
        <!-- Artists Tab -->
			<section id="artists" class="tab-content">
				<article id="action">
					<ul class="actions">
						<li><button type="button" class="button md-ripples ripples-light" data-tab="videos">Vídeos</button></li>
						<li><button type="button" class="button md-ripples ripples-light" data-tab="musics">Músicas</button></li>
						<li><button type="button" class="button md-ripples ripples-light" data-tab="playlists">Playlists</button></li>
						<li><button type="button" class="button md-ripples ripples-light" data-tab="albums">Álbuns</button></li>
						<li><button type="button" class="button md-ripples ripples-light" data-tab="singles">CD, Maxi-Single</button></li>
						<li><button type="button" class="button md-ripples ripples-light" data-tab="vinyls">Vinyl, 12"</button></li>
						<li><button type="button" class="button md-ripples ripples-light" data-tab="djs">Mix de D'J'S</button></li>
						<li><button type="button" class="button md-ripples ripples-light" data-tab="instrumental">Instrumental</button></li>
						<li><button type="button" class="button md-ripples ripples-light" data-tab="labels">Labels / Selos</button></li>
					</ul>
				</article>
				<header class="major">
					<h2 id="artistsTitle">Artistas</h2>
				</header>
				<div id="allArtists" class="grid col-5"></div>
			</section>
		`;
	}

// Artists Component

function suballAlbumsContent() {
	return `
	<section id="subalbums" class="tab-content">

		<main class="artist-page column">

			<!-- LEFT -->
			<div class="artist-left">
				<img id="artistImage" src="" alt="">
				<header="align-left">
					<h2 id="artistName"></h2>
					<p id="artist-bio"></p>
					<ul class="actions fit align-middle">
						<li><button type="button" id="" class="button primary md-ripples ripples-light">Play Music</button></li>
						<li><button type="button" id="" class="button md-ripples ripples-light">Play Videos</button></li>
					</ul>
				</header>
			</div>

			<!-- RIGHT -->
			<div class="artist-right">
				<header class="major">
					<h2 id="subalbumsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToArtistsBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="suballAlbums" class="album-list"></div>
			</div>

		</main>

	</section>
	`;
}
	
// Timeline Component
	function timelineContent() {
		return `
		<!-- Timeline Tab -->
			<section id="timeline" class="tab-content">
				
				<!-- All Timeline -->
				<div class="wrapper style">
					<header class="major">
						<h2 id="timelineTitle"></h2>
						<div class="slick-actions">
							<div id="timeline-slick-arrow" class="slick-arrows"></div>
						</div>
					</header>
					<div id="allTimeline"></div>
				</div>
				
				<!-- Day Hits -->
				<div class="wrapper style">
					<header class="major">
						<h2 id="dailyHitTitle"></h2>
						<div class="slick-actions">
							<div id="hits-slick-arrow" class="slick-arrows"></div>
						</div>
					</header>
					<div id="dailyHit"></div>
				</div>
				
				<!-- Genres -->
				<div id="genres" class="wrapper style">
					<header class="major">
						<h2 id="genresTitle"></h2>
					</header>
					<div id="AllGenres" class="grid col-4"></div>
				</div>
			</section>
			
		`;
	}

// Genres Component
	function genresContent() {
		return `
		<!-- Genres Albums Tab -->
			<section id="genresAlbums" class="tab-content">
				<header class="major">
					<h2 id="genresAlbumsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToTimelineFromGenres" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="genresAlbumsList" class="grid col-6"></div>
			</section>
		`;
	}
	
// Year Albums Component
	function yearAlbumsContent() {
		return `
		<!-- Year Albums Tab -->
			<section id="yearAlbums" class="tab-content">
				<header class="major">
					<h2 id="yearAlbumsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToTimelineBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="yearAlbumsList" class="grid col-6"></div>
			</section>
		`;
	}
	
// Music Component
	function musicsContent() {
		return `
		<!-- Music -->
			<section id="musics" class="tab-content">
				<header class="major">
					<h2 id="musicsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToMusicsBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="allMusics" class="grid col-6"></div>
			</section>
		`;
	}
	
// Playlists Component
	function playlistsContent() {
		return `
		<!-- Playlists -->
			<section id="playlists" class="tab-content">
				<header class="major">
					<h2 id="playlistsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToPlaylistsBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="allPlaylists" class="grid col-6"></div>
			</section>
		`;
	}
	
// Álbuns Component
	function albumsContent() {
		return `
		<!-- Álbuns Tab -->
			<section id="albums" class="tab-content">
				<header class="major">
					<h2 id="albumsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToAlbunsBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="allAlbums" class="grid col-6"></div>
			</section>
		`;
	}

// Single Component
	function singlesContent() {
		return `
		<!-- Single Tab -->
			<section id="singles" class="tab-content">
				<header class="major">
					<h2 id="singlesTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToSingleBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="allSingles" class="grid col-6"></div>
			</section>
		`;
	}
	
// Vinyl Component
	function vinylsContent() {
		return `
		<!-- Vinyl Tab -->
			<section id="vinyls" class="tab-content">
				<header class="major">
					<h2 id="vinylsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToVinylBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="allVinyls" class="grid col-6"></div>
			</section>
		`;
	}
	
// Djs Component
	function djsContent() {
		return `
		<!-- Djs Tab -->
			<section id="djs" class="tab-content">
				<header class="major">
					<h2 id="djsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToDjsBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="allDjs" class="grid col-6"></div>
			</section>
		`;
	}
	
// Instrumental Component
	function instrumentalContent() {
		return `
		<!-- Instrumental Tab -->
			<section id="instrumental" class="tab-content">
				<header class="major">
					<h2 id="instrumentalTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToInstrumentaisBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="allInstrumentals" class="grid col-6"></div>
			</section>
		`;
	}
	
// Videos Component
function videosContent() {
    return `
        <section id="videos" class="tab-content">
			<div class="yt-videos wrapper style">
				<header class="major">
					<h2 id="videosTitle">Vídeos</h2>
					<ul class="actions">
						<li><button type="button" id="backToVideos" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>

				<div id="allVideos" class="grid col-6"></div>
			</div>
			
			<div class="yt-videos-artist-albums wrapper style">
				<header class="major align-top">
					<h2 id="videosArtistAlbumsTitle"></h2>
				</header>

				<div id="videosArtistAlbums" class="grid col-6"></div>
			</div>
        </section>
    `;
}
	
// Labels Component
	function labelsContent() {
		return `
		<!-- Labels Tab -->
			<section id="labels" class="tab-content">
				<header class="major">
					<h2 id="labelsTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToHomeFromLabels" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="labelsList" class="grid col-6"></div>
			</section>
		`;
	}
	
// Sub Labels Component
	function labelDetailsContent() {
		return `
		<!-- Sub Labels Tab -->
			<section id="labelDetails" class="tab-content">
				<header class="major">
					<h2 id="labelTitle"></h2>
					<ul class="actions">
						<li><button type="button" id="backToLabelsBtn" class="button icon solid fa-arrow-left md-ripples ripples-light">Voltar</button></li>
					</ul>
				</header>
				<div id="labelArtistsList" class="grid col-6"></div>
			</section>
		`;
	}
	
// Main App Component
	function App() {
		return `
			${Header()}
			${Menu()}
			${Banner()}
        
        <!-- Main -->
			<section id="main" class="wrapper align-top">
				<div class="container">
					${HomeContent()}
					${ArtistsContent()}
					${suballAlbumsContent()}
					${timelineContent()}
					${genresContent()}
					${yearAlbumsContent()}
					${musicsContent()}
					${playlistsContent()}
					${albumsContent()}
					${singlesContent()}
					${vinylsContent()}
					${djsContent()}
					${instrumentalContent()}
					${labelsContent()}
					${labelDetailsContent()}
					${videosContent()}
					<!-- Outros tabs serão adicionados dinamicamente -->
				</div>
			</section>

        <!-- Player Page -->
			<section id="player-page" style="display: none;">
				<div class="content">
				
				<!-- Main Panel -->
					<div id="main-panel">
						<div class="player-embed"></div>
					</div>
					
				<!-- Side Panel -->
					<div id="side-panel">
						<div class="album-details">
							<h4>Detalhes do Álbum</h4>
							<div class="details-grid">
								<div class="detail-item">
									<span class="label">Artista:</span>
									<span id="detailArtist"></span>
								</div>
								<div class="detail-item">
									<span class="label">Gravadora:</span>
									<span id="detailLabel"></span>
								</div>
								<div class="detail-item">
									<span class="label">Formato:</span>
									<span id="detailFormat"></span>
								</div>
								<div class="detail-item">
									<span class="label">País:</span>
									<span id="detailCountry"></span>
								</div>
								<div class="detail-item">
									<span class="label">Ano:</span>
									<span id="detailYear"></span>
								</div>
								<div class="detail-item">
									<span class="label">Gênero:</span>
									<span id="detailGenre"></span>
								</div>
								<div class="detail-item">
									<span class="label">Estilo:</span>
									<span id="detailStyle"></span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		
		<!-- related Albums Panel -->
			<section id="relatedContainer">
				<header class="major">
					<h3 id="relatedArtistName"></h3>
				</header>
				<div id="relatedAlbums" class="related-grid"></div>
			</section>

        <!-- Player Bar -->
			<section id="player-bar" style="display: none;">
				<div class="content">
					<div class="image" data-position="center">
						<img id="playerImage" src="" alt="Player" />
					</div>
					<header class="align-left">
						<h3 id="playerArtist"></h3>
						<p id="playerTitle"></p>
					</header>
					<ul class="icons">
						<li><button type="button" class="icon solid fa-long-arrow-down md-ripples ripples-light"></button></li>
						<li><button type="button" class="icon solid fa-list md-ripples ripples-light"></button></li>
					</ul>
				</div>
			</section>

        <!-- Footer
			<footer id="footer">
				<span class="copyright">© Play 90 Music 2026 | <a href="https://www.forumeiros.com/">Crie um forum grátis</a></span>
			</footer> -->
		`;
	}

// =====================================================
// APP CORE
// =====================================================

// RENDER ROOT (APENAS UMA VEZ)
function renderRoot() {
    $('#app').html(App());
}

// =====================================================
// TABS SYSTEM
// =====================================================

function initTabSystem() {

    $(document)
        .off('click.tab')
        .on('click.tab', '[data-tab]', function(e) {
            e.preventDefault();

            const tab = $(this).data('tab');
            switchTab(tab);
        });
		
		
	$(document).on('click', '[data-tab="videos"]', function() {
    renderAllVideos();
});

}

function switchTab(tab) {

    const $current = $('.tab-content.active');
    const $next = $('#' + tab);

    if (!$next.length) return;

    $current.removeClass('active');
    $next.addClass('active');

    $('[data-tab]').removeClass('active');
    $('[data-tab="' + tab + '"]').addClass('active');
	
	 // 🧠 UPDATE TITLE POR TAB
    updatePageTitle(tab, 'genre'); // fallback simples

    // rehidratar UI após troca
    setTimeout(hydrateUI, 80);
}

// =====================================================
// EVENTOS GLOBAIS (100% ORGANIZADO)
// =====================================================

function initGlobalEvents() {

    // =========================
    // MENU
    // =========================
    $(document)
        .off('click.menuToggle')
        .on('click.menuToggle', '.menuToogle', function(e) {
            e.preventDefault();
            $('body').toggleClass('is-menu-visible');
        });

    $(document)
        .off('click.menuOutside')
        .on('click.menuOutside', function(e) {

            const $menu = $('#menu');
            const $toggle = $('.menuToogle');

            if (
                $('body').hasClass('is-menu-visible') &&
                !$menu.is(e.target) &&
                $menu.has(e.target).length === 0 &&
                !$toggle.is(e.target) &&
                $toggle.has(e.target).length === 0
            ) {
                $('body').removeClass('is-menu-visible');
            }
        });

    $(document)
        .off('click.menuStop')
        .on('click.menuStop', '#menu', function(e) {
            e.stopPropagation();
        });

    // =========================
    // DROPDOWN
    // =========================
    $(document)
        .off('click.dropdown')
        .on('click.dropdown', '.toggle-dropdown', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const $dropdown = $(this).next('.dropotron');

            $('.dropotron').not($dropdown).removeClass('dropdown-active');
            $dropdown.toggleClass('dropdown-active');
        });

    $(document)
        .off('click.dropdownOutside')
        .on('click.dropdownOutside', function() {
            $('.dropotron').removeClass('dropdown-active');
        });

    $(document)
        .off('click.dropdownStop')
        .on('click.dropdownStop', '.dropotron', function(e) {
            e.stopPropagation();
        });

    // =========================
    // BANNER
    // =========================
    $(document)
        .off('click.bannerToggle')
        .on('click.bannerToggle', '#toggleBanner', function() {

            const $image = $('#banner .image');
            if (!$image.length) return;

            $image.toggleClass('hidden');

            $(this).text(
                $image.hasClass('hidden')
                    ? 'Background Color'
                    : 'Background Image'
            );
        });

    // =========================
    // SEARCH
    // =========================
    $(document)
        .off('click.searchToggle')
        .on('click.searchToggle', '.fa-magnifying-glass', function(e) {
            e.preventDefault();

            const $search = $('#search');

            if (window.innerWidth <= 736) {
                $search.toggle();
                $('#searchInput').focus();
            }
        });

    $(document)
        .off('click.searchOutside')
        .on('click.searchOutside', function(e) {

            const $search = $('#search');

            if (
                window.innerWidth <= 736 &&
                !$search.is(e.target) &&
                $search.has(e.target).length === 0 &&
                !$(e.target).closest('.fa-magnifying-glass').length
            ) {
                $search.hide();
            }
        });

    // =========================
    // SEARCH INPUT
    // =========================
    $(document)
        .off('input.search')
        .on('input.search', '#searchInput', function() {
            debounceSearch($(this).val());
        });

    $(document)
        .off('keypress.search')
        .on('keypress.search', '#searchInput', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch($(this).val());
            }
        });

    // CLICK RESULTADO
    $(document)
        .off('click.searchResult')
        .on('click.searchResult', '.result-item', function() {

            const id = parseInt($(this).data('id'));
            const type = $(this).data('type');

            if (!isNaN(id) && typeof openPlayer === 'function') {
                openPlayer(id, type);
            }

            $('#searchDropdown').hide();
        });

    // CLICK FORA DROPDOWN
    $(document)
        .off('click.searchClose')
        .on('click.searchClose', function(e) {
            if (!$(e.target).closest('#searchInput, #searchDropdown').length) {
                $('#searchDropdown').hide();
            }
        });
		
	$(document)
    .off('click', '[data-tab="home"]')
    .on('click', '[data-tab="home"]', function() {
        renderHomeVideos();
    });

}

// =====================================================
// PLUGINS GLOBAIS (LEVE)
// =====================================================

function initPlugins() {
    // reservado para plugins leves globais
}

// =====================================================
// SCROLL WATCH (SAFE)
// =====================================================

let scrollInitialized = false;

function setupScrollWatch() {

    const $banner = $('#banner');
    const $header = $('#header');
    const $menu = $('#menu');

    if (!$banner.length || !$.fn.scrollwatch) return;

    $banner.scrollwatch({
        delay: 0,
        range: 0,
        anchor: 'top',

        on: function() {
            $header.addClass('alt reveal');
            $menu.addClass('alt reveal');
        },

        off: function() {
            $header.removeClass('alt reveal');
            $menu.removeClass('alt reveal');
        }
    });
}

// =====================================================
// HYDRATE UI
// =====================================================

function hydrateUI() {

    initPlugins();

    if (!scrollInitialized) {
        setupScrollWatch();
        scrollInitialized = true;
    }
}

// =====================================================
// SEARCH SYSTEM
// =====================================================

window.searchIndex = [];
let searchTimeout = null;

window.buildSearchIndex = function() {

    if (typeof mockFeatured === 'undefined') return;

    window.searchIndex = mockFeatured.map(item => ({
        id: item.id,
        type: 'featured',
        title: item.title || '',
        artist: item.artist || '',
        image: item.image || '',
        search: (
            (item.title || '') + ' ' +
            (item.artist || '') + ' ' +
            (item.year || '') + ' ' +
            (item.name || '')
        ).toLowerCase()
    }));
};

// BUSCA
function handleSearch(term) {
	
	updatePageTitle(term, 'search'); // 👈 ADICIONA

    const $dropdown = $('#searchDropdown');
    if (!$dropdown.length) return;
    if (!window.searchIndex.length) return;

    if (!term || term.length < 2) {
        $dropdown.hide();
        return;
    }

    term = term.toLowerCase();

    const results = window.searchIndex
        .filter(item => item.search.includes(term))
        .slice(0, 10);

    if (!results.length) {
        $dropdown.hide();
        return;
    }

    renderSearchResults(results);
}

// RENDER RESULTADOS
function renderSearchResults(results) {

    const html = results.map(item => `
        <div class="result-item" data-id="${item.id}" data-type="${item.type}">
            <img src="${item.image}" class="result-thumb">
            <div class="result-info">
                <h3>${item.artist}</h3>
                <p>${item.title}</p>
            </div>
        </div>
    `).join('');

    $('#searchDropdown').html(html).show();
}

// DEBOUNCE
function debounceSearch(value) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        handleSearch(value);
    }, 250);
}

// =====================================================
// RENDER DATA
// =====================================================

function initRenderFunctions() {

    const safeCall = fn => typeof fn === 'function' && fn();

    safeCall(renderAllAlbums);
    safeCall(renderAllArtists);
    safeCall(renderAllPlaylists);
    safeCall(renderTimeline);
    safeCall(renderMusics);
    safeCall(renderAllSingles);
    safeCall(renderAllVinyls);
    safeCall(renderAllDjs);
    safeCall(renderAllInstrumental);
    safeCall(renderFeaturedAlbums);
    safeCall(renderRecentlyPlayed);
    safeCall(renderFeaturedDjs);
    safeCall(renderDailyHit);
    safeCall(renderAllLabels);
    safeCall(renderDailyFeaturedTitles);
    safeCall(renderAllGenres);
	safeCall(renderAllVideos);
	safeCall(renderHomeVideos);
}

// =====================================================
// INIT APP
// =====================================================

window.loadApiData = function() {

    const API = 'https://eurodance-api.onrender.com';

    return Promise.all([
        fetch(`${API}/mock`).then(res => res.json()),
        fetch(`${API}/labels`).then(res => res.json()),
        fetch(`${API}/genres`).then(res => res.json())
    ])
    .then(([featured, labels, genres]) => {

        console.log('API carregada:', featured);

        window.mockFeatured = featured;
        window.mockLabels = labels;
        window.mockGenres = genres;

        window.currentData = {
            featured: featured,
            albums: featured.filter(item => item.type === 'albums'),
            singles: featured.filter(item => item.type === 'singles'),
            vinyls: featured.filter(item => item.type === 'vinyls'),
            instrumental: featured.filter(item => item.type === 'instrumental'),
            djs: featured.filter(item => item.type === 'djs'),
            musics: featured.filter(item => item.type === 'music' || item.type === 'musics'),
            playlists: featured.filter(item => item.type === 'playlists'),

            labels: labels,
            genres: genres
        };

        window.originalData = {
            featured: [...featured],
            albums: [...window.currentData.albums],
            singles: [...window.currentData.singles],
            vinyls: [...window.currentData.vinyls],
            instrumental: [...window.currentData.instrumental],
            djs: [...window.currentData.djs],
            musics: [...window.currentData.musics],
            playlists: [...window.currentData.playlists],
            labels: [...labels],
            genres: [...genres]
        };

        return window.currentData;
    });
};

$(document).ready(function() {

    console.log('SPA: inicializando...');

    renderRoot();
    updatePageTitle();
    initGlobalEvents();
    initTabSystem();

    window.loadApiData()
        .then(function() {

            console.log('Dados prontos para renderizar');

            initRenderFunctions();
            hydrateUI();
            buildSearchIndex();

        })
        .catch(function(error) {
            console.error('Erro ao iniciar app:', error);
        });
});
