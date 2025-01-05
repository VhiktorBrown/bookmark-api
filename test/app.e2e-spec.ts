import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    //mock a nest application
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);
    prisma.clearDb();
  });

  //after all initialization
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Sign up', () => {
      it.todo('Should sign up');
    });
    describe('Sign in', () => {

    });
  });

  describe('User', () => {
    describe('Get profile', () => {

    });
    describe('Edit profile', () => {

    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {

    });
    describe('Get bookmarks', () => {

    });
    describe('Get bookmark by id', () => {

    });
    describe('Edit bookmark', () => {

    });
    describe('Delete bookmark', () => {

    });
  });
});
