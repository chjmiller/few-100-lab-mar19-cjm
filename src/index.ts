import './styles.css';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const billInput = document.getElementById('bill-input') as HTMLInputElement;
const captionContainer = document.getElementById('caption-container');
const captionPercent = document.getElementById('caption-percent');
const outputContainer = document.getElementById('output-container');
const billOutput = document.getElementById('bill-output');
const percentOutput = document.getElementById('percent-output');
const tipOutput = document.getElementById('tip-output');
const totalOutput = document.getElementById('total-output');
const percentButtons = document.querySelectorAll('[data-percent]') as NodeListOf<HTMLButtonElement>;

function selectButton(buttons: NodeListOf<HTMLButtonElement>, callbackfn: (value: HTMLButtonElement) => boolean) {
    let button: HTMLButtonElement;
    buttons.forEach(b => {
        if (!button && callbackfn(b))
            button = b;
    });

    return button;
}

if (localStorage.preferredPercent === null)
    localStorage.preferredPercent = 15;

selectButton(percentButtons, b => b.dataset.percent === localStorage.preferredPercent).disabled = true;

function calculateTip() {
    let button = selectButton(percentButtons, b => b.disabled);
    let percentText = `${button.dataset.percent}%`;
    percentOutput.innerText = percentText;
    captionPercent.innerText = percentText;
    let tip = (parseInt(button.dataset.percent) * billInput.valueAsNumber * .01);
    let total = billInput.valueAsNumber + tip;
    billOutput.innerText = usd.format(billInput.valueAsNumber);
    tipOutput.innerText = usd.format(tip);
    totalOutput.innerText = usd.format(total);
}

calculateTip();

function onAmountClick(e: Event) {
    const button = e.target as HTMLButtonElement;
    percentButtons.forEach(b => b.disabled = false);
    button.disabled = true;
    localStorage.preferredPercent = button.dataset.percent;
    calculateTip();
}

percentButtons.forEach(el => el.addEventListener('click',  onAmountClick));
billInput.addEventListener('keyup', calculateTip);
billInput.addEventListener('change', calculateTip);
billInput.addEventListener('mouseup', calculateTip);

