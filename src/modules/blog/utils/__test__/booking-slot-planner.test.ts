import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BOOKING_SLOT_EXAMPLE,
  BookingSlotInputError,
  calculateBookingSlots,
  formatBookingTime,
  type BookingSlotInputs,
} from '../booking-slot-planner.ts';

const blankBlocks = {
  staffStart: '',
  staffEnd: '',
  roomStart: '',
  roomEnd: '',
};

const check = (overrides: Partial<BookingSlotInputs> = {}) =>
  calculateBookingSlots({ ...BOOKING_SLOT_EXAMPLE, ...overrides });

test('calculates the worked example with both resources held during cleanup', () => {
  const slots = check();

  assert.deepEqual(slots, [
    { start: 540, appointmentEnd: 580, release: 590 },
    { start: 690, appointmentEnd: 730, release: 740 },
  ]);
});

test('changes the start grid without altering the booking or cleanup duration', () => {
  const slots = check({ interval: '10' });
  const times = slots.map(({ start, appointmentEnd, release }) =>
    [start, appointmentEnd, release].map(formatBookingTime),
  );

  assert.deepEqual(times, [
    ['09:00', '09:40', '09:50'],
    ['10:20', '11:00', '11:10'],
    ['11:30', '12:10', '12:20'],
    ['11:40', '12:20', '12:30'],
  ]);
});

test('allows adjacency at both sides of a busy block and at closing', () => {
  const slots = check({
    ...blankBlocks,
    opens: '00:00',
    closes: '00:45',
    duration: '10',
    cleanup: '5',
    roomStart: '00:15',
    roomEnd: '00:30',
  });

  assert.deepEqual(slots, [
    { start: 0, appointmentEnd: 10, release: 15 },
    { start: 30, appointmentEnd: 40, release: 45 },
  ]);
});

test('starts the interval at opening and accepts zero cleanup and blank busy blocks', () => {
  const slots = check({
    ...blankBlocks,
    opens: '09:07',
    closes: '09:27',
    duration: '5',
    cleanup: '0',
    interval: '10',
  });

  assert.deepEqual(slots, [
    { start: 547, appointmentEnd: 552, release: 552 },
    { start: 557, appointmentEnd: 562, release: 562 },
  ]);
});

test('accepts the parameter limits and distinguishes a valid empty result', () => {
  assert.deepEqual(
    check({ ...blankBlocks, opens: '00:00', closes: '23:59', duration: '1439', cleanup: '0' }),
    [{ start: 0, appointmentEnd: 1439, release: 1439 }],
  );

  assert.deepEqual(check({ duration: '220' }), []);
  assert.deepEqual(check({ cleanup: '1439' }), []);

  const slots = check({ ...blankBlocks, duration: '1', cleanup: '0', interval: '120' });
  assert.deepEqual(
    slots.map(({ start }) => formatBookingTime(start)),
    ['09:00', '11:00'],
  );
});

test('rejects missing or malformed times, overnight windows, and incomplete busy blocks', () => {
  const invalid: [Partial<BookingSlotInputs>, keyof BookingSlotInputs][] = [
    [{ opens: '' }, 'opens'],
    [{ closes: '24:00' }, 'closes'],
    [{ opens: '9:00' }, 'opens'],
    [{ closes: '09:00' }, 'closes'],
    [{ opens: '23:00', closes: '01:00' }, 'closes'],
    [{ staffStart: '' }, 'staffStart'],
    [{ roomEnd: '' }, 'roomEnd'],
    [{ roomEnd: '09:49' }, 'roomEnd'],
    [{ staffEnd: '11:15' }, 'staffEnd'],
  ];

  for (const [overrides, field] of invalid) {
    assert.throws(
      () => check(overrides),
      (cause) => cause instanceof BookingSlotInputError && cause.field === field,
    );
  }
});

test('rejects non-whole, non-finite, and out-of-range minute inputs', () => {
  const invalid: [keyof BookingSlotInputs, string][] = [
    ['duration', '0'],
    ['duration', '1440'],
    ['duration', 'Infinity'],
    ['cleanup', ''],
    ['cleanup', '-1'],
    ['cleanup', '1.5'],
    ['cleanup', '1e1'],
    ['interval', '4'],
    ['interval', '121'],
  ];

  for (const [field, value] of invalid) {
    assert.throws(
      () => check({ [field]: value }),
      (cause) => cause instanceof BookingSlotInputError && cause.field === field,
    );
  }
});
