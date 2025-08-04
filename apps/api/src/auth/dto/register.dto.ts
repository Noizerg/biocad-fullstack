import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const RegisterDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type RegisterDtoType = z.infer<typeof RegisterDto>;

export class RegisterDtoSwagger {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  password: string;
}
