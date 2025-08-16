import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ComposerService } from './composer.service';
import { CreateComposerDto } from './dto/create-composer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Timeout } from '@nestjs/schedule';

@ApiBearerAuth()
@ApiTags('Composer')
@Controller('composer')
export class ComposerController {
  constructor(private readonly composerService: ComposerService) {}




}
