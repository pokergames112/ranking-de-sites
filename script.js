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
                        // Fecha todos os outros submenus abertos no mesmo nível
                        parentLi.parentElement.querySelectorAll('li.open').forEach(openLi => {
                            if (openLi !== parentLi) {
                                openLi.classList.remove('open');
                                const openMenu = openLi.querySelector('.submenu-level-1') || openLi.querySelector('.submenu-level-2');
                                if (openMenu) openMenu.style.display = 'none';
                            }
                        });

                        // Alterna o submenu clicado
                        parentLi.classList.toggle('open');
                        targetMenu.style.display = parentLi.classList.contains('open') ? 'flex' : 'none';
                    }
                }
            });
        });
    }

    // ----------------------------------------------------------------
    // 2. FUNCIONALIDADE DO CARROSSEL AUTOMÁTICO (SECTION 3)
    // ----------------------------------------------------------------
    const setupCarousel = () => {
        const track = document.querySelector('.carousel-track');
        const slides = Array.from(document.querySelectorAll('.carousel-slide'));
        const nextButton = document.querySelector('.carousel-button.next');
        const prevButton = document.querySelector('.carousel-button.prev');
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        
        if (!track || slides.length === 0) return;
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoSlideInterval;
        
        // Ajusta a largura total do track para acomodar todos os slides
        track.style.width = `${totalSlides * 100}%`;

        // 1. Cria os indicadores (bolinhas)
        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) {
                indicator.classList.add('active');
            }
            indicator.addEventListener('click', () => {
                moveToSlide(index);
                stopAutoSlide();
                startAutoSlide();
            });
            indicatorsContainer.appendChild(indicator);
        });
        
        const indicators = Array.from(document.querySelectorAll('.indicator'));

        // 2. Função para mover para um slide específico
        const moveToSlide = (targetIndex) => {
            if (targetIndex < 0) {
                targetIndex = totalSlides - 1;
            } else if (targetIndex >= totalSlides) {
                targetIndex = 0;
            }

            const amountToMove = targetIndex * 100 / totalSlides;
            track.style.transform = 'translateX(-' + amountToMove + '%)';
            currentSlide = targetIndex;
            
            // Atualiza os indicadores
            indicators.forEach(indicator => indicator.classList.remove('active'));
            indicators[currentSlide].classList.add('active');
        }

        // 3. Navegação manual
        if (nextButton) nextButton.addEventListener('click', () => {
            moveToSlide(currentSlide + 1);
            stopAutoSlide();
            startAutoSlide();
        });

        if (prevButton) prevButton.addEventListener('click', () => {
            moveToSlide(currentSlide - 1);
            stopAutoSlide();
            startAutoSlide();
        });

        // 4. Funcionalidade de Auto-Slide
        const startAutoSlide = () => {
            stopAutoSlide(); // Evita duplicação
            autoSlideInterval = setInterval(() => {
                moveToSlide(currentSlide + 1);
            }, 5000); 
        };
        
        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        // Inicia o carrossel automático
        startAutoSlide();
    }
    
    // ----------------------------------------------------------------
    // 3. NAVBAR INTELIGENTE (HIDE ON SCROLL)
    // ----------------------------------------------------------------
    const setupSmartNavbar = () => {
        const navbarHeader = document.querySelector('.navbar-header');
        if (!navbarHeader) return;
        
        let lastScrollTop = 0;
        const scrollThreshold = 5; 
        const navbarHeight = navbarHeader.offsetHeight;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScroll > lastScrollTop && currentScroll > navbarHeight) {
                // ROLANDO PARA BAIXO
                if (currentScroll - lastScrollTop > scrollThreshold) {
                     navbarHeader.classList.add('hidden');
                }
            } else {
                // ROLANDO PARA CIMA
                if (lastScrollTop - currentScroll > scrollThreshold || currentScroll < navbarHeight) {
                    navbarHeader.classList.remove('hidden');
                }
            }
            
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        });
    };

    // ----------------------------------------------------------------
    // 4. BOTÃO VOLTAR AO TOPO (BACK-TO-TOP)
    // ----------------------------------------------------------------
    const setupBackToTop = () => {
        const backToTopBtn = document.getElementById('backToTopBtn');
        if (!backToTopBtn) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) { 
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
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