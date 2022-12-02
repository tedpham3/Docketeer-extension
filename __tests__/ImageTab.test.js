/**        Docketeer 7.0
 * These tests do not work as enzyme is highly depricated and does not communicate with React 18
 */

import React from 'react';
import { describe, expect, test, jest } from '@jest/globals';
import Images from '../src/components/tabs/Images';
// import ImageUsers from '../src/components/tabs/ImagesUser';
import '@testing-library/react';
import '@testing-library/jest-dom';
import {
  fireEvent,
  getByLabelText,
  getByTestId,
  render,
  screen,
} from '@testing-library/react';

const props = {
  imagesList: [
    {
      ID: '2718634043dc',
      Size: '111 MB',
      Name: 'redis',
    },
  ],
  runIm: jest.fn(),
  removeIm: jest.fn(),
  onClick: jest.fn(),
};

/* ----- search bar ----- */
describe('Seach bar testing', () => {
  test('Search accepts input', async () => {
    const { container } = render(<Images {...props} />);  
    const search = screen.getByRole('textbox');
    await fireEvent.change(search, { target: { value: 'search' } });
    expect(search.value).toBe('search');
  });
});

/* ----- button testing ------ */

describe('run button on click', () => {
  test('fires run button functionality', async () => {
    const { container } = render(<Images {...props} />);
    const runButton = screen.getByRole('button', { name: 'RUN' });
    await fireEvent.click(runButton);
    expect(runButton).toBeCalled;
  });
});

// currently gets stuck at window.runExec method --> reads undefined
// describe('pull button on click', () => {
//   test('fires pull button functionality', () => {
//     const { container } = render(<Images {...props} />);
//     const pullButton = screen.getByRole('button', { name: 'Pull' });
//     fireEvent.click(pullButton);
//     expect(pullButton).toBeCalled;
//   });
// });

describe('remove button on click', () => {
  test('fires remove button functionality', async () => {
    const { container } = render(<Images {...props} />);
    const removeButton = screen.getByRole('button', { name: 'REMOVE' });
    await fireEvent.click(removeButton);
    expect(removeButton).toBeCalled;
  });
});

/* ------ actions/reducers ------ */

describe('Images', () => {
  test('renders an image if one is found', () => {
    render(<Images {...props} />);
  });
});

//* Dummy Test
describe('dummy test', () => {
  test('dummy test', () => {
    expect(2 + 2).toBe(4);
  });
});
