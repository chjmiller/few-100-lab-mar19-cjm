import './styles.css';
import { TipResult } from './tipResult';

const usd = new Intl.NumberFormat(`en-US`, { style: `currency`, currency: `USD` });
const billInput = document.getElementById(`bill-input`) as HTMLInputElement;
const captionPercent = document.getElementById(`caption-percent`);
const billOutput = document.getElementById(`bill-output`);
const percentOutput = document.getElementById(`percent-output`);
const tipOutput = document.getElementById(`tip-output`);
const totalOutput = document.getElementById(`total-output`);
const percentButtons = document.querySelectorAll(`[data-percent]`) as NodeListOf<HTMLButtonElement>;

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
    let tipResult: TipResult;

    if (billInput.valueAsNumber < 0){
        tipResult = {
            classToggle: billInput.classList.add,
            percent: ``,
            bill: ``,
            tip: ``,
            total: ``
        };
    }
    else{
        const button = selectButton(percentButtons, b => b.disabled);
        const tip = (parseInt(button.dataset.percent) * billInput.valueAsNumber * .01);
        const total = billInput.valueAsNumber + tip;
    
        tipResult = {
            classToggle: billInput.classList.remove,
            percent: `${button.dataset.percent}%`,        
            bill: usd.format(billInput.valueAsNumber),
            tip: usd.format(tip),
            total: usd.format(total)
        };
    }

    displayTip(tipResult);
}

function displayTip(tipResult: TipResult) {
    tipResult.classToggle.call(billInput.classList, `border-danger`);
    percentOutput.innerText = tipResult.percent;
    captionPercent.innerText = tipResult.percent;
    billOutput.innerText = tipResult.bill;
    tipOutput.innerText = tipResult.tip;
    totalOutput.innerText = tipResult.total;
}

calculateTip();

function onAmountClick(e: Event) {
    const button = e.target as HTMLButtonElement;
    percentButtons.forEach(b => b.disabled = false);
    button.disabled = true;
    localStorage.preferredPercent = button.dataset.percent;
    calculateTip();
}

percentButtons.forEach(el => el.addEventListener(`click`,  onAmountClick));
billInput.addEventListener(`keyup`, calculateTip);
billInput.addEventListener(`change`, calculateTip);
billInput.addEventListener(`mouseup`, calculateTip);

