const dadoBusca = require('../fixtures/pesquisa.json')
const dadoLimite = require('../fixtures/config.json')

describe("Funcionalidade de pesquisa", () => {

    beforeEach(() => {
        cy.visit('/') // Visita a URL informada no cypress.config.js
        cy.viewport(1280, 720) // Aumenta o tamanho da tela

        cy.get('#search-open').click()
        cy.get('.desktop-search > .search-form') // Localiza o campo de pesquisa
            .type(dadoBusca.busca) // Insere pesquisa 
    })

    it("Deve retornar resultados da pesquisa", () => {
        cy.get('.desktop-search .search-submit').click();
        cy.url().should('include', dadoBusca.busca) // Verifica caminho da URL
        cy.get('.archive-title')
            .should('contain', 'Resultados da busca por:', dadoBusca.busca) // Verifica titulo da página

    })

    it("Deve atualizar a página de resultados em menos de 2 segundos", () => {
        cy.window().then((teste) => {
            const tempoInicial = teste.performance.now();
            cy.get('.desktop-search .search-submit').click(); // Clicar em "Procurar"

            // Capture o tempo de término após a navegação
            cy.window().then((teste) => {
                const tempoFinal = teste.performance.now();
                const navigationTime = (parseInt(tempoInicial - tempoFinal) / 1000); // Convertendo resultado para segundos
                cy.log(`Tempo de navegação: ${navigationTime} seg`); // Log para melhor visualização
                expect(navigationTime).to.be.lessThan(dadoLimite.limiteTempo); // Verificar se tempo de carregamento está em até 2 segundos
            });
        });
    });
});