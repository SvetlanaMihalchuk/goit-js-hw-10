import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const createNotification = document.querySelector('.form');

createNotification.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  const delay = event.target.elements.delay.value;
  const state = event.target.elements.state.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
  promise
    .then(delay => {
      iziToast.success({
        color: '#59A10D',
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      iziToast.error({
        color: '#EF4040',
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .finally(() => event.target.reset());
}
