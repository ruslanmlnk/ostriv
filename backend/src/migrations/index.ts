import * as migration_20251218_193657_add_order_payment_fields from './20251218_193657_add_order_payment_fields';
import * as migration_20251221_add_contact_requests_lock from './20251221_add_contact_requests_lock';

export const migrations = [
  {
    up: migration_20251218_193657_add_order_payment_fields.up,
    down: migration_20251218_193657_add_order_payment_fields.down,
    name: '20251218_193657_add_order_payment_fields'
  },
  {
    up: migration_20251221_add_contact_requests_lock.up,
    down: migration_20251221_add_contact_requests_lock.down,
    name: '20251221_add_contact_requests_lock'
  },
];
