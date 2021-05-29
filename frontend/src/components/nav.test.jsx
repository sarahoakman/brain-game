import { shallow } from 'enzyme';
import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Nav, { LogoutButton, DashboardButton, JoinGameButton } from './nav';
import Dashboard from '../pages/dashboard';
import Login from '../pages/login';
import Signup from '../pages/signup';

class LocalStorageMock {
  constructor () {
    this.store = {};
  }

  clear () {
    this.store = {};
  }

  getItem (key) {
    return this.store[key] || null;
  }

  setItem (key, value) {
    this.store[key] = String(value);
  }

  removeItem (key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

describe('LogoutButton', () => {
  const noop = () => {};

  it('triggers onClick event handler when pressed', () => {
    const onClick = jest.fn();
    shallow(<LogoutButton onClick={onClick} />).simulate('click');
    expect(onClick).toBeCalledTimes(1);
  });

  it('triggers tooltip when hovered over', async () => {
    const button = render(<LogoutButton onClick={noop}/>);
    fireEvent.mouseOver(button.getByLabelText('logout'))
    const tooltip = await button.findByText('Log Out');
    expect(tooltip).toBeInTheDocument();
  })

  it('no tooltip when not hovered over', async () => {
    const button = render(<LogoutButton onClick={noop}/>);
    fireEvent.mouseLeave(button.getByLabelText('logout'))
    const tooltip = await button.queryByText('Log Out')
    expect(tooltip).not.toBeInTheDocument();
  })
})

describe('DashboardButton', () => {
  const noop = () => {};

  it('triggers onClick event handler when pressed', () => {
    const onClick = jest.fn();
    shallow(<DashboardButton onClick={onClick} />).simulate('click');
    expect(onClick).toBeCalledTimes(1);
  });

  it('triggers tooltip when hovered over', async () => {
    const button = render(<DashboardButton onClick={noop}/>);
    fireEvent.mouseOver(button.getByLabelText('dashboard'))
    const tooltip = await button.findByText('Dashboard');
    expect(tooltip).toBeInTheDocument();
  })

  it('no tooltip when not hovered over', async () => {
    const button = render(<DashboardButton onClick={noop}/>);
    fireEvent.mouseLeave(button.getByLabelText('dashboard'))
    const tooltip = await button.queryByText('Dashboard')
    expect(tooltip).not.toBeInTheDocument();
  })
})

describe('JoinGameButton', () => {
  it('triggers onClick event handler when pressed', () => {
    const onClick = jest.fn();
    shallow(<JoinGameButton onClick={onClick} />).simulate('click');
    expect(onClick).toBeCalledTimes(1);
  });
})

// navigation should only be on pages that are specific to admin (e.g. dashboard, editing game, admin results pages)
// other pages use param hooks which is harder to test
describe('Navigation is visible and hidden depending on page', () => {
  it('nav on dashboard', () => {
    const dashboard = shallow(<Dashboard />);
    expect(dashboard.contains(<Nav />)).toBe(true);
  });
  it('nav on login', () => {
    const login = shallow(<Login />);
    expect(login.contains(<Nav />)).toBe(false);
  });
  it('nav on signup', () => {
    const signup = shallow(<Signup/>);
    expect(signup.contains(<Nav />)).toBe(false);
  });
})

describe('Navigation should be sticky', () => {
  it('nav has sticky class', () => {
    const nav = shallow(<Nav />);
    expect(nav.prop('position')).toBe('sticky')
  });
})
