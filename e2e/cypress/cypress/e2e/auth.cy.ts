describe('Authentication', () => {
  // Assumes the API is seeded (`npm run seed`) so user@practice.dev / User1234! exists.
  it('signs in with the demo account and lands on the dashboard', () => {
    cy.visit('/login');

    cy.get('[data-testid=login-email]').clear().type('user@practice.dev');
    cy.get('[data-testid=login-password]').clear().type('User1234!');
    cy.get('[data-testid=login-submit]').click();

    cy.get('[data-testid=user-menu]').should('be.visible');
    cy.location('pathname').should('eq', '/');
  });

  it('shows an inline error for invalid credentials', () => {
    cy.visit('/login');

    cy.get('[data-testid=login-email]').clear().type('user@practice.dev');
    cy.get('[data-testid=login-password]').clear().type('WrongPassword1');
    cy.get('[data-testid=login-submit]').click();

    cy.get('[data-testid=login-error]').should('be.visible');
  });
});
