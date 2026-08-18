import { useId, useState, type FormEvent } from 'react'
import { useCepSearch } from '../../hooks/useCepSearch'
import { formatCep } from '../../utils/cep'

export function CepSearchForm() {
  const [cepInput, setCepInput] = useState('')
  const { status, address, errorMessage, search } = useCepSearch()
  const inputId = useId()
  const isLoading = status === 'loading'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void search(cepInput)
  }

  return (
    <section className="cep-search" aria-labelledby={`${inputId}-title`}>
      <h1 id={`${inputId}-title`}>Busca de Endereço por CEP</h1>

      <form className="cep-search__form" onSubmit={handleSubmit} noValidate>
        <label htmlFor={inputId} className="cep-search__label">
          CEP
        </label>
        <div className="cep-search__field">
          <input
            id={inputId}
            name="cep"
            type="text"
            inputMode="numeric"
            placeholder="00000-000"
            value={cepInput}
            onChange={(event) => setCepInput(formatCep(event.target.value))}
            disabled={isLoading}
            aria-invalid={status === 'error'}
            aria-describedby={status === 'error' ? `${inputId}-error` : undefined}
            maxLength={9}
          />
          <button type="submit" disabled={isLoading || cepInput.length < 9}>
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {status === 'error' && errorMessage && (
          <p
            id={`${inputId}-error`}
            className="cep-search__message cep-search__message--error"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </form>

      {isLoading && (
        <div className="cep-search__loading" role="status" aria-live="polite">
          <span className="cep-search__spinner" aria-hidden="true" />
          Consultando endereço...
        </div>
      )}

      {status === 'success' && address && (
        <dl className="cep-search__result" aria-live="polite">
          <div>
            <dt>CEP</dt>
            <dd>{address.cep}</dd>
          </div>
          <div>
            <dt>Logradouro</dt>
            <dd>{address.logradouro || '-'}</dd>
          </div>
          <div>
            <dt>Bairro</dt>
            <dd>{address.bairro || '-'}</dd>
          </div>
          <div>
            <dt>Cidade / UF</dt>
            <dd>
              {address.localidade} / {address.uf}
            </dd>
          </div>
        </dl>
      )}
    </section>
  )
}