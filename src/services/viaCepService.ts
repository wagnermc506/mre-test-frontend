import type { CepAddress, CepErrorResponse } from "../types/cep";
import { viaCepClient } from "./viaCephttpClient";

export class CepNotFoundError extends Error {
  constructor(cep: string) {
    super(`CEP ${cep} não foi encontrado`);
    this.name = "CepNotFoundError";
  }
}

export async function getAddressByCep(cep: string): Promise<CepAddress> {
  const response = await viaCepClient.get<CepAddress | CepErrorResponse>(`/${cep}/json/`);

  if ('erro' in response.data) {
    throw new CepNotFoundError(cep);
  }

  return response.data;
}

