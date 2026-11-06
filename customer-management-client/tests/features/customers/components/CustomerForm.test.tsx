import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomerForm } from '../../../../src/features/customers/components/CustomerForm';

const baseCustomer = {
  name: { firstName: 'Max', lastName: 'Mustermann' },
  email: 'max.mustermann@example.com',
  phoneNumber: undefined,
  birthDate: undefined,
  addresses: [],
};

test('shows error message if required input field is empty', async () => {
  const user = userEvent.setup();
  render(<CustomerForm onSubmit={vi.fn()} isPending={false} submitLabel="Speichern" />);

  const firstName = screen.getByLabelText(/Vorname/);
  await user.type(firstName, 'A');
  await user.clear(firstName);
  await user.tab();

  expect(await screen.findByText(/Vorname ist erforderlich/i)).toBeInTheDocument();
});

test('show pending state and deactivates button on submission', () => {
  render(<CustomerForm onSubmit={vi.fn()} isPending={true} submitLabel="Speichern" />);

  const button = screen.getByRole('button', { name: 'Wird gespeichert...' });
  expect(button).toBeDisabled();
});

test('adds an address and submits it with the customer', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(
    <CustomerForm
      defaultValues={baseCustomer}
      onSubmit={onSubmit}
      isPending={false}
      submitLabel="Speichern"
    />
  );

  await user.click(screen.getByRole('button', { name: 'Adresse hinzufügen' }));
  await user.type(screen.getByLabelText(/Straße/), 'Musterstraße');
  await user.type(screen.getByLabelText(/Hausnummer/), '1');
  await user.type(screen.getByLabelText(/Postleitzahl/), '12345');
  await user.type(screen.getByLabelText(/Ort/), 'Musterstadt');
  await user.click(screen.getByRole('button', { name: 'Speichern' }));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        addresses: [
          {
            street: 'Musterstraße',
            houseNumber: '1',
            postalCode: '12345',
            city: 'Musterstadt',
          },
        ],
      })
    )
  );
});

test('prefills and removes an existing address', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(
    <CustomerForm
      defaultValues={{
        ...baseCustomer,
        addresses: [
          {
            street: 'Musterstraße',
            houseNumber: '1',
            postalCode: '12345',
            city: 'Musterstadt',
          },
        ],
      }}
      onSubmit={onSubmit}
      isPending={false}
      submitLabel="Speichern"
    />
  );

  expect(screen.getByLabelText(/Straße/)).toHaveValue('Musterstraße');

  await user.click(screen.getByRole('button', { name: 'Entfernen' }));

  expect(screen.queryByLabelText(/Straße/)).not.toBeInTheDocument();
  expect(screen.getByText('Keine Adressen hinterlegt.')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Speichern' }));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ addresses: [] }))
  );
});
