
class PureSlide {
    constructor(container) {
        // Define o container da galeria
        this.container = container;
        if (!this.container) return;

        // Seleciona o elemento que contém os slides
        this.slideContainer = this.container.querySelector('.pure-slide__container');
        this.slides = Array.from(this.slideContainer.children);

        // Cria os controles se ainda não existirem
        this.createControls();

        // Adiciona os event listeners aos controles
        this.prevControl.addEventListener('click', () => this.showPrevSlide());
        this.nextControl.addEventListener('click', () => this.showNextSlide());
    }

    createControls() {
        // Verifica se os controles já existem; caso não, os cria
        this.prevControl = this.container.querySelector('.pure-slide__prev');
        this.nextControl = this.container.querySelector('.pure-slide__next');

        if (!this.prevControl) {
            this.prevControl = document.createElement('a');
            this.prevControl.classList.add('pure-slide__control', 'pure-slide__prev');
            this.prevControl.setAttribute('data-action', 'prev');
            this.container.insertBefore(this.prevControl, this.slideContainer);
        }

        if (!this.nextControl) {
            this.nextControl = document.createElement('a');
            this.nextControl.classList.add('pure-slide__control', 'pure-slide__next');
            this.nextControl.setAttribute('data-action', 'next');
            this.container.appendChild(this.nextControl);
        }
    }

    showNextSlide() {
        // Remove o primeiro slide e o adiciona no final
        const firstSlide = this.slides.shift();
        this.slideContainer.appendChild(firstSlide);
        this.slides.push(firstSlide);
    }

    showPrevSlide() {
        // Remove o último slide e o adiciona no início
        const lastSlide = this.slides.pop();
        this.slideContainer.insertBefore(lastSlide, this.slideContainer.firstChild);
        this.slides.unshift(lastSlide);
    }
}

// Função para instanciar o plugin para um ou mais elementos
function pureSlidePlugin(selector) {
    document.querySelectorAll(selector).forEach((container) => {
        new PureSlide(container);
    });
}

// Exemplo de uso: instanciar o plugin para o container com a classe 'pure-slide'
pureSlidePlugin('.pure-slide');
