import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';
import { Form } from './Form';
import { Input } from './Input';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
});

describe('Form', () => {
  test('handless default values', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <Form defaultValues={{ name: 'John Doe' }} onSubmit={onSubmit} schema={schema}>
        <Input name="name" label="Name" />
        <button>Submit</button>
      </Form>
    );

    await user.click(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalledWith({ name: 'John Doe' }, expect.objectContaining({}));
  });

  test('calls onSubmit/onInvalid as expected', async () => {
    const defaultValues = { name: '' };
    const onSubmit = vi.fn();
    const onInvalid = vi.fn();
    const user = userEvent.setup();

    render(
      <Form
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        schema={schema}
        onInvalid={onInvalid}
      >
        <Input name="name" label="Name" />
        <button>Submit</button>
      </Form>
    );

    await user.click(screen.getByRole('button'));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onInvalid).toHaveBeenCalled();
    expect(screen.getByText('Name is required')).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'John Doe');
    await user.click(screen.getByRole('button'));

    expect(onSubmit).toHaveBeenCalledWith({ name: 'John Doe' }, expect.objectContaining({}));
  });

  test('resets when prompted', async () => {
    const defaultValues = { name: 'John Doe' };
    const user = userEvent.setup();

    render(
      <Form defaultValues={defaultValues} onSubmit={(_, reset) => reset()} schema={schema}>
        <Input name="name" label="Name" />
        <button>Submit</button>
      </Form>
    );

    await user.click(screen.getByRole('button'));
    expect(screen.getByLabelText('Name')).toHaveValue('');
  });
});
