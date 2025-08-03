import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginDtoType = z.infer<typeof LoginDto>;

export class LoginDtoSwagger {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  password: string;
}