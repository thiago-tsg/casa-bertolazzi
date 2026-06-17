//import '../plugins/pure-lightbox/pure-lightbox';
import '../plugins/pure-slide/pure-slide';

// Mascara de telefone e data
import VMasker from 'vanilla-masker';
// test if #f_telefone exists
if (document.querySelector("#f_telefone")) {
    VMasker(document.querySelector("#f_telefone")).maskPattern("(99) 99999-9999");
}
// test if #f_data exists
if (document.querySelector("#f_data")) {
    VMasker(document.querySelector("#f_data")).maskPattern("99/99/9999");
}

// Adiciona a classe fixed no header ao rolar a página
window.onscroll = function() {
    addClassOnScroll();
};

function addClassOnScroll() {
    // Verifica se a página foi rolada mais de 150px\
    const header = document.getElementById("tpl__header");
    if (!header) return;
    if (window.scrollY > 90) {
        header.classList.add("fixed");
    } else {
        header.classList.remove("fixed");
    }
}
