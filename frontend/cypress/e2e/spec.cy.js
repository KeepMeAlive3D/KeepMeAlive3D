import axios from "axios";

describe("Healthcheck", () => {
  it("Healthcheck", () => {
    cy.visit("http://localhost:5173/");
    cy.contains("login");
  });
});

describe("Register", () => {
  it("Register new account correctly", () => {
    cy.visit("http://localhost:5173/");
    cy.intercept("POST", "/api/register/basic").as("registerRequest");

    cy.get("input[id=\"username\"]").type("tttt");
    cy.get("input[id=\"password\"]").type("123");
    cy.get("button[name=\"register\"]").click();

    cy.wait("@registerRequest");

    cy.get("#username").should("not.exist");
    cy.window()
      .its("localStorage.token")
      .should("not.be.null");

    cy.deleteCurrentUser();
  });

  it("Register already present account", () => {
    cy.visit("http://localhost:5173/");
    cy.intercept("POST", "/api/register/basic").as("registerRequest");

    cy.get("input[id=\"username\"]").type("tester");
    cy.get("input[id=\"password\"]").type("123");
    cy.get("button[name=\"register\"]").click();

    cy.wait("@registerRequest");

    cy.get("#username").should("exist");
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
    cy.get("#user-menu-button").should("contain.text", "tester");
  });

  it("Login with incorrect data", () => {
    cy.visit("http://localhost:5173/");
    cy.intercept("POST", "/api/login/basic").as("loginRequest");

    Cypress.on("uncaught:exception", (err, runnable) => {
      // Logging in with incorrect data will cause a rejected promise in the
      // service. Therefore, we have to say that this will not fail the test.
      return false;
    });

    cy.get("input[id=\"username\"]").type("tester");
    cy.get("input[id=\"password\"]").type("1235678");
    cy.get("button[type=\"submit\"]").click();

    // Check status code
    cy.wait("@loginRequest").then((interception) => {
      if (interception.response) {
        expect(interception.response.statusCode).to.equal(401);
      }

    });

    // Login still visible
    cy.get("#username").should("exist");
  });

  it("Logout", () => {
    cy.login("tester", "123");
    cy.visit("http://localhost:5173/");

    // Logout
    cy.get("#user-menu-button").click();
    cy.contains("span", "Sign out").click();

    // Session token deleted?
    cy.window().then((window) => {
      const token = window.localStorage.getItem("token");
      expect(token).to.be.null;
    });

    // Login visible?
    cy.get("#username").should("exist");
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

    // Check if part ids are in list ni sidebar
    cy.get("#Component0").should("exist");
    cy.get("#Component0").children().should("have.length", 1);
    cy.get("#Component0").children().first().should("have.text", "Cube2");

    // Delete first cube
    cy.get("#OpenMenuBar").click();
    cy.get("#delete-0").click();
    // Second delete button should not exist as now only one cube is available
    cy.get("#action-cell-1").should("not.exist");
    // Delete second cube
    cy.get("#delete-0").click();

    // Check if model got unloaded (component list should not exist anymore)
    cy.get("#Component0").should("not.exist");
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


