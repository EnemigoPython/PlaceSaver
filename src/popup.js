document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('hello');
    const input = document.getElementById('tagInput');
    
    btn.style.backgroundColor = 'yellow';
    
    btn.addEventListener('click', () => {
        const value = input.value;
        btn.style.backgroundColor = 'green';
        chrome.runtime.sendMessage({tagName: value}, function(response) {
            //console.log(response.farewell);
        });
    });
});