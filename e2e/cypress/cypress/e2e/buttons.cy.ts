describe('Buttons module', () => {
  beforeEach(() => {
    cy.visit('/modules/buttons');
  });

  it('counts single clicks and reports the last action', () => {
    cy.get('[data-testid=btn-click]').click().click();

    cy.get('[data-testid=btn-click-count]').should('have.text', '2');
    cy.get('[data-testid=btn-last-action]').should('have.text', 'single-click');
  });

  it('reflects the pressed state of the toggle button', () => {
    cy.get('[data-testid=btn-toggle]').as('toggle');

    cy.get('@toggle').should('have.attr', 'aria-pressed', 'false');
    cy.get('@toggle').click().should('have.attr', 'aria-pressed', 'true');
  });

  it('resolves an asynchronous action', () => {
    cy.get('[data-testid=btn-async]').click();

    cy.get('[data-testid=btn-last-action]', { timeout: 5000 }).should(
      'have.text',
      'async-complete',
    );
  });
});
