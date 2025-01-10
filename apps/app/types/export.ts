import type { dataValidator } from '@/helper/validator';
import type { z } from 'zod';
export type ExportData = z.infer<typeof dataValidator>;
