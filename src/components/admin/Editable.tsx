import { useRef, type ElementType, type KeyboardEvent, type ReactNode } from "react";
import { Plus, ArrowUp, ArrowDown, X } from "lucide-react";
import { useApp } from "../store";
import { lerCaminho, validar, type TipoCampo } from "../../lib/edicoes";
import { gsap, reduzMovimento } from "../../lib/gsap";

interface Props {
  /** caminho no conteúdo (ex.: "categorias.pro.faixas.1.preco") */
  caminho?: string;
  /** valor atual quando não vem de um caminho (itens de lista) */
  valor?: string | number;
  aoConfirmar?: (v: string | number) => void;
  tipo?: TipoCampo;
  formatar?: (v: never) => string;
  as?: ElementType;
  className?: string;
  /** contorno branco, para campos sobre o gradiente */
  claro?: boolean;
  rotulo?: string;
  children?: ReactNode;
}

/** Fora do admin: texto puro. Com o admin ligado: o mesmo texto, editável clicando. */
export function Editable({
  caminho,
  valor,
  aoConfirmar,
  tipo = "texto",
  formatar,
  as: Tag = "span",
  className = "",
  claro,
  rotulo,
  children,
}: Props) {
  const { admin, conteudo, parametrosAdmin, editar } = useApp();
  const ref = useRef<HTMLElement>(null);
  const atual = (
    caminho
      ? caminho.startsWith("admin.")
        ? lerCaminho(parametrosAdmin, caminho.slice("admin.".length))
        : lerCaminho(conteudo, caminho)
      : valor
  ) as string | number;
  const exibido = atual == null ? "" : formatar ? formatar(atual as never) : String(atual);

  if (!admin) {
    return <Tag className={className}>{children ?? exibido}</Tag>;
  }

  const recusar = () => {
    const el = ref.current;
    if (!el) return;
    el.dataset.invalido = "true";
    const fim = () => {
      el.textContent = exibido;
      delete el.dataset.invalido;
    };
    if (reduzMovimento()) setTimeout(fim, 300);
    else
      gsap.fromTo(
        el,
        { x: 0 },
        { keyframes: { x: [0, -4, 4, -4, 4, 0] }, duration: 0.3, ease: "none", onComplete: fim, overwrite: true },
      );
  };

  const confirmar = () => {
    const el = ref.current;
    if (!el) return;
    const texto = el.innerText.replace(/\n+/g, " ");
    if (texto.trim() === exibido.trim()) {
      el.textContent = exibido;
      return;
    }
    const v = validar(tipo, texto);
    if (v === null) return recusar();
    if (aoConfirmar) aoConfirmar(v);
    else if (caminho) editar(caminho, v);
  };

  const teclado = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ref.current?.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      if (ref.current) ref.current.textContent = exibido;
      ref.current?.blur();
    }
  };

  return (
    <Tag
      key={exibido}
      ref={ref}
      className={`${className} editavel ${claro ? "editavel-claro" : ""}`}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      spellCheck={tipo === "texto" || tipo === "textoOpcional"}
      role="textbox"
      aria-label={rotulo ? `Editar ${rotulo}` : "Editar"}
      data-editavel=""
      onBlur={confirmar}
      onKeyDown={teclado}
      onClick={(e: { stopPropagation: () => void }) => e.stopPropagation()}
    >
      {exibido}
    </Tag>
  );
}

interface ListaProps {
  caminho: string;
  className?: string;
  itemClassName?: string;
  /** desenha cada item; recebe o nó de texto (editável no admin) */
  render: (texto: ReactNode, indice: number) => ReactNode;
  rotuloNovo?: string;
}

/** Lista editável: no admin, editar, adicionar, remover e reordenar (docs/06). */
export function ListaEditavel({ caminho, className, render, rotuloNovo = "Adicionar item" }: ListaProps) {
  const { admin, conteudo, editar } = useApp();
  const itens = (lerCaminho(conteudo, caminho) as string[]) ?? [];

  const mudar = (novo: string[]) => editar(caminho, novo);

  return (
    <ul className={className}>
      {itens.map((item, i) => (
        <li key={`${i}-${item}`} className={admin ? "flex items-center gap-1.5" : undefined}>
          <div className={admin ? "min-w-0 flex-1" : "contents"}>{render(
            <Editable
              valor={item}
              rotulo="item"
              aoConfirmar={(v) => mudar(itens.map((x, j) => (j === i ? String(v) : x)))}
            />,
            i,
          )}</div>
          {admin && (
            <span className="flex shrink-0 gap-0.5 rounded-full border border-line bg-white p-0.5 shadow-sm">
              <BotaoMini rotulo="Subir" desabilitado={i === 0} aoClicar={() => mudar(trocar(itens, i, i - 1))}>
                <ArrowUp className="size-3.5" />
              </BotaoMini>
              <BotaoMini
                rotulo="Descer"
                desabilitado={i === itens.length - 1}
                aoClicar={() => mudar(trocar(itens, i, i + 1))}
              >
                <ArrowDown className="size-3.5" />
              </BotaoMini>
              <BotaoMini rotulo="Remover" aoClicar={() => mudar(itens.filter((_, j) => j !== i))}>
                <X className="size-3.5" />
              </BotaoMini>
            </span>
          )}
        </li>
      ))}
      {admin && (
        <li>
          <button
            type="button"
            onClick={() => mudar([...itens, "Novo item"])}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary px-3 py-1.5 text-[13px] font-medium text-primary-700 hover:bg-primary-50"
          >
            <Plus className="size-3.5" strokeWidth={2} /> {rotuloNovo}
          </button>
        </li>
      )}
    </ul>
  );
}

function trocar(arr: string[], a: number, b: number) {
  const c = [...arr];
  [c[a], c[b]] = [c[b], c[a]];
  return c;
}

function BotaoMini({
  children,
  rotulo,
  aoClicar,
  desabilitado,
}: {
  children: ReactNode;
  rotulo: string;
  aoClicar: () => void;
  desabilitado?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={rotulo}
      title={rotulo}
      disabled={desabilitado}
      onClick={aoClicar}
      className="grid size-6 place-items-center rounded-full text-ink-2 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-30"
    >
      {children}
    </button>
  );
}
