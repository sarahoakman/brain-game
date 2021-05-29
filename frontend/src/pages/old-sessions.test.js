import { shallow } from 'enzyme';
import * as React from 'react';

import { ViewResultsButton, SessionTable } from './old-sessions'

// testing the button
describe('ViewResultsButton', () => {
  const noop = () => {};

  it('triggers onClick event handler when pressed', () => {
    const onClick = jest.fn();
    shallow(<ViewResultsButton onClick={onClick} />).simulate('click');
    expect(onClick).toBeCalledTimes(1);
  });

  it('aria-label attribute is defined', () => {
    const button = shallow(<ViewResultsButton onClick={noop} />);
    expect(button.props()['aria-label']).toBeDefined();
  });
})

// testing the table
describe('SessionTable', () => {
  const listSessions = [
    '111111',
    '222222',
    '333333'
  ]
  const data = {
    sessions: listSessions,
    id: '1'
  }

  const cols = [
    'Past Session IDs',
    'See Game Results'
  ]

  const container = shallow(<SessionTable data={data} />);
  const table = container.find('#table');
  const thead = table.find('#tableHead');
  const headers = thead.find('.tableHeaders');
  const tbody = table.find('#tableBody');
  const rows = tbody.find('.tableRows');

  it('renders one table', () => {
    // There should be ONLY 1 table element
    expect(table).toHaveLength(1);
  });
  it('renders one table head in table', () => {
    // The table should have ONLY 1 thead element
    expect(thead).toHaveLength(1);
  });
  it('renders two table headers in table', () => {
    // The number of th tags should be equal to number of columns
    expect(headers).toHaveLength(2);
  });
  it('check table header text is correct', () => {
    // Each th tag text should equal to column header
    headers.forEach((th, idx) => {
      expect(th.text()).toEqual(cols[idx]);
    });
  });
  it('renders one table body in table', () => {
    // The table should have ONLY 1 tbody tag
    expect(tbody).toHaveLength(1);
  });
  it('renders rows same as number of session ids', () => {
    // tbody tag should have the same number of tr tags as data rows
    expect(rows).toHaveLength(listSessions.length);
  });
  it('check table cell text matches session ids', () => {
    // Loop through each row and check the content
    rows.forEach((tr, rowIndex) => {
      const cells = tr.find('.tableCells');
      expect(cells).toHaveLength(cols.length);
      expect(cells.at(0).text()).toEqual(listSessions[rowIndex]);
      const button = cells.find('ViewResultsButton');
      expect(button).toHaveLength(1);
    });
  });
  it('aria-label attribute is defined', () => {
    expect(table.props()['aria-label']).toBeDefined();
  });
})
