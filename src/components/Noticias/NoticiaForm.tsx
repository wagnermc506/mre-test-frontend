import { useState, type FormEvent } from 'react';
import type { Noticia, NoticiaInput } from '../../types/noticia';
import { extractErrorMessage } from '../../utils/httpError';
import './Noticias.css';

interface NoticiaFormProps {
  editingNoticia: Noticia | null;
  onCreate: (input: NoticiaInput) => Promise<void>;
  onUpdate: (id: string, input: NoticiaInput) => Promise<void>;
  onCancelEdit: () => void;
}

const EMPTY_FORM: NoticiaInput = { titulo: '', descricao: '' };

export function NoticiaForm({
  editingNoticia,
  onCreate,
  onUpdate,
  onCancelEdit,
}: NoticiaFormProps) {
  const [form, setForm] = useState<NoticiaInput>(
    editingNoticia
      ? { titulo: editingNoticia.titulo, descricao: editingNoticia.descricao }
      : EMPTY_FORM,
  );
  const [fieldErrors, setFieldErrors] = useState<Partial<NoticiaInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(input: NoticiaInput): Partial<NoticiaInput> {
    const errors: Partial<NoticiaInput> = {};
    if (input.titulo.trim().length < 3) {
      errors.titulo = 'O título deve ter ao menos 3 caracteres.';
    }
    if (input.descricao.trim().length < 10) {
      errors.descricao = 'A descrição deve ter ao menos 10 caracteres.';
    }
    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (editingNoticia) {
        await onUpdate(editingNoticia.id, form);
      } else {
        await onCreate(form);
        setForm(EMPTY_FORM);
      }
    } catch (error) {
      setSubmitError(
        extractErrorMessage(
          error,
          'Não foi possível salvar a notícia. Tente novamente.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="noticia-form" onSubmit={handleSubmit} noValidate>
      <h2>{editingNoticia ? 'Editar notícia' : 'Nova notícia'}</h2>

      <div className="noticia-form__field">
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          value={form.titulo}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, titulo: event.target.value }))
          }
          disabled={isSubmitting}
          aria-invalid={Boolean(fieldErrors.titulo)}
        />
        {fieldErrors.titulo && (
          <span className="noticia-form__error">{fieldErrors.titulo}</span>
        )}
      </div>

      <div className="noticia-form__field">
        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          rows={4}
          value={form.descricao}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, descricao: event.target.value }))
          }
          disabled={isSubmitting}
          aria-invalid={Boolean(fieldErrors.descricao)}
        />
        {fieldErrors.descricao && (
          <span className="noticia-form__error">{fieldErrors.descricao}</span>
        )}
      </div>

      {submitError && (
        <p className="noticia-form__submit-error" role="alert">
          {submitError}
        </p>
      )}

      <div className="noticia-form__actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Salvando...'
            : editingNoticia
              ? 'Salvar alterações'
              : 'Adicionar'}
        </button>
        {editingNoticia && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isSubmitting}
            className="secondary"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
