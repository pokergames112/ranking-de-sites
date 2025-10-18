document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------------------
    // 1. FUNCIONALIDADE DO MENU MOBILE (NAVBAR)
    // ----------------------------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarContainer = document.querySelector('.navbar-container');
    
    if (menuToggle && navbarContainer) {
        // Abre e fecha o menu principal ao clicar no botão hamburguer
        menuToggle.addEventListener('click', () => {
            navbarContainer.classList.toggle('open');
            // Impede que o corpo do documento role quando o menu estiver aberto
            document.body.classList.toggle('no-scroll', navbarContainer.classList.contains('open'));

            // Fecha todos os submenus expandidos ao fechar o menu principal
            if (!navbarContainer.classList.contains('open')) {
                document.querySelectorAll('.has-submenu.expanded, .has-submenu-level-2.expanded').forEach(li => {
                    li.classList.remove('expanded');
                });
            }
        });

        // Adiciona funcionalidade de expansão/recolhimento para submenus no mobile
        const hasSubmenus = document.querySelectorAll('.has-submenu > a, .has-submenu-level-2 > a');

        hasSubmenus.forEach(link => {
            link.addEventListener('click', (e) => {
                // Checa se está no modo mobile para aplicar a lógica de clique
                if (window.innerWidth <= 768) {
                    e.preventDefault(); // Previne a navegação
                    const parentLi = link.parentElement;
                    const isCurrentlyExpanded = parentLi.classList.contains('expanded');
                    
                    // 1. Identifica o seletor do nível (Para fechar outros do mesmo nível)
                    const selector = parentLi.matches('.has-submenu') ? '.has-submenu' : '.has-submenu-level-2';
                    
                    // 2. Fecha todos os outros submenus ABERTOS do mesmo nível (Efeito Acordeão)
                    document.querySelectorAll(selector).forEach(li => {
                        if (li !== parentLi) {
                            li.classList.remove('expanded');
                        }
                    });

                    // 3. Alterna o estado (abre/fecha) do submenu clicado
                    parentLi.classList.toggle('expanded', !isCurrentlyExpanded);

                    // 4. Lógica extra: Se estiver fechando o submenu de Nível 1, garante que o de Nível 2 também feche
                    if (parentLi.matches('.has-submenu') && isCurrentlyExpanded) {
                        const level2 = parentLi.querySelector('.has-submenu-level-2');
                        if(level2) {
                            level2.classList.remove('expanded');
                        }
                    }
                }
                // Em desktop, o clique permite a navegação normal.
            });
        });
    }


    // ----------------------------------------------------------------
    // 2. FUNCIONALIDADE DO CARROSSEL AUTOMÁTICO (SECTION 3)
    // ----------------------------------------------------------------
    const setupCarousel = () => {
        const carousel = document.querySelector('.carousel-container'); 
        if (!carousel) return;

        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
        const indicatorsContainer = carousel.querySelector('.carousel-indicators');
        const totalSlides = slides.length;
        let currentSlide = 0;
        let carouselInterval;
        const autoSlideDelay = 5000; // 5 segundos

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

            const amountToMove = targetIndex * 100;
            track.style.transform = 'translateX(-' + amountToMove + '%)';
            currentSlide = targetIndex;
            
            // Atualiza os indicadores
            indicators.forEach(indicator => indicator.classList.remove('active'));
            indicators[currentSlide].classList.add('active');
        }

        // 3. Navegação manual (MANTIDO E CORRETO)
        const prevButton = carousel.querySelector('.carousel-button.prev'); 
        const nextButton = carousel.querySelector('.carousel-button.next'); 

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
                navbar.classList.add('hidden');
            } else if (currentScroll < lastScrollTop) {
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

        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                backToTopBtn.style.display = "block";
            } else {
                backToTopBtn.style.display = "none";
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
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