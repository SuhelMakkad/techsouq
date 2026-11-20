export const SLOT_MINUTE_FIELDS = {
  duration: { label: 'Appointment length', min: 1, max: 1439 },
  cleanup: { label: 'Cleanup buffer', min: 0, max: 1439 },
  interval: { label: 'Start interval', min: 5, max: 120 },
} as const;

export const BOOKING_SLOT_EXAMPLE = {
  opens: '09:00',
  closes: '12:30',
  duration: '40',
  cleanup: '10',
  interval: '15',
  staffStart: '11:15',
  staffEnd: '11:30',
  roomStart: '09:50',
  roomEnd: '10:20',
};

export type BookingSlotInputs = typeof BOOKING_SLOT_EXAMPLE;
type BookingSlotField = keyof BookingSlotInputs;

type TimeBlock = {
  start: number;
  end: number;
};

type BookingSlot = {
  start: number;
  appointmentEnd: number;
  release: number;
};

export class BookingSlotInputError extends Error {
  readonly field: BookingSlotField;

  constructor(field: BookingSlotField, message: string) {
    super(message);

    this.field = field;
  }
}

function parseTime(value: string, field: BookingSlotField) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    throw new BookingSlotInputError(field, 'Enter a time from 00:00 to 23:59.');
  }

  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function parseMinutes(value: string, field: keyof typeof SLOT_MINUTE_FIELDS) {
  const { min, max } = SLOT_MINUTE_FIELDS[field];
  const minutes = Number(value);

  if (!/^\d+$/.test(value) || minutes < min || minutes > max) {
    throw new BookingSlotInputError(field, `Enter a whole number from ${min} to ${max}.`);
  }

  return minutes;
}

function readBusyBlock(inputs: BookingSlotInputs, resource: 'staff' | 'room'): TimeBlock | null {
  const startField = `${resource}Start` as const;
  const endField = `${resource}End` as const;

  if (!inputs[startField] && !inputs[endField]) return null;

  const start = parseTime(inputs[startField], startField);
  const end = parseTime(inputs[endField], endField);

  if (end <= start) {
    throw new BookingSlotInputError(endField, 'Enter an end time after the start on the same day.');
  }

  return { start, end };
}

export function calculateBookingSlots(inputs: BookingSlotInputs): BookingSlot[] {
  const opens = parseTime(inputs.opens, 'opens');
  const closes = parseTime(inputs.closes, 'closes');

  if (closes <= opens) {
    throw new BookingSlotInputError(
      'closes',
      'Enter a closing time after opening on the same day.',
    );
  }

  const duration = parseMinutes(inputs.duration, 'duration');
  const cleanup = parseMinutes(inputs.cleanup, 'cleanup');
  const interval = parseMinutes(inputs.interval, 'interval');

  const busyBlocks = [readBusyBlock(inputs, 'staff'), readBusyBlock(inputs, 'room')];
  const occupiedMinutes = duration + cleanup;
  const slots: BookingSlot[] = [];

  for (let start = opens; start + occupiedMinutes <= closes; start += interval) {
    const release = start + occupiedMinutes;
    const conflicts = busyBlocks.some(
      (block) => block && start < block.end && release > block.start,
    );

    if (!conflicts) slots.push({ start, appointmentEnd: start + duration, release });
  }

  return slots;
}

export function formatBookingTime(minutes: number) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  const minute = String(minutes % 60).padStart(2, '0');

  return `${hours}:${minute}`;
}

export function formatBookingSlotCount(count: number) {
  return `${count} eligible ${count === 1 ? 'start' : 'starts'}.`;
}
