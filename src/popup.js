document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('hello');
    
    btn.style.backgroundColor = 'yellow';
    
    btn.addEventListener('click', () => {
        btn.style.backgroundColor = 'blue';
    });
});