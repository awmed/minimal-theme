function myLoad() {
    document.querySelector('.spinner').classList.add('spinner-1');
    setTimeout(() => {
      document.querySelector('.spinner').classList.remove('spinner-1');
      document.querySelector('body .hidden').classList.remove('hidden');
    }, 600);
}