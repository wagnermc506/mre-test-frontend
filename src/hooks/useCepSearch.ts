import { useCallback, useState } from 'react';
import axios from 'axios';
import { getAddressByCep, CepNotFoundError } from '../services/viaCepService';
import { isValidCep, onlyDigits } from '../utils/cep';
import type { CepAddress } from '../types/cep';

type CepSearchStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseCepSearchResult {
  status: CepSearchStatus;
  address: CepAddress | null;
  errorMessage: string | null;
  search: (cep: string) => Promise<void>;
  reset: () => void;
}

export function useCepSearch(): UseCepSearchResult {
  const [status, setStatus] = useState<CepSearchStatus>('idle');
  const [address, setAddress] = useState<CepAddress | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setAddress(null);
    setErrorMessage(null);
  }, []);

  const search = useCallback(async (rawCep: string) => {
    const cep = onlyDigits(rawCep);

    if (!isValidCep(cep)) {
      setStatus('error');
      setAddress(null);
      setErrorMessage('Informe um CEP válido com 8 dígitos.');
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    try {
      const result = await getAddressByCep(cep);
      setAddress(result);
      setStatus('success');
    } catch (error) {
      setAddress(null);
      setStatus('error');

      if (error instanceof CepNotFoundError) {
        setErrorMessage(error.message);
      } else if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          setErrorMessage('A busca demorou demais. Tente novamente.');
        } else if (!error.response) {
          setErrorMessage('Não foi possível conectar. Verifique sua internet.');
        } else {
          setErrorMessage(
            'Erro ao consultar o CEP. Tente novamente mais tarde.',
          );
        }
      } else {
        setErrorMessage('Ocorreu um erro inesperado.');
      }
    }
  }, []);

  return { status, address, errorMessage, search, reset };
}
