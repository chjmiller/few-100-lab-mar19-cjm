import './styles.css';
import { TipContent } from './tipContent';

const defaultPercentage = 15;
const usd = new Intl.NumberFormat(`en-US`, { style: `currency`, currency: `USD` });
const inputEvents = [`keyup`, `change`, `mouseup`];
const billInput = document.getElementById(`bill-input`) as HTMLInputElement;
const patronInput = document.getElementById(`patron-input`) as HTMLInputElement;
const captionPercent = document.getElementById(`caption-percent`);
const billOutput = document.getElementById(`bill-output`);
const percentOutput = document.getElementById(`percent-output`);
const tipOutput = document.getElementById(`tip-output`);
const totalOutput = document.getElementById(`total-output`);
const patronOutput = document.getElementById(`patron-output`);
const percentButtons = document.querySelectorAll(`[data-percent]`) as NodeListOf<HTMLButtonElement>;
const customPercentButton = document.getElementById(`custom-percent-button`) as HTMLButtonElement;
const customPercentInput = document.getElementById(`custom-percent-input`) as HTMLInputElement;
const customPercentCaption = document.getElementById(`custom-percent-caption`);
const inputElements = [billInput, customPercentInput, patronInput];

function findButton(buttons: NodeListOf<HTMLButtonElement>, callbackfn: (value: HTMLButtonElement) => boolean) {
    let button: HTMLButtonElement;
    buttons.forEach(b => {
        if (!button && callbackfn(b))
            button = b;
    });

    return button;
}

function displayTip() {
    const button = findButton(percentButtons, b => b.disabled);
    const hideCustom = button !== customPercentButton;
    customPercentInput.hidden = hideCustom;
    customPercentCaption.hidden = hideCustom;
    const percentText = button === customPercentButton ? customPercentInput.value : button.dataset.percent;
    localStorage.preferredPercent = percentText;

    if (customPercentInput.value === ``)
        customPercentInput.value = button.dataset.percent;

    const tipContent = inputElements.every(el => el.valueAsNumber >= 0) ? calculateTip(percentText) : {
        classToggle: billInput.classList.add,
        percent: ``,
        bill: ``,
        tip: ``,
        total: ``,
        patron: ``
    };

    percentOutput.innerText = tipContent.percent;
    captionPercent.innerText = tipContent.percent;
    billOutput.innerText = tipContent.bill;
    tipOutput.innerText = tipContent.tip;
    totalOutput.innerText = tipContent.total;
    patronOutput.innerText = tipContent.patron;
}

function calculateTip(percentText: string): TipContent {
    const tip = parseInt(percentText) * billInput.valueAsNumber * .01;
    const total = billInput.valueAsNumber + tip;
    const patron = total / patronInput.valueAsNumber;

    return {
        percent: `${percentText}%`,
        bill: usd.format(billInput.valueAsNumber),
        tip: usd.format(tip),
        total: usd.format(total),
        patron: usd.format(patron)
    };
}

function onAmountClick(e: Event) {
    percentButtons.forEach(b => b.disabled = false);
    const button = e.target as HTMLButtonElement;
    button.disabled = true;
    displayTip();
}

function onPatronChange() {
    patronInput.valueAsNumber = Math.floor(patronInput.valueAsNumber);
    displayTip();
}

function isInputValid(textbox: HTMLInputElement) {
    return textbox.valueAsNumber >= parseInt(textbox.min);
}

function onNumericInputChange(e: Event) {
    const textbox = e.target as HTMLInputElement;
    const classToggle = isInputValid(textbox) ? textbox.classList.remove : textbox.classList.add;
    classToggle.call(textbox.classList, `border-danger`);
}

function addInputListeners(eventName: string) {
    inputElements.forEach(el => el.addEventListener(eventName, onNumericInputChange));
    billInput.addEventListener(eventName, displayTip);
    customPercentInput.addEventListener(eventName, displayTip)
    patronInput.addEventListener(eventName, onPatronChange);
}

function ready() {
    percentButtons.forEach(el => el.addEventListener(`click`, onAmountClick));
    inputEvents.forEach(addInputListeners);

    if (localStorage.preferredPercent === null)
        localStorage.preferredPercent = defaultPercentage;

    let preferredButton = findButton(percentButtons, b => b.dataset.percent === localStorage.preferredPercent);

    if (!preferredButton) {
        preferredButton = customPercentButton;
        customPercentInput.value = localStorage.preferredPercent;
    }

    preferredButton.disabled = true;
    displayTip();
}

ready();
