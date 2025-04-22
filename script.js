// Menu mobile (mantido igual)
function setupMobileMenu() {
  const header = document.querySelector('header');
  const nav = document.querySelector('nav');
  const navList = document.querySelector('nav ul');
  const navLinks = document.querySelectorAll('nav ul li a');
  
  const menuToggle = document.createElement('button');
  menuToggle.className = 'mobile-menu-toggle';
  menuToggle.setAttribute('aria-label', 'Menu');
  menuToggle.innerHTML = '<span></span><span></span><span></span>';
  header.insertBefore(menuToggle, nav);
  
  menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    navList.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navList.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });
  
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav') && !e.target.closest('.mobile-menu-toggle')) {
      menuToggle.classList.remove('active');
      navList.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });
}

// Rolagem suave para navegação (mantido igual)
function setupSmoothScrolling() {
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Ativar link ativo na navegação (mantido igual)
function setupActiveNavLinks() {
  window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Comportamento Draggable do Carrossel (mantido igual)
function setupCarrosselDraggable(carrossel) {
    let isDragging = false;
    let startX;
    let startScrollLeft;
    let velocity = 0;
    let animationFrame;
    let lastTime = 0;
    const sensitivity = 1.1;
    const maxScroll = carrossel.scrollWidth - carrossel.clientWidth;
    
    carrossel.style.scrollBehavior = 'auto';
    carrossel.style.cursor = 'grab';
    carrossel.style.overscrollBehaviorX = 'none';

    function handleDragStart(e) {
        isDragging = true;
        startX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
        startScrollLeft = carrossel.scrollLeft;
        cancelAnimationFrame(animationFrame);
        velocity = 0;
        carrossel.style.cursor = 'grabbing';
    }

    function handleDragMove(e) {
        if (!isDragging) return;
        
        const x = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
        const walk = (x - startX) * sensitivity;
        let newScroll = startScrollLeft - walk;
        newScroll = Math.max(0, Math.min(newScroll, maxScroll));
        
        const now = performance.now();
        const deltaTime = now - lastTime;
        if (deltaTime > 0) {
            velocity = (newScroll - carrossel.scrollLeft) / deltaTime * 16;
        }
        lastTime = now;
        
        carrossel.scrollLeft = newScroll;
    }

    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        carrossel.style.cursor = 'grab';
        
        if (Math.abs(velocity) > 10) {
            lastTime = performance.now();
            animationFrame = requestAnimationFrame(animateScroll);
        }
    }

    function animateScroll(currentTime) {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        velocity *= 0.85;
        
        let newScroll = carrossel.scrollLeft + velocity * deltaTime / 16;
        
        if (newScroll <= 0) {
            newScroll = 0;
            velocity = 0;
        } else if (newScroll >= maxScroll) {
            newScroll = maxScroll;
            velocity = 0;
        }
        
        carrossel.scrollLeft = newScroll;
        
        if (Math.abs(velocity) > 0.5) {
            animationFrame = requestAnimationFrame(animateScroll);
        }
    }

    carrossel.addEventListener('mousedown', handleDragStart);
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);

    // Eventos de touch modificados para o novo comportamento
    carrossel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carrossel.addEventListener('touchmove', handleTouchMove, { passive: false });
    carrossel.addEventListener('touchend', handleDragEnd);
}

// Novo código para scroll vertical no mobile
function setupCarrosselTouchScroll(carrossel) {
    let initialY = null;
    let isVerticalScroll = false;

    function handleTouchStart(e) {
        if (e.touches.length === 1) {
            initialY = e.touches[0].clientY;
            isVerticalScroll = false;
        }
    }

    function handleTouchMove(e) {
        if (!initialY || e.touches.length !== 1) return;
        
        const y = e.touches[0].clientY;
        const yDiff = y - initialY;
        
        // Determina se é scroll vertical
        if (!isVerticalScroll && Math.abs(yDiff) > 5) {
            isVerticalScroll = true;
            // Permite o scroll vertical da página
            return;
        }
        
        // Se não for scroll vertical, previne o padrão para permitir scroll horizontal
        if (!isVerticalScroll) {
            e.preventDefault();
        }
    }

    carrossel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carrossel.addEventListener('touchmove', handleTouchMove, { passive: false });
}

// Navegação por Botões (mantido igual)
function setupCarrosselBotoes(carrossel) {
    const navContainer = document.createElement('div');
    navContainer.className = 'carrossel-nav';
    
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '&lt;';
    prevBtn.className = 'carrossel-btn prev';
    prevBtn.ariaLabel = 'Depoimento anterior';
    
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '&gt;';
    nextBtn.className = 'carrossel-btn next';
    nextBtn.ariaLabel = 'Próximo depoimento';
    
    navContainer.appendChild(prevBtn);
    navContainer.appendChild(nextBtn);
    carrossel.parentNode.insertBefore(navContainer, carrossel.nextSibling);

    function getNearestCard() {
        const cards = carrossel.querySelectorAll('.depoimento-card');
        const carrosselRect = carrossel.getBoundingClientRect();
        const carrosselCenter = carrosselRect.left + carrosselRect.width / 2;
        
        let nearestCard = null;
        let minDistance = Infinity;
        
        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(cardCenter - carrosselCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestCard = card;
            }
        });
        
        return nearestCard;
    }

    function navigateToCard(direction) {
        const currentCard = getNearestCard();
        if (!currentCard) return;
        
        const cards = Array.from(carrossel.querySelectorAll('.depoimento-card'));
        const currentIndex = cards.indexOf(currentCard);
        let targetIndex = currentIndex + (direction === 'prev' ? -1 : 1);
        targetIndex = Math.max(0, Math.min(targetIndex, cards.length - 1));
        
        const targetCard = cards[targetIndex];
        if (!targetCard) return;
        
        const cardWidth = targetCard.offsetWidth;
        const carrosselWidth = carrossel.offsetWidth;
        const scrollPosition = targetCard.offsetLeft - (carrosselWidth - cardWidth) / 2;
        
        carrossel.style.scrollBehavior = 'smooth';
        carrossel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            carrossel.style.scrollBehavior = 'auto';
        }, 500);
    }

    prevBtn.addEventListener('click', () => {
        if (carrossel.scrollLeft > 0) {
            navigateToCard('prev');
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (carrossel.scrollLeft < carrossel.scrollWidth - carrossel.clientWidth) {
            navigateToCard('next');
        }
    });
}

// Inicialização do Carrossel
function setupDepoimentosCarrossel() {
    const carrossel = document.querySelector('.depoimentos-carrossel');
    if (!carrossel) return;

    setupCarrosselDraggable(carrossel);
    setupCarrosselTouchScroll(carrossel); // Novo handler para scroll vertical
    setupCarrosselBotoes(carrossel);
}

// Inicialização geral
document.addEventListener('DOMContentLoaded', function() {
    setupMobileMenu();
    setupSmoothScrolling();
    setupActiveNavLinks();
    setupDepoimentosCarrossel();
});

// Fallback para DOM já carregado
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        setupMobileMenu();
        setupSmoothScrolling();
        setupActiveNavLinks();
        setupDepoimentosCarrossel();
    }, 1);
}