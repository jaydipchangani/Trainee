document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const loader = document.getElementById('loader');
    const navLinks = document.querySelectorAll('.nav-link');

    loadPage('homepage');

    navLinks.forEach(link =>{
        link.addEventListener('click',(e)=>{
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            loadPage(page);
        })
    })

    function loadPage(page){
        loader.style.display = 'flex';
        content.innerHTML = '';

        setTimeout(() =>{
            fetch(`${page}.html`)
            .then(response => response.text())
            .then(html =>{
                content.innerHTML = html;
                loader.style.display = 'none';
            })
            .catch(err =>{
                content.innerHTML = '<p>Error loading page</p>';
                loader.style.display = 'none';
                console.log(err);
            });
        },1000);
    }
});