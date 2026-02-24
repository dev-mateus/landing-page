// ========================================
// MENU MOBILE
// ========================================

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Fechar menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-wrapper')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ========================================
// SCROLL HEADER & BACK TO TOP (combined)
// ========================================

const header = document.querySelector('.header');
const backToTop = document.getElementById('backToTop');
let lastScroll = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;
            
            // Header scroll effect
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Back to top visibility
            if (currentScroll > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
            
            lastScroll = currentScroll;
            ticking = false;
        });
        ticking = true;
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// SMOOTH SCROLL
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// ANIMAÇÃO AO SCROLL
// ========================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Elementos para animar
const animateElements = document.querySelectorAll('.servico-card, .stat-card, .feature-item');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// ========================================
// VALIDAÇÃO DE FORMULÁRIO
// ========================================

const formValidations = {
    from_name: {
        validate: (value) => {
            value = value.trim();
            if (value.length === 0) return { valid: false, message: 'Nome é obrigatório' };
            if (value.length < 3) return { valid: false, message: 'Nome deve ter no mínimo 3 caracteres' };
            if (value.length > 100) return { valid: false, message: 'Nome não pode ter mais de 100 caracteres' };
            if (!/^[a-záàâãéèêíïóôõöúçñ\s'-]+$/i.test(value)) return { valid: false, message: 'Nome contém caracteres inválidos' };
            return { valid: true, message: '' };
        }
    },
    email_id: {
        validate: (value) => {
            value = value.trim();
            if (value.length === 0) return { valid: false, message: 'Email é obrigatório' };
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return { valid: false, message: 'Email inválido' };
            if (value.length > 255) return { valid: false, message: 'Email muito longo' };
            return { valid: true, message: '' };
        }
    },
    phone: {
        validate: (value) => {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length === 0) return { valid: true, message: '' }; // opcional
            if (cleaned.length < 10) return { valid: false, message: 'Telefone deve ter no mínimo 10 dígitos' };
            if (cleaned.length > 11) return { valid: false, message: 'Telefone inválido' };
            return { valid: true, message: '' };
        }
    },
    message: {
        validate: (value) => {
            value = value.trim();
            if (value.length === 0) return { valid: false, message: 'Mensagem é obrigatória' };
            if (value.length < 10) return { valid: false, message: 'Mensagem deve ter no mínimo 10 caracteres' };
            if (value.length > 5000) return { valid: false, message: 'Mensagem não pode ter mais de 5000 caracteres' };
            return { valid: true, message: '' };
        }
    }
};

function updateValidationUI(inputId, isValid) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(inputId + '-error');
    
    if (!input) return;
    
    input.classList.remove('invalid', 'valid');
    if (errorElement) errorElement.textContent = '';
    
    if (isValid === null) {
        // Sem validação realizada ainda
        return;
    }
    
    if (isValid) {
        input.classList.add('valid');
    } else {
        input.classList.add('invalid');
    }
}

function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input) return true;
    
    const validation = formValidations[fieldId];
    if (!validation) return true;
    
    const result = validation.validate(input.value);
    const errorElement = document.getElementById(fieldId + '-error');
    
    if (!result.valid) {
        if (errorElement) {
            errorElement.textContent = result.message;
        }
        updateValidationUI(fieldId, false);
        return false;
    } else {
        if (errorElement) {
            errorElement.textContent = '';
        }
        updateValidationUI(fieldId, true);
        return true;
    }
}

function initializeFormValidation() {
    Object.keys(formValidations).forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (!input) return;
        
        // Validação em tempo real
        input.addEventListener('blur', () => {
            validateField(fieldId);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) {
                validateField(fieldId);
            }
        });
    });
    
    // Contador de caracteres para mensagem
    const messageInput = document.getElementById('message');
    if (messageInput) {
        messageInput.addEventListener('input', () => {
            const count = messageInput.value.length;
            const countElement = document.getElementById('message-count-value');
            const charCountElement = document.querySelector('.char-count');
            
            if (countElement) countElement.textContent = count;
            
            // Avisar quando está perto do limite
            if (charCountElement) {
                if (count > 4500) {
                    charCountElement.classList.add('warning');
                } else {
                    charCountElement.classList.remove('warning');
                }
            }
        });
    }
}

// Inicializar validação quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFormValidation);
} else {
    initializeFormValidation();
}

// ========================================
// NOTIFICAÇÃO TOAST
// ========================================

function showNotification(message, type = 'success', duration = 4000) {
    const toast = document.getElementById('notificationToast');
    
    toast.textContent = message;
    toast.className = `notification-toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ========================================
// FORMULÁRIO DE CONTATO - EmailJS
// ========================================

// Inicializar EmailJS (com verificação para script defer)
if (typeof emailjs !== 'undefined') {
    emailjs.init('TBzsxpqvh6ARVzX5d');
} else {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof emailjs !== 'undefined') {
            emailjs.init('TBzsxpqvh6ARVzX5d');
        }
    });
}

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validar todos os campos obrigatórios
    const isNameValid = validateField('from_name');
    const isEmailValid = validateField('email_id');
    const isPhoneValid = validateField('phone');
    const isMessageValid = validateField('message');
    
    if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
        showNotification('⚠️ Por favor, corrija os erros no formulário', 'error', 4000);
        return;
    }
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = 'Enviando...';
    submitBtn.disabled = true;
    
    try {
        // Enviar email via EmailJS
        const response = await emailjs.sendForm(
            'service_dmscxzb',
            'template_btiy2we',
            contactForm
        );
        
        console.log('Email enviado com sucesso:', response);
        
        // Mostrar notificação de sucesso
        showNotification('✓ Mensagem enviada com sucesso! Retornaremos em breve.', 'success', 5000);
        
        submitBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Mensagem Enviada!
        `;
        
        // Limpar validações visuais
        contactForm.querySelectorAll('.form-input').forEach(input => {
            input.classList.remove('valid', 'invalid');
        });
        contactForm.querySelectorAll('.form-error').forEach(error => {
            error.textContent = '';
        });
        
        contactForm.reset();
        const messageCountValue = document.getElementById('message-count-value');
        if (messageCountValue) messageCountValue.textContent = '0';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 3000);
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        
        // Mostrar notificação de erro
        showNotification('❌ Erro ao enviar. Por favor, tente novamente ou contate via WhatsApp.', 'error', 5000);
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// ========================================
// MÁSCARA DE TELEFONE
// ========================================

function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Limitar a 11 dígitos (máximo para telefone brasileiro)
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        
        // Aplicar máscara
        if (value.length > 0) {
            if (value.length <= 2) {
                value = `(${value}`;
            } else if (value.length <= 7) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
            }
        }
        
        e.target.value = value;
    });
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhoneMask);
} else {
    initPhoneMask();
}

// ========================================
// ANALYTICS E TRACKING
// ========================================

// Rastrear cliques nos botões CTA (descomentar se usar analytics)
// document.querySelectorAll('.btn-primary').forEach(btn => {
//     btn.addEventListener('click', () => {
//         console.log('CTA clicado:', btn.textContent.trim());
//     });
// });

// ========================================

// LAZY LOADING PARA IMAGENS (SE ADICIONAR)
// ========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// CURSOR CUSTOMIZADO (OPCIONAL)
// ========================================

const createCursor = () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
};

// Descomentar para ativar cursor customizado
// createCursor();

// ========================================
// PRELOADER (OPCIONAL)
// ========================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Remover skeleton/placeholder se houver
    document.querySelectorAll('.skeleton').forEach(el => {
        el.classList.remove('skeleton');
    });
});

// ========================================
// DARK MODE (FUTURO)
// ========================================

const initDarkMode = () => {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
    
    // Adicionar ao header
    const navWrapper = document.querySelector('.nav-wrapper');
    if (navWrapper) {
        navWrapper.appendChild(darkModeToggle);
    }
    
    // Verificar preferência salva
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '☀️';
    }
    
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
        darkModeToggle.innerHTML = isDark ? '☀️' : '🌙';
    });
};

// Descomentar para ativar dark mode
// initDarkMode();
