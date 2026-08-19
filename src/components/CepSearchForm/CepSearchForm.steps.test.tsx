import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { expect, type TestContext } from 'vitest'
import { server } from '../../test/mocks/server'
import { CepSearchForm } from './CepSearchForm'

const feature = await loadFeature('./CepSearchForm.feature')

describeFeature(feature, ({ Background, Scenario, AfterEachScenario }) => {
  let user: ReturnType<typeof userEvent.setup>

  Background(({ Given }) => {
    Given('que a tela de busca de CEP está visível', () => {
      user = userEvent.setup()
      render(<CepSearchForm />)
    })
  })

  AfterEachScenario(() => {
    cleanup()
    server.resetHandlers()
  })

  Scenario('Busca de um CEP válido e existente', ({ When, And, Then }) => {
    When('o usuário digita {string} no campo de CEP', async (_ctx: TestContext, cep: string) => {
      await user.type(screen.getByLabelText('CEP'), cep)
    })

    And('clica no botão de buscar', async () => {
      await user.click(screen.getByRole('button', { name: /buscar/i }))
    })

    Then('o endereço {string} deve ser exibido', async (_ctx: TestContext, logradouro: string) => {
      expect(await screen.findByText(logradouro)).toBeInTheDocument()
    })

    And('a cidade {string} deve ser exibida', (_ctx: TestContext, cidade: string) => {
      expect(screen.getByText(new RegExp(cidade))).toBeInTheDocument()
    })
  })

  Scenario('Busca de um CEP inexistente', ({ When, And, Then }) => {
    When('o usuário digita {string} no campo de CEP', async (_ctx: TestContext, cep: string) => {
      await user.type(screen.getByLabelText('CEP'), cep)
    })

    And('clica no botão de buscar', async () => {
      await user.click(screen.getByRole('button', { name: /buscar/i }))
    })

    Then('uma mensagem informando que o CEP não foi encontrado deve ser exibida', async () => {
      expect(await screen.findByRole('alert')).toHaveTextContent(/não foi encontrado/i)
    })
  })

  Scenario('Busca de um CEP com formato inválido', ({ When, Then }) => {
    When('o usuário digita {string} no campo de CEP', async (_ctx: TestContext, cep: string) => {
      await user.type(screen.getByLabelText('CEP'), cep)
    })

    Then('o botão de buscar deve permanecer desabilitado', () => {
      expect(screen.getByRole('button', { name: /buscar/i })).toBeDisabled()
    })
  })

  Scenario('Falha de conexão ao consultar o serviço de CEP', ({ Given, When, And, Then }) => {
    Given('que o serviço de CEP está indisponível', () => {
      server.use(
        http.get('https://viacep.com.br/ws/01001000/json/', () => HttpResponse.error()),
      )
    })

    When('o usuário digita {string} no campo de CEP', async (_ctx: TestContext, cep: string) => {
      await user.type(screen.getByLabelText('CEP'), cep)
    })

    And('clica no botão de buscar', async () => {
      await user.click(screen.getByRole('button', { name: /buscar/i }))
    })

    Then('uma mensagem de erro de conexão deve ser exibida', async () => {
      expect(await screen.findByRole('alert')).toHaveTextContent(/conectar/i)
    })
  })
})