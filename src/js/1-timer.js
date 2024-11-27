import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const myInput = document.querySelector('#datetime-picker');
const button = document.querySelector('button[data-start]');
const daysElement = document.querySelector('span[data-days]');
const hoursElement = document.querySelector('span[data-hours]');
const minutesElement = document.querySelector('span[data-minutes]');
const secondsElement = document.querySelector('span[data-seconds]');

button.disabled = true;

let userSelectedDate = null;
let interval = null;

iziToast.settings({
  timeout: 5000,
  color: '#EF4040',
  position: 'topRight',
});

const fp = flatpickr(myInput, {
  enableTime: true,
  dateFormat: 'Y-m-d H:i',
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0].getTime() < Date.now()) {
      iziToast.error({ message: 'Please choose a date in the future' });
      button.disabled = true;
    } else {
      button.disabled = false;
      userSelectedDate = selectedDates[0];
    }
    console.log(selectedDates[0]);
  },
});

function handleClick() {
  interval = setInterval(() => {
    const nowTime = new Date();
    const deltaTime = userSelectedDate - nowTime;
    if (deltaTime <= 1000) {
      clearInterval(interval);
      updateTimerDisplay(0);
      button.disabled = true;
      myInput.disabled = false;
      return;
    }
    updateTimerDisplay(deltaTime);
  }, 1000);
}
function updateTimerDisplay(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);
  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

button.addEventListener('click', () => {
  myInput.disabled = true;
  button.disabled = true;
  handleClick();
});
console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
