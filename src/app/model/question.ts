export interface IQuestion{
  id: string,
  title : string,
  description : string,
  review: boolean,
  answerDTOS: [{
    id: string,
    answer: string,
    corectAnswer: boolean,
    status: boolean,
  }]
}

export class Question implements IQuestion{
  id!: string;
  title!: string;
  description!: string;
  review!: boolean;
  answerDTOS!: [{
    id: string;
    answer: string;
    corectAnswer: boolean;
    status: boolean;
  }];
}
