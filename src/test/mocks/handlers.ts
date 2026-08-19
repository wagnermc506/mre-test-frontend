import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://viacep.com.br/ws/01001000/json/', () => {
    return HttpResponse.json({
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      complemento: 'lado ímpar',
      unidade: '',
      bairro: 'Sé',
      localidade: 'São Paulo',
      uf: 'SP',
      estado: 'São Paulo',
      regiao: 'Sudeste',
      ibge: '3550308',
      gia: '1004',
      ddd: '11',
      siafi: '7107',
    });
  }),

  http.get('https://viacep.com.br/ws/99999999/json/', () => {
    return HttpResponse.json({ erro: true });
  }),
];
