import { Test, TestingModule } from '@nestjs/testing';
import { ResidentController } from './resident.controller';
import { ResidentService } from './resident.service';

describe('ResidentController', () => {
  let controller: ResidentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResidentController],
      providers: [ResidentService],
    }).compile();

    controller = module.get<ResidentController>(ResidentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
