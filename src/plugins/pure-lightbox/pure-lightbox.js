
class LightboxGallery {
    constructor(gallerySelector) {
        this.gallerySelector = gallerySelector;
        this.currentImageIndex = 0;
        this.images = [];
        this.createLightbox();
        this.initializeGallery();
    }

    // Cria o lightbox com as imagens ampliadas
    createLightbox() {
        const lightboxDiv = document.createElement('div');
        lightboxDiv.id = 'lightbox';
        lightboxDiv.classList.add('lightbox');
        lightboxDiv.innerHTML = `
            <span class="close">&times;</span>
            <img class="lightbox-content" id="lightbox-image" />
            <a class="prev">&#10094;</a>
            <a class="next">&#10095;</a>
        `;
        document.body.appendChild(lightboxDiv);

        document.querySelector('.close').addEventListener('click', () => this.closeLightbox());
        document.querySelector('.next').addEventListener('click', () => this.nextImage());
        document.querySelector('.prev').addEventListener('click', () => this.prevImage());
    }

    // Inicializa a galeria capturando as imagens e configurando eventos
    initializeGallery() {
        const galleryItems = document.querySelectorAll(this.gallerySelector);

        galleryItems.forEach((item, index) => {
            this.images.push(item.getAttribute('href'));

            // Adiciona o evento de clique para abrir o lightbox
            item.addEventListener('click', (e) => {
                e.preventDefault(); // Evita que o link seja aberto
                this.openLightbox(index);
            });
        });
    }

    // Abre o lightbox com a imagem ampliada
    openLightbox(index) {
        this.currentImageIndex = index;
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');

        lightbox.classList.add('show'); // Exibe o lightbox
        lightboxImage.style.opacity = 0; // Oculta a imagem anterior para a transição suave

        lightboxImage.onload = () => {
            lightboxImage.classList.add('show');
            lightboxImage.style.opacity = 1;
        };

        // Define a imagem a ser exibida
        lightboxImage.src = this.images[this.currentImageIndex];
    }

    // Fecha o lightbox
    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('show');
        const lightboxImage = document.getElementById('lightbox-image');
        lightboxImage.classList.remove('show');
    }

    // Exibe a próxima imagem
    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.changeImage();
    }

    // Exibe a imagem anterior
    prevImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        this.changeImage();
    }

    // Muda a imagem exibida no lightbox
    changeImage() {
        const lightboxImage = document.getElementById('lightbox-image');
        lightboxImage.classList.remove('show');

        lightboxImage.onload = () => {
            lightboxImage.classList.add('show');
            lightboxImage.style.opacity = 1;
        };

        lightboxImage.src = this.images[this.currentImageIndex]; // Atualiza a imagem no lightbox
    }
}

// Função para instanciar o plugin para uma galeria específica
function lightboxPlugin(selector) {
    new LightboxGallery(selector);
}

// Exemplo de uso: instanciar o plugin para as imagens com a classe 'gallery-item'
lightboxPlugin('.gallery-item');
