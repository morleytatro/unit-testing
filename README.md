# Unit Testing

This repo is a discussion/learning tool for playing with unit tests. First, read through the [discussion](discussion.md). When you're ready to begin testing the form, do the following:
- install the dependencies: `pnpm i` or `npm i`
- run the tests in watch mode: `npm run test`
- [write the tests](src/components/Form.spec.tsx)!

## Helpful Links

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [user-event](https://testing-library.com/docs/user-event/intro/)
- [Appearance and Disappearance](https://testing-library.com/docs/guide-disappearance)
- [Vitest docs](https://vitest.dev/guide/)

## Example

```tsx
import { describe, expect, test } from 'vitest';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from './todo-list';

describe('TodoList', () => {
  test('can add an item', async () => {
    render(<TodoList />);

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'Crush testing!');
    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Crush testing!')).toBeInTheDocument();
  });
});
```