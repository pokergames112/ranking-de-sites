document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------------------
    // 1. FUNCIONALIDADE DO MENU MOBILE (NAVBAR)
    // ----------------------------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarContainer = document.querySelector('.navbar-container');
    
    if (menuToggle && navbarContainer) {
        // Abre e fecha o menu ao clicar no botão hamburguer
        menuToggle.addEventListener('click', () => {
            navbarContainer.classList.toggle('open');
            // Impede que o corpo do documento role quando o menu estiver aberto
            document.body.classList.toggle('no-scroll', navbarContainer.classList.contains('open'));
        });

        // Adiciona funcionalidade de expansão/recolhimento para submenus no mobile
        const hasSubmenus = document.querySelectorAll('.has-submenu > a, .has-submenu-level-2 > a');

        hasSubmenus.forEach(link => {
            link.addEventListener('click', (e) => {
                // Previne a navegação se estiver em mobile
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const parentLi = link.parentElement;
                    const targetMenu = parentLi.querySelector('.submenu-level-1') || parentLi.querySelector('.submenu-level-2');
                    
                    if (targetMenu) {
                        parentLi.classList.toggle('expanded');
                    }
                }
            });
        });
    }


    // ----------------------------------------------------------------
    // 2. FUNCIONALIDADE DO CARROSSEL AUTOMÁTICO (SECTION 3)
    // ----------------------------------------------------------------
    const setupCarousel = () => {
        const carousel = document.querySelector('.carousel-container'); // O seu HTML usa .carousel-container como pai
        // ALTERAÇÃO: Use .carousel-container como base, pois ele contém os botões e indicadores.
        if (!carousel) return;

        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
        const indicatorsContainer = carousel.querySelector('.carousel-indicators');
        const totalSlides = slides.length;
        let currentSlide = 0;
        let carouselInterval;
        const autoSlideDelay = 5000; // 5 segundos

        // 1. Configuração inicial (REMOVIDA A LÓGICA DE LARGURA CONFLITANTE)
        
        // As linhas abaixo foram removidas pois causavam o conflito:
        // track.style.width = `${totalSlides * 100}%`;
        // slides.forEach(slide => { slide.style.width = `${100 / totalSlides}%`; });
        // O CSS agora garante que cada slide tenha width: 100% e o track use display: flex.

        // Cria os indicadores (MANTIDO)
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) {
                indicator.classList.add('active');
            }
            indicator.addEventListener('click', () => {
                moveToSlide(i);
                resetAutoSlide();
            });
            indicatorsContainer.appendChild(indicator);
        }
        const indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));


        // 2. Função para mover para um slide específico (MANTIDO E CORRETO)
        const moveToSlide = (targetIndex) => {
            if (targetIndex < 0) {
                targetIndex = totalSlides - 1;
            } else if (targetIndex >= totalSlides) {
                targetIndex = 0;
            }

            // A movimentação é de 100% do container para cada slide
            const amountToMove = targetIndex * 100;
            track.style.transform = 'translateX(-' + amountToMove + '%)';
            currentSlide = targetIndex;
            
            // Atualiza os indicadores
            indicators.forEach(indicator => indicator.classList.remove('active'));
            indicators[currentSlide].classList.add('active');
        }

        // 3. Navegação manual (SELETORES CORRIGIDOS)
        const prevButton = carousel.querySelector('.carousel-button.prev'); // CORRIGIDO: usa '.carousel-button.prev'
        const nextButton = carousel.querySelector('.carousel-button.next'); // CORRIGIDO: usa '.carousel-button.next'

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                moveToSlide(currentSlide - 1);
                resetAutoSlide();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                moveToSlide(currentSlide + 1);
                resetAutoSlide();
            });
        }


        // 4. Funcionalidade de Auto-slide (MANTIDO E CORRETO)
        const startAutoSlide = () => {
            carouselInterval = setInterval(() => {
                moveToSlide(currentSlide + 1);
            }, autoSlideDelay);
        }

        const stopAutoSlide = () => {
            clearInterval(carouselInterval);
        }

        const resetAutoSlide = () => {
            stopAutoSlide();
            startAutoSlide();
        }
        
        // Inicia o carrossel
        startAutoSlide();

        // Pausa ao passar o mouse e reinicia ao remover
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
    };


    // ----------------------------------------------------------------
    // 3. NAVBAR INTELIGENTE (ESCONDE/MOSTRA AO SCROLL)
    // ----------------------------------------------------------------
    const setupSmartNavbar = () => {
        let lastScrollTop = 0;
        const navbar = document.querySelector('.navbar-header');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScroll > lastScrollTop && currentScroll > 60) {
                // Scroll down: Esconde a navbar
                navbar.classList.add('hidden');
            } else if (currentScroll < lastScrollTop) {
                // Scroll up: Mostra a navbar
                navbar.classList.remove('hidden');
            }
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; 
        }, false);
    };


    // ----------------------------------------------------------------
    // 4. BOTÃO VOLTAR AO TOPO
    // ----------------------------------------------------------------
    const setupBackToTop = () => {
        const backToTopBtn = document.getElementById('backToTopBtn');
        if (!backToTopBtn) return;

        // Mostra/Esconde o botão com base na posição de rolagem
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                backToTopBtn.style.display = "block";
            } else {
                backToTopBtn.style.display = "none";
            }
        });

        // Comportamento de clique para rolar para o topo
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // A rolagem suave está definida no CSS 'html { scroll-behavior: smooth; }'
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };


    // ----------------------------------------------------------------
    // 5. ACORDEÃO DO FAQ (SECTION 5)
    // ----------------------------------------------------------------
    const setupFAQ = () => {
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.closest('.faq-item');
                const answer = faqItem.querySelector('.faq-answer');
                const isActive = faqItem.classList.contains('active');

                // Fecha todos os outros (Acordeão)
                document.querySelectorAll('.faq-item').forEach(item => {
                    if (item !== faqItem) {
                        item.classList.remove('active');
                        item.querySelector('.faq-answer').style.maxHeight = null;
                    }
                });

                // Alterna o estado do item clicado
                if (!isActive) {
                    faqItem.classList.add('active');
                    // Define a altura máxima baseada no conteúdo da resposta
                    answer.style.maxHeight = answer.scrollHeight + "px";
                } else {
                    faqItem.classList.remove('active');
                    answer.style.maxHeight = null;
                }
            });
        });
    };


    // INICIALIZAÇÃO DE TODAS AS FUNÇÕES
    setupCarousel();
    setupSmartNavbar();
    setupBackToTop();
    setupFAQ();
});