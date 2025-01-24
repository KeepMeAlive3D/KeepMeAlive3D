describe('Basic tests', () => {
    it('Healthcheck', () => {
        cy.visit("http://localhost:5173/")
        cy.contains('login')
    })

    it('Login with correct data', () => {
        cy.visit("http://localhost:5173/")
        cy.intercept('POST', '/api/login/basic').as('loginRequest');

        cy.get('input[id="username"]').type('admin');
        cy.get('input[id="password"]').type('123');
        cy.get('button[type="submit"]').click();

        cy.wait('@loginRequest');

        cy.get('#username').should('not.exist');
    })

    it('Login with incorrect data', () => {
        cy.visit("http://localhost:5173/")
        cy.intercept('POST', '/api/login/basic').as('loginRequest');

        cy.get('input[id="username"]').type('admin');
        cy.get('input[id="password"]').type('1235678');
        cy.get('button[type="submit"]').click();

        // Wait until
        cy.wait('@loginRequest');

        cy.get('#username').should('exist');
    })
})