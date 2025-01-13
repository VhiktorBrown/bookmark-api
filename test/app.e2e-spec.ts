import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum'; 
import { AuthDto } from '../src/auth/dto/auth.dto';
import { EditUserDto } from 'src/user/dto';
import { BookmarkDto } from 'src/bookmark/dto';

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

  //AUTHENTICATION TESTS
  describe('Auth', () => {
    //declare DTO to be used
    let dto: AuthDto = {
      email: 'ambitious@gmail.com',
      password: 'password',
    };

    //also declare an incorrect DTO to test for wrong input
    let wrongDto: AuthDto = {
      email: 'ambitious@gmail',
      password: 'password',
    };

    //TEST CASES FOR SIGN UP
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

      //execute for incorrect email format
      it('Should throw error if email field is not an email', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: wrongDto.email,
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


    //TEST CASES FOR SIGN IN
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

      //execute for incorrect email format
      it('Should throw error if email field is not an email', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: wrongDto.email,
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

  //USER RELATED TESTS
  describe('User', () => {
    //test case to get user's profile
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

    //test case to edit user's profile
    describe('Edit profile', () => {
      const dto: EditUserDto = {
        firstName: "Ambitious",
        lastName: "Victor",
      }
      it('Should edit profile of user', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{user_access_token}'
          })
          .patch('/users')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .inspect() 
      })
    });
  });

  //BOOKMARK RELATED TESTS
  describe('Bookmarks', () => {
    const dto: BookmarkDto = {
      title: "New bookmark",
      description: "This is my own bookmark. It's the repository of my github profile",
      link: 'https://github.com/VhiktorBrown'
    }

    //test case to create a new bookmark
    describe('Create bookmark', () => {
      it('Should create a new bookmark', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{user_access_token}'
          })
          .post('/bookmarks')
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmark_id', 'id')
          .expectBodyContains(dto.title)
          .inspect() 
      })
    });
    
    //test case to fetch all bookmarks
    describe('Get bookmarks', () => {
      it('Should fetch all bookmarks for a single user', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{user_access_token}'
          })
          .get('/bookmarks')
          .expectStatus(200)
          .inspect() 
      })
    });

    //test case to get a single bookmark by id
    describe('Get bookmark by id', () => {
      it('Should fetch a single bookmark for a single user', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{user_access_token}'
          })
          .get('/bookmarks/$S{bookmark_id}')
          .expectStatus(200)
          .inspect() 
      })
    });

    //test case to edit a bookmark
    describe('Edit bookmark', () => {
      const editDto: BookmarkDto = {
        title: "Edited bookmark",
        description: "This is my edited bookmark. It's the repository of my github profile",
        link: 'https://github.com/VhiktorBrown/me'
      }
      it('Should edit bookmark', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{user_access_token}'
          })
          .patch('/bookmarks/$S{bookmark_id}')
          .withBody(editDto)
          .expectStatus(200)
          .inspect() 
      })
    });

    //test case to delete a bookmark
    describe('Delete bookmark', () => {
      it('Should delete bookmark', () => {
        return pactum
          .spec()
          .withHeaders({
            Authorization: 'Bearer $S{user_access_token}'
          })
          .delete('/bookmarks/$S{bookmark_id}')
          .expectStatus(200)
          .inspect() 
      })
    });
  });
});
