import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const RefreshDto = z.object({
  refreshToken: z.string().min(10),
});

export type RefreshDtoType = z.infer<typeof RefreshDto>;

export class RefreshDtoSwagger {
  @ApiProperty({ example: 'eyJhbGciOi...' })
  refreshToken: string;
}
