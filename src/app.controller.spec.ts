// test/app.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller'; // Correct import path
import { AppService } from '../src/app.service';   // Correct import path

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService; // Add this to mock the service

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService], // Provide the service
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService); // Get the service instance
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // Mock the service's getHello method
      jest.spyOn(appService, 'getHello').mockReturnValue('Hello World!');

      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});