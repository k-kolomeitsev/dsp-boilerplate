// @dsp obj-9b3aeda8
import { OnModuleInit } from '@nestjs/common';
import { validateSync } from 'class-validator';

// @dsp func-d2cabb7d
export class ConfigFragment implements OnModuleInit {
  public onModuleInit(): void {
    const errors = validateSync(this);

    if (errors.length > 0) {
      const errorList = errors.map(String).join('\n');

      throw new Error(`Failed to validate settings: \n${errorList}`);
    }
  }
}
