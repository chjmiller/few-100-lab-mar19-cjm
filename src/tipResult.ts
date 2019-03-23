export interface TipResult {
     percent : string;
     tip: string;
     bill: string;
     total: string;
     classToggle: (...tokens: string[]) => void;
}