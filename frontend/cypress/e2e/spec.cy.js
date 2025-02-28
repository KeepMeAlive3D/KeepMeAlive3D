describe("Healthcheck", () => {
  it("Healthcheck", () => {
    cy.visit("http://localhost:5173/");
    cy.contains("login");
  });
});

describe("Login", () => {
  it("Login with correct data", () => {
    cy.visit("http://localhost:5173/");
    cy.intercept("POST", "/api/login/basic").as("loginRequest");

    cy.get("input[id=\"username\"]").type("tester");
    cy.get("input[id=\"password\"]").type("123");
    cy.get("button[type=\"submit\"]").click();

    cy.wait("@loginRequest");

    cy.get("#username").should("not.exist");
  });

  it("Login with incorrect data", () => {
    cy.visit("http://localhost:5173/");
    cy.intercept("POST", "/api/login/basic").as("loginRequest");

    cy.get("input[id=\"username\"]").type("tester");
    cy.get("input[id=\"password\"]").type("1235678");
    cy.get("button[type=\"submit\"]").click();

    // Check status code
    cy.wait("@loginRequest").then((interception) => {
      expect(interception.response.statusCode).to.equal(401);
    });

    // Login still visible
    cy.get("#username").should("exist");
  });

  it("Test session", () => {
    cy.login("tester", "123");
  });
});

describe("Model", () => {
  it("Upload and Update model", () => {
    cy.login("tester", "123");
    cy.visit("http://localhost:5173/");

    uploadModel("cube.glb");

    cy.get("#Component0").should("exist");
    cy.get("#Component0").children().should("have.length", 1);
    cy.get("#Component0").children().first().should("have.text", "Cube");

    // Upload second cube. This should check whether the label (and hence the store) update on changing the model.

    uploadModel("cube2.glb");

    cy.get("#Component0").should("exist");
    cy.get("#Component0").children().should("have.length", 1);
    cy.get("#Component0").children().first().should("have.text", "Cube2");
  });

  function uploadModel(name) {
    cy.get("#UploadMenuBar").click();

    cy.get("#filename").should("be.enabled");
    cy.get("#filename").type("test");
    cy.get("#hiddenFileInput").selectFile("./cypress/fixtures/" + name, {
      force: true,
    });
    cy.get("#uploadButton").click();


  }
});


