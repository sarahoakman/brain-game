import {
  summariseQuestions, initialisePercentages,
  initialiseTimeTaken, getValues, findTopFive, calculatePoints,
  calculateAvgTime
} from './helpers';
import { shallow } from 'enzyme';
import * as React from 'react';

import { GameResults } from '../pages/results'

// testing conditional rendering depending on if there are questions
describe('GameResults', () => {
  describe('when there are no questions', () => {
    const target = {
      series: 'Question 1',
      point: 1
    }
    const data = {
      percentages: [],
      timeTaken: [],
      topPlayers: [],
      setTargetItem: jest.fn(),
      targetItem: target,
    }
    it('display explanation text', () => {
      const container = shallow(<GameResults data={data} />);
      const divNoQ = container.find('#noQuestions');
      const divHasQ = container.find('#hasQuestions');
      expect(divNoQ).toHaveLength(1);
      expect(divHasQ).toHaveLength(0);
    });
  });
  describe('when there are questions', () => {
    const target = {
      series: 'Question 1',
      point: 1
    }
    const data = {
      percentages: [{}],
      timeTaken: [{}],
      topPlayers: [{}],
      setTargetItem: jest.fn(),
      targetItem: target,
    }
    it('displays charts and tables', () => {
      const container = shallow(<GameResults data={data} />);
      const divNoQ = container.find('#noQuestions');
      const divHasQ = container.find('#hasQuestions');
      expect(divNoQ).toHaveLength(0);
      expect(divHasQ).toHaveLength(1);
    });
  });
});

// testing helper function which determine top 5 players
describe('findTopFive', () => {
  it('displays all players in descending order when less than 5 players', () => {
    const players = [
      {
        name: 'A',
        total: 10
      },
      {
        name: 'B',
        total: 20
      },
      {
        name: 'C',
        total: 15
      }
    ]
    const expected = [
      {
        name: 'B',
        total: 20
      },
      {
        name: 'C',
        total: 15
      },
      {
        name: 'A',
        total: 10
      }
    ]
    const result = findTopFive(players);
    expect(result).toEqual(expected);
  });
  it('displays only top 5 in descending order when there are more than five players', () => {
    const players = [
      {
        name: 'A',
        total: 10
      },
      {
        name: 'B',
        total: 20
      },
      {
        name: 'C',
        total: 15
      },
      {
        name: 'D',
        total: 13
      },
      {
        name: 'E',
        total: 5
      },
      {
        name: 'F',
        total: 50
      }
    ]
    const expected = [
      {
        name: 'F',
        total: 50
      },
      {
        name: 'B',
        total: 20
      },
      {
        name: 'C',
        total: 15
      },
      {
        name: 'D',
        total: 13
      },
      {
        name: 'A',
        total: 10
      }
    ]
    const result = findTopFive(players);
    expect(result).toEqual(expected);
  });
  it('when there are players with the same score', () => {
    const players = [
      {
        name: 'A',
        total: 10
      },
      {
        name: 'B',
        total: 20
      },
      {
        name: 'C',
        total: 20
      }
    ]
    const expected = [
      {
        name: 'B',
        total: 20
      },
      {
        name: 'C',
        total: 20
      },
      {
        name: 'A',
        total: 10
      }
    ]
    const result = findTopFive(players);
    expect(result).toEqual(expected);
  });
});

// testing helper function which calculates points for each question for each player
describe('calculatePoints', () => {
  it('time difference in seconds only', () => {
    const total = calculatePoints('00:00:13', '00:00:30', 0, 10);
    expect(total).toEqual(170);
  });
  it('make sure fastest person wins given both are correct' +
  '(handling time difference in minutes and seconds)', () => {
    const total1 = calculatePoints('00:00:13', '00:02:00', 0, 10);
    expect(total1).toEqual(1070);
    const total2 = calculatePoints('00:01:45', '00:02:00', 0, 10);
    expect(total2).toEqual(150);
  });
});

// testing helper function which calculates average time to answer each question
describe('calculateAvgTime', () => {
  const player1 =
    {
      answeredAt: '2021-04-20T14:45:21',
      questionStartedAt: '2021-04-20T13:52:08'
    }
  const player2 =
    {
      answeredAt: '2021-04-20T13:52:08',
      questionStartedAt: '2021-04-20T13:52:08'
    }
  const player3 =
    {
      answeredAt: '2021-04-20T13:55:33',
      questionStartedAt: '2021-04-20T13:52:08'
    }
  const qa = [
    {
      time_limit: '02:00'
    }
  ]
  let timeTaken = [];
  // initialise with initiate function
  timeTaken = initialiseTimeTaken(qa, timeTaken);
  // average of just one number
  it('time difference includes minutes and seconds', () => {
    const [time, total] = calculateAvgTime(timeTaken, player1, '00:02:00', 0);
    expect(time).toEqual('00:53:13');
    expect(total).toEqual([{ id: 'Question 1', num: 1, time: 3193 }]);
  });
  // average of 2 numbers
  it('add on a number which is difference with just seconds', () => {
    const [time, total] = calculateAvgTime(timeTaken, player3, '00:02:00', 0);
    expect(time).toEqual('00:03:25');
    expect(total).toEqual([{ id: 'Question 1', num: 2, time: 1699 }]);
  });
  // average of three numbers (but the third one is 0)
  it('add one a number which is no time difference', () => {
    const [time, total] = calculateAvgTime(timeTaken, player2, '00:02:00', 0);
    expect(time).toEqual('00:00:00');
    expect(total).toEqual([{ id: 'Question 1', num: 3, time: 1133 }]);
  });
});

// testing helper function which handles edge cases when answering questions
describe('getValues', () => {
  const qa = [
    {
      id: 0,
      type: 'single',
      text: 'What is your name',
      time_limit: '00:05',
      points: '10',
      answer: [
        {
          id: 0,
          text: 'A',
          correct: true
        },
        {
          id: 1,
          text: 'B',
          correct: false
        }
      ]
    },
    {
      id: 1,
      type: 'single',
      text: 'How old are you?',
      time_limit: '00:10',
      points: '10',
      answer: [
        {
          id: 0,
          text: '10',
          correct: true
        },
        {
          id: 1,
          text: '11',
          correct: false
        }
      ]
    }
  ];
  it('when player does not select an answer', () => {
    let players = [];
    let percentages = [];
    let timeTaken = [];
    let questionsAnswers = [];
    let results = [];
    results = [
      {
        name: 'Ruby',
        answers: [
          {
            questionStartedAt: null,
            answeredAt: null,
            answerIds: [],
            correct: false
          },
          {
            questionStartedAt: '2021-04-20T18:44:08.735Z',
            answeredAt: '2021-04-20T18:44:14.735Z',
            answerIds: [
              0
            ],
            correct: true
          }
        ]
      },
      {
        name: 'Jennifer',
        answers: [
          {
            questionStartedAt: null,
            answeredAt: null,
            answerIds: [],
            correct: false
          },
          {
            questionStartedAt: null,
            answeredAt: null,
            answerIds: [],
            correct: false
          }
        ]
      }
    ];
    questionsAnswers = summariseQuestions(questionsAnswers, qa);
    percentages = initialisePercentages(questionsAnswers, percentages);
    timeTaken = initialiseTimeTaken(questionsAnswers, timeTaken);
    [percentages, timeTaken, players] = getValues(results, questionsAnswers,
      players, percentages, timeTaken);
    expect(percentages).toEqual([{ id: 'Question 1', count: 0 },
      { id: 'Question 2', count: 1 }]);
    // expect not answering to be the same as an incorrect answer
    // (score would be 0 for it), and time taken would be the whole time limit
    expect(timeTaken).toEqual([{ id: 'Question 1', time: 5, num: 2 },
      { id: 'Question 2', time: 8, num: 2 }]);
    expect(players).toEqual([{ name: 'Ruby', total: 40 },
      { name: 'Jennifer', total: 0 }]);
  });
  it('when player got answer wrong', () => {
    let players = [];
    let percentages = [];
    let timeTaken = [];
    let questionsAnswers = [];
    let results = [];
    results = [
      {
        name: 'Ruby',
        answers: [
          {
            questionStartedAt: null,
            answeredAt: null,
            answerIds: [],
            correct: false
          },
          {
            questionStartedAt: '2021-04-20T18:44:08.735Z',
            answeredAt: '2021-04-20T18:44:14.735Z',
            answerIds: [
              0
            ],
            correct: false
          }
        ]
      },
      {
        name: 'Jennifer',
        answers: [
          {
            questionStartedAt: null,
            answeredAt: null,
            answerIds: [],
            correct: false
          },
          {
            questionStartedAt: null,
            answeredAt: null,
            answerIds: [],
            correct: false
          }
        ]
      }
    ];
    questionsAnswers = summariseQuestions(questionsAnswers, qa);
    percentages = initialisePercentages(questionsAnswers, percentages);
    timeTaken = initialiseTimeTaken(questionsAnswers, timeTaken);
    [percentages, timeTaken, players] = getValues(results,
      questionsAnswers, players, percentages, timeTaken);
    // expect number of people getting question right decreases,
    // timeTaken stays the same and score decreases
    expect(percentages).toEqual([{ id: 'Question 1', count: 0 },
      { id: 'Question 2', count: 0 }]);
    expect(timeTaken).toEqual([{ id: 'Question 1', time: 5, num: 2 },
      { id: 'Question 2', time: 8, num: 2 }]);
    expect(players).toEqual([{ name: 'Ruby', total: 0 },
      { name: 'Jennifer', total: 0 }]);
  });
  it('game stopped prematurely - number of answers < number of questions', () => {
    let players = [];
    let percentages = [];
    let timeTaken = [];
    let questionsAnswers = [];
    let results = [];
    results = [
      {
        name: 'Ruby',
        answers: [
          {
            questionStartedAt: null,
            answeredAt: null,
            answerIds: [],
            correct: false
          }
        ]
      },
      {
        name: 'Jennifer',
        answers: [
          {
            questionStartedAt: null,
            answeredAt: null,
            answerIds: [],
            correct: false
          }
        ]
      }
    ];
    questionsAnswers = summariseQuestions(questionsAnswers, qa);
    percentages = initialisePercentages(questionsAnswers, percentages);
    timeTaken = initialiseTimeTaken(questionsAnswers, timeTaken);
    [percentages, timeTaken, players] = getValues(results,
      questionsAnswers, players, percentages, timeTaken);
    // expect no errors second entry is all just 0 and max
    expect(percentages).toEqual([{ id: 'Question 1', count: 0 }, { id: 'Question 2', count: 0 }]);
    expect(timeTaken).toEqual([{ id: 'Question 1', time: 5, num: 2 }, { id: 'Question 2', time: 10, num: 0 }]);
    expect(players).toEqual([{ name: 'Ruby', total: 0 }, { name: 'Jennifer', total: 0 }]);
  });
});
