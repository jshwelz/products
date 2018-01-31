const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Product } = require('../models/product-model');

const products = [{
    _id: new ObjectID(),
    description: 'First test product'

}, {
    _id: new ObjectID(),
    description: 'Second test product'

}];

beforeEach((done) => {
    Product.remove({}).then(() => {
        return Product.insertMany(products);
    }).then(() => done());
});

describe('POST /products', () => {
    it('should create a new product', (done) => {
        var description = 'Test product description';

        request(app)
            .post('/api/products/')
            .send({ description })
            .expect(200)
            .expect((res) => {
                expect(res.body.description).toBe(description);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Product.find({ description }).then((products) => {
                    expect(products.length).toBe(1);
                    expect(products[0].description).toBe(description);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create product with invalid body data', (done) => {
        request(app)
            .post('/api/products/')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Product.find().then((products) => {
                    expect(products.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /products', () => {
    it('should get all products', (done) => {
        request(app)
            .get('/api/products/')
            .expect(200)
            .expect((res) => {
                expect(res.body.products.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /products/:id', () => {
    it('should return product doc', (done) => {
        request(app)
            .get(`/api/products/${products[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.product.text).toBe(products[0].text);
            })
            .end(done);
    });

    it('should return 404 if product not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .get(`/api/products/${hexId}`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /api/products/:id', () => {
    it('should remove a product', (done) => {
        var hexId = products[1]._id.toHexString();
        request(app)
            .delete(`/api/products/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.prod._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Product.findById(hexId).then((prod) => {
                    expect(prod).toBeFalsy();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if product not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/api/products/${hexId}`)
            .expect(404)
            .end(done);
    });
});
