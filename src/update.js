const span = document.querySelector('#time-now');

export default function update() {
    span.textContent = new Date().toJSON();
    setTimeout(update, 1000);
}
