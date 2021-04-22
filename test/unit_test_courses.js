process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Courses', () => {
    beforeEach((done) => {
        //Before each test we empty the database in your case
        done();
    });
    /*
     * Test the /GET route
     */
     describe('/POST get all course', () => {
         it('it should get 5 first course', (done) => {
             let data = {
                 page: 0,
                 rowsPerPage: 5,
                 searchText: "",
             };
             chai.request(server)
                 .post('/api/courses/getAllCourse')
                 .send(data)
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     done();
                 });
         });
         it('it should not get all course without page field', (done) => {
             let data = {
               rowsPerPage: 5,
               searchText: "",
             };
             chai.request(server)
                 .post('/api/courses/getAllCourse')
                 .send(data)
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     done();
                 });
         });
         it('it should not get all course without Rowspage field', (done) => {
             let data = {
               page: 0,
               searchText: "",
             };
             chai.request(server)
                 .post('/api/courses/getAllCourse')
                 .send(data)
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     done();
                 });
         });
         it('it should not get all course without searchText field', (done) => {
             let data = {
               page:0,
               rowsPerPage: 5,
             };
             chai.request(server)
                 .post('/api/courses/getAllCourse')
                 .send(data)
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     done();
                 });
         });
     });
});
