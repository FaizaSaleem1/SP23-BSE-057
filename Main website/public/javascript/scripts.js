// Get the header element
const header = document.querySelector('.header-content');
const placeholder = document.createElement('div');
placeholder.classList.add('sticky-placeholder');
header.parentNode.insertBefore(placeholder, header.nextSibling);

// When the page scrolls
window.onscroll = function() {
  
    if (window.scrollY > 40) {
        header.classList.add('sticky'); 
        placeholder.style.display = 'block';
    } else {
        header.classList.remove('sticky'); 
        placeholder.style.display = 'none'; 
    }
};
