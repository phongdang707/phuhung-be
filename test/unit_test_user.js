process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Student', () => {
    beforeEach((done) => {
        //Before each test we empty the database in your case
        done();
    });
    /*
     * Test the /GET route
     */
     describe('/POST get all student', () => {
         it('it should get 5 first student', (done) => {
             let data = {
                 page: 0,
                 rowsPerPage: 5,
                 searchText: "",
             };
             chai.request(server)
                 .post('/api/students/getStudent')
                 .send(data)
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     done();
                 });
         });
        
     });
});
