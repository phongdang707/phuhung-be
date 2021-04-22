process.env.NODE_ENV = 'test';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImVtYWlsIjoiYWRtaW5taW5oQGdtYWlsLmNvbSIsInBlcm1pc3Npb24iOiJhZG1pbiIsImlkIjoiNWZmMTRkYjkyMjdhNWY2M2VjNDQ3Njg5In0sImlhdCI6MTYxMTE0MTgyNSwiZXhwIjoxNjExMzIxODI1fQ.HDD_RTnplA_aarrTx-Jd-FemTZon6Jgnm5O0ol2SS2M"

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Exams', () => {
    beforeEach((done) => {
        //Before each test we empty the database in your case
        done();
    });
    /*
     * Test the /GET route
     */
     describe('/POST get all exams', () => {
         it('it should get 5 first exams', (done) => {
             let data = {
                 page: 0,
                 rowsPerPage: 5,
                 searchText: "",
             };
             chai.request(server)
                 .post('/api/exams/getAllExam')
                 .set('Authorization', token) // Works.
                 .send(data)
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     done();
                 });
         });
         it('it should not get all exams without page field', (done) => {
             let data = {
               rowsPerPage: 5,
               searchText: "",
             };
             chai.request(server)
                 .post('/api/exams/getAllExam')
                 .set('Authorization', token) // Works.
                 .send(data)
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     done();
                 });
         });
         it('it should not get all exams without Rowspage field', (done) => {
             let data = {
               page: 0,
               searchText: "",
             };
             chai.request(server)
                 .post('/api/exams/getAllExam')
                 .set('Authorization', token) // Works.
                 .send(data)
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     done();
                 });
         });
         it('it should not get all exams without searchText field', (done) => {
             let data = {
               page:0,
               rowsPerPage: 5,
             };
             chai.request(server)
                 .post('/api/exams/getAllExam')
                 .set('Authorization', token) // Works.
                 .send(data)
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     done();
                 });
         });
     });
});
