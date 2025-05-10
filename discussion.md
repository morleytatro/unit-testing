# Unit Testing

## Unit vs. Integration/e2e

- tend to be easiest to write
- can take advantage of parallelization
- are well suited for "pure" (side effect-free functions)
- are connected to a "unit" of code

### Why?

- creates confidence in our systems
- can isolate edge cases and/or unexpected outcomes
- additional cases can be added over time as edges are found
- computers can generally run through these checks way faster than people

### Function Types

- "Pure" functions simply take in some input and return some output; they _don't_ otherwise interact with the outside world.
- "Effectful" functions produce observable changes to their/outside environments; while we can't generally write "pure" programs, it is possible to push impure code towards the app boundaries for better testability.
- You can think of functions as simply mapping from one thing to another. Depending on the type of function, your output may just be mapping an input to a produced side effect, eg. firing off a network request.

### Examples

Trivial, I know.

```ts
function add(num1: number, num2: number) {
  return num1 + num2;
}
```

```ts
// can also use global mode to skip these imports
import { describe, test, expect } from 'vitest';
import { add } from './math';

describe('add', () => {
  test('sums two numbers', () => {
    expect(add(1, 2)).toBe(3);
    // if asserting on an object (distinct from a memory perspective), you'd call .toEqual() instead
    expect([add(1, 2)]).toEqual([3]);
  });
});
```

### Pillars - Arrange, Act, and Assert

- Arrange: assemble the pieces in the correct structure for the test
- Act: call the function or perform the action(s)
- Assert: ensure the return value (or effect) matches the expected

### Do's

- keep tests focused on the outcome vs. implementation
- code can be refactored while maintaining proper functionality (this is a big benefit of having tests in place)
- keep a close eye on the app boundaries to avoid testing non-app behavior

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

### Don'ts

- Avoid testing outside systems/libraries
- Avoid testing the internal implementation, as this leads to fragility. Paraphrased, it's not so much about _how_ you get there, but _that_ you get there.

#### Examples

```ts
import { describe, expect, test } from 'vitest';
import { fetcher } from './fetch';

describe('fetcher', () => {
  test('fetches autocomplete addresses', async () => {
    const addresses = await fetcher.fetch('https://test.figure.com/address-lookup?partialAddress=1234+first+street');
    expect(addresses).toEqual(/* whatever the expected value is */);
  });
});
```

While we _are_ testing that our fetcher works, network tests are slow, fragile, and this is an example of testing behavior outside the app boundaries (in this case, how the backend responds). We can instead assert that we are creating the appropriate network request.

```tsx
import * as React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('sets up state', async () => {
    const initialStateVal = 'bob';

    const useState = vi.spyOn(React, 'useState').mockImplementation((val) => [val, () => {}]);

    render(<MyComponent initial={initialStateVal} />);
    
    expect(useState).toHaveBeenCalledWith(initialStateVal);
  });
});
```

Ultimately, we shouldn't care how the component is managing its state internally; that's the component's concern. Testing the implementation makes your code fragile since it's tightly coupled to the test. For instance, what if we decided to handle our state with `useReducer`? That would necessitate changing both the code _and_ the test. In contrast, if our test instead focused on the actual rendered UI and how interacting with it updated its appearance and/or produced the expected effects, we could safely absorb refactors of this sort.

### Property-Based Tests

- allow more flexibility with inputs/outputs
- can help ferret out edge cases connected to unknown inputs

#### Example

```ts
import { describe, expect, test } from 'vitest';
import { sort } from './sort';

describe('sort', () => {
  // note that this array varies on each run
  const array = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
  const sorted = sort(array);

  test('properly arranges array elements', () => {
    for (let i = 1; i < array.length - 1; i++) {
      expect(sorted[i - 1]).toBeLessThan(sorted[i]);
    }
  });
});
```