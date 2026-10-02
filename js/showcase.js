document.querySelectorAll('[data-example-action]').forEach(button=>button.addEventListener('click',()=>{
 const status=button.closest('.system__section').querySelector('[data-example-status]');
 if(status)status.textContent=button.dataset.exampleAction+'. Example action completed.';
}));
