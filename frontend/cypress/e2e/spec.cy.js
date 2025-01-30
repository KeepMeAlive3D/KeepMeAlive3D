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

    cy.get("input[id=\"username\"]").type("admin");
    cy.get("input[id=\"password\"]").type("123");
    cy.get("button[type=\"submit\"]").click();

    cy.wait("@loginRequest");

    cy.get("#username").should("not.exist");
  });

  it("Login with incorrect data", () => {
    cy.visit("http://localhost:5173/");
    cy.intercept("POST", "/api/login/basic").as("loginRequest");

    cy.get("input[id=\"username\"]").type("admin");
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
    cy.login("admin", "123");
  });
});

describe("Model", () => {
  it("Upload model", () => {
    cy.login("admin", "123");
    cy.visit("http://localhost:5173/");

    cy.get("#UploadMenuBar").click();

    cy.get("#filename").should("be.enabled");
    cy.get("#filename").type("test");
    cy.get("#hiddenFileInput").selectFile("./cypress/fixtures/cube.glb", {
      force: true,
    });
    cy.get("#uploadButton").click();

    cy.get("#Component0").should("exist");
  });
});
