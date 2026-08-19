import axios from 'axios'

interface NestErrorBody {
  message?: string | string[]
}

export function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<NestErrorBody>(error)) {
    if (!error.response) {
      return 'Não foi possível conectar ao servidor. Verifique se a API está rodando.'
    }

    const backendMessage = error.response.data?.message
    if (Array.isArray(backendMessage)) {
      return backendMessage.join(' ')
    }
    if (typeof backendMessage === 'string') {
      return backendMessage
    }
  }

  return fallback
}