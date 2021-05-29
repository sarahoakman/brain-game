import { shallow } from 'enzyme';
import * as React from 'react';
import AddButton, { NewGameButton, NewGameModal, NameInput, GameInput, ModalButton } from './add-button'
import { render, fireEvent } from '@testing-library/react';

// tests new game button that appears on the dashboard
describe('NewGameButton', () => {
  const noop = () => {};

  it('triggers onClick event handler when pressed', () => {
    const onClick = jest.fn();
    shallow(<NewGameButton onClick={onClick} open={false} />).simulate('click');
    expect(onClick).toBeCalledTimes(1);
  });

  it('aria-label attribute is defined', () => {
    const button = shallow(<NewGameButton onClick={noop} open={false} />);
    expect(button.props()['aria-label']).toBeDefined();
  });

  it('sets aria-modal to false when closed', () => {
    const button = shallow(<NewGameButton onClick={noop} open={false} />);
    expect(button.props()['aria-modal']).toBe(false);
  });

  it('sets aria-modal to true when open', () => {
    const button = shallow(<NewGameButton onClick={noop} open={true} />);
    expect(button.props()['aria-modal']).toBe(true);
  });

  it('triggers tooltip when hovered over', async () => {
    const button = render(<NewGameButton onClick={noop} open={false}/>);
    fireEvent.mouseOver(button.getByLabelText('add-game-button'))
    const tooltip = await button.findByText('Add Game');
    expect(tooltip).toBeInTheDocument();
  })

  it('no tooltip when not hovered over', async () => {
    const button = render(<NewGameButton onClick={noop} open={false}/>);
    fireEvent.mouseLeave(button.getByLabelText('add-game-button'))
    const tooltip = await button.queryByText('Add Game')
    expect(tooltip).not.toBeInTheDocument();
  })
})

// tests the modal that appears after clicking addButton
describe('NewGameModal', () => {
  const data = {
    open: true,
    setOpen: jest.fn(),
    setResponse: jest.fn(),
    title: '',
    setTitle: jest.fn(),
    error: false,
    setError: jest.fn(),
    game: '',
    setGame: jest.fn(),
  }

  const noop = () => {};

  it('displays the game name textfield when modal is open', () => {
    const modal = shallow(<NewGameModal onClick={noop} data={data}/>);
    expect(modal.find('NameInput').exists());
  });

  it('displays the game upload textfield when modal is open', () => {
    const modal = shallow(<NewGameModal onClick={noop} data={data}/>);
    expect(modal.find('GameInput').exists());
  });

  it('displays the game buttons textfield when modal is open', () => {
    const modal = shallow(<NewGameModal onClick={noop} data={data}/>);
    expect(modal.find('ModalButton').length).toBe(2);
  });
})

// tests the game name input that appears on the modal
describe('NameInput', () => {
  const noop = () => {};

  it('triggers onChange event handler with name input', () => {
    const onChange = jest.fn();
    const name = shallow(<NameInput onChange={onChange} title='input'/>);
    name.simulate('change', 'name');
    expect(onChange).toBeCalledWith('name');
  });
  // error checking use cases
  it('set non-empty input and check no errors', () => {
    const name = shallow(<NameInput onChange={noop} title='input'/>);
    expect(name.props().error).toBe(false);
  });

  it('set empty input and check for errors', () => {
    const name = shallow(<NameInput onChange={noop} title=''/>);
    expect(name.props().error).toBe(true);
    expect(name.props().helperText).toBe('Game name is empty');
  });
})

// tests the upload game by file that appears on the modal
describe('GameInput', () => {
  const noop = () => {};

  it('triggers onClick event handler when clicked', () => {
    const onChange = jest.fn();
    const game = shallow(<GameInput onChange={onChange} game=''/>);
    game.find('input').simulate('change', 'file');
    expect(onChange).toBeCalledWith('file');
  });

  // game file input use cases
  it('empty helper text to show no file name to upload', () => {
    const buttonText = 'Upload Game'
    const game = shallow(<GameInput onChange={noop} game=''/>);
    expect(game.text()).toBe(buttonText + '')
  });

  it('set helper text to show file name to upload', () => {
    const buttonText = 'Upload Game'
    const game = shallow(<GameInput onClick={noop} game='file.json'/>);
    expect(game.text()).toBe(buttonText + 'file.json')
  });
})

// tests the buttons that appear on the modal
describe('ModalButton', () => {
  const noop = () => {};

  it('triggers onClick event handler when clicked', () => {
    const onClick = jest.fn();
    const button = shallow(<ModalButton onClick={onClick} text='text' color='color'/>);
    button.simulate('click');
    expect(onClick).toBeCalledTimes(1);
  });

  it('buttons contain text and color', () => {
    const button = shallow(<ModalButton onClick={noop} text='text' color='color'/>);
    expect(button.text()).toBe('text');
    expect(button.props().color).toBe('color');
  });
})

// tests the add game component as a whole
describe('AddButton', () => {
  const defaultData = {
    open: false,
    setOpen: jest.fn(),
    setResponse: jest.fn(),
  }
  const openData = {
    open: true,
    setOpen: jest.fn(),
    setResponse: jest.fn(),
  }

  it('components contains add button and add modal', () => {
    const button = shallow(<AddButton data={defaultData}/>);
    expect(button.props().children.length).toBe(2);
    expect(button.props().children[0].key).toBe('new-game-button');
    expect(button.props().children[1].key).toBe('new-game-modal');
  });

  it('modal is closed by default', () => {
    const button = shallow(<AddButton data={defaultData}/>);
    expect(button.props().children[0].props.open).toBe(false);
    expect(button.props().children[1].props.data.open).toBe(false);
  });

  it('modal is opened', () => {
    const button = shallow(<AddButton data={openData}/>);
    expect(button.props().children[0].props.open).toBe(true);
    expect(button.props().children[1].props.data.open).toBe(true);
  });
})
