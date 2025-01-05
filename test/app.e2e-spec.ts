import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum'; 
import { AuthDto } from '../src/auth/dto/auth.dto';

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

    app.listen(3333);

    prisma = app.get(PrismaService);
    prisma.clearDb();

    //set base URL in pactum
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  //after all initialization
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    //declare DTO to be used
    let dto: AuthDto = {
      email: 'ambitious@gmail.com',
      password: 'password',
    };

    //Test cases for SIGN UP
    describe('Sign up', () => {
      //execute for empty email
      it('Should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
      });

      //execute for empty password
      it('Should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
      });

      //execute test function for No body
      it('Should throw error if there is no body', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400)
      });

      //execute the test function for successful sign up.
      it('Should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
      });
    });


    //test cases for SIGN IN
    describe('Sign in', () => {

      //execute for empty email
      it('Should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
      });

      //execute for empty password
      it('Should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
      });

      //execute test function for No body
      it('Should throw error if there is no body', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400)
      });

      //execute the test function for successful sign in.
      it('Should sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('user_access_token', 'access_token')
      });
    });
  });

  describe('User', () => {
    describe('Get my profile', () => {
      it('Should get the current user', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{user_access_token}'
          })
          .get('/users/myProfile')
          .expectStatus(200)
          .inspect()
      })

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
