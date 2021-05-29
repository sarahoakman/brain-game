import { shallow } from 'enzyme';
import * as React from 'react';
import { GameCard, GameCardButton, StopStartButton } from './grid-item'
import { render, fireEvent } from '@testing-library/react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// tests a game card button that appears on a game card
describe('GameCardButton', () => {
  const noop = () => {};

  it('triggers onClick event handler when pressed', () => {
    const onClick = jest.fn();
    shallow(<GameCardButton onClick={onClick} title='' />).simulate('click');
    expect(onClick).toBeCalledTimes(1);
  });

  it('aria-label attribute is defined', () => {
    const button = shallow(<GameCardButton onClick={noop} title='' />);
    expect(button.props()['aria-label']).toBeDefined();
  });

  it('tooltip text has the title given', () => {
    const title = 'Title'
    const button = shallow(<GameCardButton onClick={noop} title={title} />);
    expect(button.props().title).toBe(title)
  });

  it('triggers tooltip when hovered over', async () => {
    const title = 'Title';
    const button = render(<GameCardButton onClick={noop} title={title} />);
    fireEvent.mouseOver(button.getByLabelText('game-card-button'))
    const tooltip = await button.findByText(title);
    expect(tooltip).toBeInTheDocument();
  });

  it('no tooltip when not hovered over', async () => {
    const title = 'Title';
    const button = render(<GameCardButton onClick={noop} title={title} />);
    fireEvent.mouseOver(button.getByLabelText('game-card-button'))
    const tooltip = await button.queryByText(title);
    expect(tooltip).not.toBeInTheDocument();
  });

  // testing use cases for checking each icon
  it('edit icon when edit game is the title given', () => {
    const title = 'Edit Game'
    const button = shallow(<GameCardButton onClick={noop} title={title} />);
    expect(button.containsMatchingElement(<EditIcon />)).toEqual(true);
  });

  it('delete icon when delete game is the title given', () => {
    const title = 'Delete Game'
    const button = shallow(<GameCardButton onClick={noop} title={title} />);
    expect(button.containsMatchingElement(<DeleteIcon />)).toEqual(true);
  });

  it('start icon when start game is the title given', () => {
    const title = 'Start Game'
    const button = shallow(<GameCardButton onClick={noop} title={title} />);
    expect(button.containsMatchingElement(<PlayArrowIcon />)).toEqual(true);
  });

  it('Stop icon when stop game is the title given', () => {
    const title = 'Stop Game'
    const button = shallow(<GameCardButton onClick={noop} title={title} />);
    expect(button.containsMatchingElement(<StopIcon />)).toEqual(true);
  });

  it('advance icon when advance game is the title given', () => {
    const title = 'Advance Game'
    const button = shallow(<GameCardButton onClick={noop} title={title} />);
    expect(button.containsMatchingElement(<SportsEsportsIcon />)).toEqual(true);
  });
});

// tests what button (start, stop, advance) is shown on the game card
describe('StopStartButton', () => {
  const noop = () => {};

  // testing use cases for what game card button is shown
  it('start game when no quiz is active', () => {
    const quiz = {
      active: null
    }
    const button = shallow(
            <StopStartButton
              quiz={quiz}
              startGame={noop}
              stopGame={noop}
              advanceGame={noop}
            />
    );
    expect(button.props().title).toBe('Start Game');
  });

  it('stop game when quiz is active and no quiz questions', () => {
    const quiz = {
      active: 1234567,
      questions: 0,
    }
    const button = shallow(
            <StopStartButton
              quiz={quiz}
              startGame={noop}
              stopGame={noop}
              advanceGame={noop}
            />
    );
    expect(button.props().title).toBe('Stop Game');
  });

  it('stop game when quiz is active and game has started', () => {
    const quiz = {
      active: 1234567,
      questions: 2,
      position: 1,
    }
    const button = shallow(
            <StopStartButton
              quiz={quiz}
              startGame={noop}
              stopGame={noop}
              advanceGame={noop}
            />
    );
    expect(button.props().title).toBe('Stop Game');
  });

  it('stop game when quiz is active, 0 questions, game has started',
    () => {
      const quiz = {
        active: 1234567,
        questions: 0,
        position: 0,
      }
      const button = shallow(
            <StopStartButton
              quiz={quiz}
              startGame={noop}
              stopGame={noop}
              advanceGame={noop}
            />
      );
      expect(button.props().title).toBe('Stop Game');
    });

  it('advance and stop game when quiz is active, has questions, game not started',
    () => {
      const quiz = {
        active: 1234567,
        questions: 3,
        position: -1,
      }
      const button = shallow(
            <StopStartButton
              quiz={quiz}
              startGame={noop}
              stopGame={noop}
              advanceGame={noop}
            />
      );
      expect(button.props().children.length).toBe(2);
      expect(button.props().children[0].key).toBe('advance-game');
      expect(button.props().children[1].key).toBe('stop-game');
    });
});

// testing the game card and it's content
describe('GameCard', () => {
  const noop = () => {};
  const quiz = {
    title: 'Title 1',
    img: 'thumbnail 1',
    questions: 5,
    total_time: '01:20',
  }
  const card = shallow(<GameCard
              quiz={quiz}
              response={null}
              setLink={noop}
              setOpen={noop}
              setOpenResults={noop}
              setResponse={noop}
            />);

  it('game card contains all components', () => {
    expect(card.props().children.length).toBe(5);
  })

  it('game name is set with aria-label', () => {
    const name = card.props().children[0];
    expect(name.props['aria-label']).toBe('game-name');
  });

  it('game name matches quiz.title', () => {
    const name = card.props().children[0];
    expect(name.props.children).toBe(quiz.title)
  });

  it('game thumbnail is set with aria-label', () => {
    const img = card.props().children[1];
    expect(img.props['aria-label']).toBe('game-thumbnail');
  });

  it('game thumbnail matches quiz.img', () => {
    const img = card.props().children[1];
    expect(img.props.children.props.src).toBe(quiz.img);
  });

  it('game thumbnail has alt tag', () => {
    const img = card.props().children[1];
    expect(img.props.children.props.alt).toEqual('game-thumbnail');
  });

  it('number of questions is set with aria-label', () => {
    const questions = card.props().children[2];
    expect(questions.props['aria-label']).toBe('game-num-questions');
  });

  it('number of questions matches quiz.questions', () => {
    const questions = card.props().children[2];
    expect(questions.props.children[0]).toBe(quiz.questions);
  });

  it('total time of questions is set with aria-label', () => {
    const time = card.props().children[3];
    expect(time.props['aria-label']).toBe('game-time');
  });

  it('total time of questions matches quiz.total_time', () => {
    const time = card.props().children[3];
    expect(time.props.children[1]).toBe(quiz.total_time);
  });

  it('buttons of game card is set with aria-label', () => {
    const time = card.props().children[4];
    expect(time.props['aria-label']).toBe('game-buttons');
  });

  it('first button on the game card is the edit button', () => {
    const time = card.props().children[4];
    expect(time.props.children[0].type).toEqual(GameCardButton);
    expect(time.props.children[0].props.title).toBe('Edit Game')
  });

  it('second button on the game card is the delete button', () => {
    const time = card.props().children[4];
    expect(time.props.children[1].type).toEqual(GameCardButton);
    expect(time.props.children[1].props.title).toBe('Delete Game')
  });

  it('third button on the game card is the stopstart button', () => {
    const time = card.props().children[4];
    expect(time.props.children[2].type).toEqual(StopStartButton);
  });

  const quizNoImage = {
    title: 'Title 1',
    img: null,
    questions: 5,
    total_time: '01:20'
  }
  const cardNoImage = shallow(<GameCard
                    quiz={quizNoImage}
                    response={null}
                    setLink={noop}
                    setOpen={noop}
                    setOpenResults={noop}
                    setResponse={noop}
                  />);

  it('game thumbnail is default icon if not given', () => {
    const img = cardNoImage.props().children[1];
    expect(img.props.children.type).toEqual(FontAwesomeIcon);
  });
});
