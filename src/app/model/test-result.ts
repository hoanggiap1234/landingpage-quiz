
export interface ItestResult{
    email : string,
    mobile : string,
    answerIDs: string[],
}

export class TestResult implements ItestResult{
    email!: string;
    mobile !: string;
    answerIDs!: string[];
}