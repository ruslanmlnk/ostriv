import * as migration_20251218_193657_add_order_payment_fields from './20251218_193657_add_order_payment_fields';

export const migrations = [
  {
    up: migration_20251218_193657_add_order_payment_fields.up,
    down: migration_20251218_193657_add_order_payment_fields.down,
    name: '20251218_193657_add_order_payment_fields'
  },
];
