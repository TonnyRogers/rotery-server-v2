import * as bcrypt from 'bcrypt';

import { dayjsPlugins } from '@/providers/dayjs-config';

export async function hashRefresh() {
  const refreshToken = await bcrypt.hash(
    `${dayjsPlugins().format('DDD-MM-YYYY')}${Math.SQRT2}`,
    8,
  );

  return refreshToken;
}
