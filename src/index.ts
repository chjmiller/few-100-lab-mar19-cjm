import './styles.css';
import { TipContent } from './tipContent';

const defaultPercentage = 15;
const usd = new Intl.NumberFormat(`en-US`, { style: `currency`, currency: `USD` });
const billInput = document.getElementById(`bill-input`) as HTMLInputElement;
const captionPercent = document.getElementById(`caption-percent`);
const billOutput = document.getElementById(`bill-output`);
const percentOutput = document.getElementById(`percent-output`);
const tipOutput = document.getElementById(`tip-output`);
const totalOutput = document.getElementById(`total-output`);
const percentButtons = document.querySelectorAll(`[data-percent]`) as NodeListOf<HTMLButtonElement>;

function findButton(buttons: NodeListOf<HTMLButtonElement>, callbackfn: (value: HTMLButtonElement) => boolean) {
    let button: HTMLButtonElement;
    buttons.forEach(b => {
        if (!button && callbackfn(b))
            button = b;
    });

    return button;
}

function displayTip() {
    const tipContent = billInput.valueAsNumber >= 0 ? calculateTip() : {
        classToggle: billInput.classList.add,
        percent: ``,
        bill: ``,
        tip: ``,
        total: ``
    };

    tipContent.classToggle.call(billInput.classList, `border-danger`);
    percentOutput.innerText = tipContent.percent;
    captionPercent.innerText = tipContent.percent;
    billOutput.innerText = tipContent.bill;
    tipOutput.innerText = tipContent.tip;
    totalOutput.innerText = tipContent.total;
}

function calculateTip(): TipContent {
    const button = findButton(percentButtons, b => b.disabled);
    const tip = (parseInt(button.dataset.percent) * billInput.valueAsNumber * .01);
    const total = billInput.valueAsNumber + tip;

    return {
        classToggle: billInput.classList.remove,
        percent: `${button.dataset.percent}%`,
        bill: usd.format(billInput.valueAsNumber),
        tip: usd.format(tip),
        total: usd.format(total)
    };
}

function onAmountClick(e: Event) {
    const button = e.target as HTMLButtonElement;
    percentButtons.forEach(b => b.disabled = false);
    button.disabled = true;
    localStorage.preferredPercent = button.dataset.percent;
    displayTip();
}

percentButtons.forEach(el => el.addEventListener(`click`, onAmountClick));
[`keyup`, `change`, `mouseup`].forEach(ev => billInput.addEventListener(ev, displayTip));

if (localStorage.preferredPercent === null)
    localStorage.preferredPercent = defaultPercentage;

findButton(percentButtons, b => b.dataset.percent === localStorage.preferredPercent).disabled = true;
displayTip();