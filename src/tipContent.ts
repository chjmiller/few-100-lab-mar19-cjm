export interface TipContent {
     percent: string;
     tip: string;
     bill: string;
     total: string;
     classToggle: (...tokens: string[]) => void;
}