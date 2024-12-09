const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const admin = require("firebase-admin");  // Mock this
const index = require("../index"); // Your app file


chai.use(chaiHttp);
const expect = chai.expect;

const { app, server } = require("../index");


// Mock Firebase Admin SDK (Improved):

const mockDb = {
  collection: sinon.stub().returns({
    doc: sinon.stub().returns({
      set: sinon.stub().resolves(),
      get: sinon.stub().resolves({ exists: true, data: sinon.stub().returns({}) }),
      update: sinon.stub().resolves(),
    }),
    get: sinon.stub().resolves({ empty: false, docs: [] }), // Mock empty result
    where: sinon.stub().returns({
      get: sinon.stub().resolves({ empty: false, docs: [] }),
    }),
  }),
};


// Mock other firebase modules. You might not need all of them in all tests.
const mockStorage = {
  bucket: sinon.stub().returns({
    file: sinon.stub().returns({
      createWriteStream: sinon.stub().returns({
        on: sinon.stub(),
        end: sinon.stub(),
      }),
    }),
  }),
};
const mockFieldValue = { serverTimestamp: sinon.stub().returns('test_timestamp') }; // Mock it here

const mockAuth = {
  signInWithEmailAndPassword: sinon.stub(),
};



const firestoreStub = sinon.stub().returns(mockDb);
const initializeAppStub = sinon.stub().returns({
  firestore: firestoreStub,
  storage: sinon.stub().returns(mockStorage), // Mock Storage
});


Object.defineProperty(admin, 'firestore', {
    get: () => { return firestoreStub }

});


sinon.stub(admin, "initializeApp").callsFake(initializeAppStub);
sinon.stub(admin, 'auth').returns(mockAuth);

Object.defineProperty(admin.firestore, 'FieldValue', {
  get: () => mockFieldValue
});


let testApp = null; // Store your Express app instance



describe("API Tests", () => {

    before(() => {
        testApp = app; // Assuming your `server.js` exports the app instance. If not adjust as needed.

    });

    mockDb.collection.withArgs('feedback').returns({  // Mock specific to 'feedback'
      add: sinon.stub().resolves({ id: 'testFeedbackId' }), // You can chain the stubs
  });
  mockDb.collection.callThrough();



  it("should successfully place an order (POST /api/bagelsOrder)", (done) => {
    const orderData = {
      userId: "uJFsyS7QGfUTlqfgaHNHW9uJeUm1",
      items: {  // Items as a map
          "Iced Cappuccino": 1,
          "Zebra": 1
      },
      status: "New",
      orderPickupTime: "Now",
      restaurant: "Bon Bon's Coffee"
  };
  try{
    chai
      .request(testApp)
      .post("/api/bagelsOrder")
      .send(orderData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal("Order placed successfully");
        done(); // Important: Call done() to signal test completion
      });
    }
    catch (error) {
      console.error('Error placing order:', error); // Make sure this line is present!
      res.status(500).json({ error: 'Failed to place order' }); 
    }

  });
  
  it("should submit feedback (POST /api/submitFeedback)", (done) => {
    const feedbackData = {
        feedback: "Great service!",
        userId: "testUserId",
        restaurantId: "testRestaurantId"
    };

    // mockDb.collection('feedback').add.resolves({ id: 'testFeedbackId' }); // Mock the Firestore add() response


    chai.request(testApp)
        .post("/api/submitFeedback")
        .send(feedbackData)
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            expect(res.body.message).to.equal("Feedback submitted successfully");
            // expect(res.body.feedbackId).to.equal("testFeedbackId"); // Check the returned ID
            done();
        });
});

it("should update a bagels order (PUT /api/bagelsOrder/:orderId)", (done) => {
  const orderId = "1733626553125-0233"; // Use a known order ID
  const updatedStatus = "Cancelled";

  // Mock the Firestore get() and update() methods
  // const mockDoc = {
  //   exists: true,
  //   update: sinon.stub().resolves(),  // Resolve the update call
  //   get: sinon.stub().resolves({ exists: true, data: () => ({ status: 'New', /* other mock order data */ }) }),
  // };


  // mockDb.collection('bagelsOrder').doc.withArgs(orderId).returns(mockDoc); // Stub for specific doc

  chai.request(testApp)
      .put(`/api/bagelsOrder/${orderId}`)
      .send({ status: updatedStatus })
      .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('Order status updated successfully');
          // expect(mockDoc.update.calledOnce).to.be.true;          // Check if update was called
          // expect(mockDoc.update.calledWith({ status: updatedStatus })).to.be.true; // Check if called with correct data
          done();
      });
});

it("should handle errors when updating a bagels order (PUT /api/bagelsOrder/:orderId)", (done) => {
  const orderId = "nonExistentOrderId";  // ID of an order that doesn't exist
  const updatedStatus = "Ready";



  chai.request(testApp)
      .put(`/api/bagelsOrder/${orderId}`)
      .send({ status: updatedStatus })
      .end((err, res) => {

        if (err) {
            console.error("Network error in test:", err); // Log network errors if any
            done(err); // If there was a network error, fail the test and return.
            return;
        }
          expect(res).to.have.status(404); // Or 500 depending on your error handling
          expect(res.body.error).to.equal('Order not found'); // Check for the specific error message
          done();
      });
});

it("should successfully request a new dish (POST /api/requestNewDish)", (done) => {
  const newDishData = {
      dishName: "Spicy Tofu Scramble",
      userId: "testUserId123"
  };

  // Mock Firestore's add method for the 'einsteinBagels' collection
  const mockAddResult = { id: 'mockRequestId' }; // Mock document reference
  mockDb.collection.withArgs('einsteinBagels').returns({
    add: sinon.stub().resolves(mockAddResult),
  });

  chai.request(testApp)
      .post("/api/requestNewDish")
      .send(newDishData)
      .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);  // Expect 201 Created
          expect(res.body.message).to.equal("Dish request submitted successfully");
          // expect(res.body.requestId).to.equal(mockAddResult.id); // Verify the returned ID
          done();
      });
});

it("should handle errors when requesting a new dish (POST /api/requestNewDish)", (done) => {
const invalidDishData = {  // Missing dishName
    userId: "testUserId123"
};

mockDb.collection.withArgs('einsteinBagels').returns({
    add: sinon.stub().rejects(new Error("Firestore error")), // Mock an error
});


chai.request(testApp)
    .post("/api/requestNewDish")
    .send(invalidDishData)
    .end((err, res) => {
      if (err) { // Handle any network errors during the test itself
          console.error("Network error:", err);
          done(err); // Ensure the test fails if there's a network error
          return;
      }

      expect(res).to.have.status(400); // Expect a 400 Bad Request (or another appropriate code)
      expect(res.body.error).to.equal("Dish name and user ID are required."); // Verify the error message
      done();
    });
});


it("should handle missing fields when requesting new dish (POST /api/requestNewDish)", (done) => {

  const invalidDishData = { userId: "someUserId" }; // Missing dishName

  chai
    .request(testApp)
    .post("/api/requestNewDish")
    .send(invalidDishData)
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body.error).to.equal("Dish name and user ID are required.");
      done();
    });
});

  after(() => {
      server.close();
      sinon.restore(); // Restore the original Firebase admin module
  });




});

