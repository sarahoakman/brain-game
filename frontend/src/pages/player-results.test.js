import { shallow } from 'enzyme';
import * as React from 'react';
import { ResultDetails, ResultAccordian, AllResults } from './player-results';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import Typography from '@material-ui/core/Typography';

// tests the result details shown in the result accordian
describe('ResultDetails', () => {
  it('set correct style with correct answer', () => {
    const correctColor = '#56bc32';
    const result = shallow(<ResultDetails status={true} time='' />);
    expect(result.props().style).toHaveProperty('backgroundColor', correctColor);
  });

  it('set incorrect style with incorrect answer', () => {
    const incorrectColor = '#ff6060';
    const result = shallow(<ResultDetails status={false} time='' />);
    expect(result.props().style).toHaveProperty('backgroundColor', incorrectColor);
  });

  it('set correct emoticon with correct answer', () => {
    const result = shallow(<ResultDetails status={true} time='' />);
    expect(result.containsMatchingElement(<InsertEmoticonIcon />)).toEqual(true);
    expect(result.containsMatchingElement(<SentimentVeryDissatisfiedIcon />)).toEqual(false);
  });

  it('set incorrect emoticon with icorrect answer', () => {
    const result = shallow(<ResultDetails status={false} time='' />);
    expect(result.containsMatchingElement(<InsertEmoticonIcon />)).toEqual(false);
    expect(result.containsMatchingElement(<SentimentVeryDissatisfiedIcon />)).toEqual(true);
  });

  it('set text with correct answer', () => {
    const result = shallow(<ResultDetails status={true} time='' />);
    expect(result.find('p').first().text()).toBe('Correct!');
  });

  it('set text with incorrect answer', () => {
    const result = shallow(<ResultDetails status={false} time='' />);
    expect(result.find('p').first().text()).toBe('Incorrect!');
  });

  it('set time with null input', () => {
    const result = shallow(<ResultDetails status={false} time={null} />);
    expect(result.find('p').last().text()).toBe('Not Answered');
  });

  it('set time with time input', () => {
    const result = shallow(<ResultDetails status={false} time='03:30' />);
    expect(result.find('p').last().text()).toBe('Answered in 03:30');
  });
});

// tests the results title shown in the result accordian
describe('ResultAccordian', () => {
  it('set correct style with correct answer', () => {
    const background = '#d4f1ca';
    const color = '#30691b';
    const result = shallow(<ResultAccordian question={1} status={true} time='' />);
    expect(result.props().style).toHaveProperty('backgroundColor', background);
    expect(result.props().style).toHaveProperty('color', color);
  });

  it('set incorrect style with incorrect answer', () => {
    const background = '#ffdede';
    const color = '#b70000';
    const result = shallow(<ResultAccordian question={1} status={false} time='' />);
    expect(result.props().style).toHaveProperty('backgroundColor', background);
    expect(result.props().style).toHaveProperty('color', color);
  });

  it('set question text with question number given', () => {
    const result = shallow(<ResultAccordian question={3} status={true} time='' />);
    expect(result.find(Typography).first().text()).toBe('Question 3');
  });
});

// test all of the results as a whole
describe('AllResults', () => {
  const results = [
    {
      questionStartedAt: '2021-01-05T14:47:58.000Z',
      answeredAt: '2021-01-05T14:48:10.000Z',
      correct: false,
    },
  ];
  const multipleResults = [
    {
      questionStartedAt: '2021-01-05T14:47:58.000Z',
      answeredAt: '2021-01-05T14:48:10.000Z',
      correct: true,
    },
    {
      questionStartedAt: '2021-01-05T14:47:58.000Z',
      answeredAt: '2021-01-05T14:48:00.300Z',
      correct: false,
    },
    {
      questionStartedAt: '2021-01-05T14:47:58.000Z',
      answeredAt: '2021-01-05T14:48:18.60Z',
      correct: false,
    }
  ];
  const empty = [];

  it('show message if error occured', () => {
    const result = shallow(<AllResults results={results} error={true} />);
    expect(result.find('p').first().text()).toBe('0 questions answered');
  });

  it('no message if error did not occur', () => {
    const result = shallow(<AllResults results={results} error={false}/>);
    expect(result.find('p').length).toBe(0);
  });

  it('show message if results are empty', () => {
    const result = shallow(<AllResults results={empty} error={false}/>);
    expect(result.find('p').first().text()).toBe('0 questions answered');
  });

  it('show 1 result if given', () => {
    const result = shallow(<AllResults results={results} error={false}/>);
    expect(result.find(ResultAccordian).length).toBe(1)
  });

  it('show >1 result if given', () => {
    const result = shallow(<AllResults results={multipleResults} error={false}/>);
    expect(result.find(ResultAccordian).length).toBe(3)
  });

  it('time calculation test', () => {
    const result = shallow(<AllResults results={multipleResults} error={false}/>);
    expect(result.find(ResultAccordian).at(0).props().time).toBe('00:12');
    // check rounding
    expect(result.find(ResultAccordian).at(1).props().time).toBe('00:02');
    expect(result.find(ResultAccordian).at(2).props().time).toBe('00:21');
  });

  it('set status as true given correct result', () => {
    const result = shallow(<AllResults results={multipleResults} error={false}/>);
    expect(result.find(ResultAccordian).at(0).props().status).toBe(true);
  });

  it('set status as false given incorrect result', () => {
    const result = shallow(<AllResults results={multipleResults} error={false}/>);
    expect(result.find(ResultAccordian).at(1).props().status).toBe(false);
  });
});
