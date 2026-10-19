import { useRef, useState, type ReactNode } from "react";
import { Link2, Volume2, VolumeX } from "lucide-react";
import { useApp } from "./store";
import { lerCaminho } from "../lib/edicoes";

type Fonte = { tipo: "arquivo"; src: string; capa?: string } | { tipo: "iframe"; src: string };

/**
 * Aceita .mp4 público, YouTube ou Vimeo (docs/06, ADM4).
 * Arquivo local em public/ (ex.: /video/max-demo.mp4) usa como capa o .webp de mesmo nome.
 */
export function resolverVideo(url: string): Fonte | null {
  const u = url.trim();
  if (/^\/[^/]/.test(u)) return { tipo: "arquivo", src: u, capa: u.replace(/\.mp4$/i, ".webp") };
  if (!/^https?:\/\//i.test(u)) return null;
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/i);
  if (yt) {
    const id = yt[1];
    return {
      tipo: "iframe",
      src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0`,
    };
  }
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vm) return { tipo: "iframe", src: `https://player.vimeo.com/video/${vm[1]}?autoplay=1&muted=1&loop=1&background=1` };
  return { tipo: "arquivo", src: u };
}

/** Atributos que pedem ao navegador para não pôr botões próprios (pop-out, PiP, transmitir) sobre o vídeo. */
export const SEM_BOTOES_DO_NAVEGADOR = {
  disablePictureInPicture: true,
  disableRemotePlayback: true,
  controlsList: "nodownload nofullscreen noremoteplayback noplaybackrate",
} as const;

/**
 * Vídeo vertical: toca sem som e em loop; clique liga o som.
 * Com `aoAmpliar`, o clique abre em tela cheia e o som fica no botão do canto.
 * Sem link, mostra o `reserva` (imagem + "exemplo em produção").
 * No admin, permite colar o link do vídeo.
 */
export function Midia({
  caminho,
  reserva,
  rotulo,
  aoAmpliar,
}: {
  caminho: string;
  reserva: ReactNode;
  rotulo: string;
  aoAmpliar?: (video: HTMLVideoElement) => void;
}) {
  const { admin, conteudo, editar } = useApp();
  const url = (lerCaminho(conteudo, caminho) as string) ?? "";
  const fonte = url ? resolverVideo(url) : null;
  const video = useRef<HTMLVideoElement>(null);
  const [mudo, setMudo] = useState(true);
  const [colando, setColando] = useState(false);
  const [rascunho, setRascunho] = useState(url);
  const [erro, setErro] = useState("");

  const salvarLink = () => {
    if (rascunho.trim() === "") {
      editar(caminho, "");
      setColando(false);
      return;
    }
    if (!resolverVideo(rascunho)) {
      setErro("Cole um link que comece com https:// (.mp4, YouTube ou Vimeo).");
      return;
    }
    editar(caminho, rascunho.trim());
    setErro("");
    setColando(false);
  };

  return (
    <div className="relative size-full">
      {fonte?.tipo === "arquivo" ? (
        <>
          <video
            ref={video}
            key={fonte.src}
            src={fonte.src}
            poster={fonte.capa}
            className="pointer-events-none size-full object-cover"
            muted={mudo}
            autoPlay
            loop
            playsInline
            preload="metadata"
            {...SEM_BOTOES_DO_NAVEGADOR}
          />
          {/* Camada por cima do vídeo: o clique é dela e o mouse nunca pousa no <video>,
              que é onde o Opera põe os botões de pop-out */}
          <button
            type="button"
            data-cursor-rotulo={aoAmpliar ? "Ampliar" : mudo ? "Ligar o som" : "Desligar o som"}
            className={`absolute inset-0 ${aoAmpliar ? "cursor-zoom-in" : ""}`}
            onClick={() => (aoAmpliar && video.current ? aoAmpliar(video.current) : setMudo((m) => !m))}
            aria-label={aoAmpliar ? `Ver em tela cheia: ${rotulo}` : mudo ? `Ligar o som: ${rotulo}` : `Desligar o som: ${rotulo}`}
          />
          {aoAmpliar ? (
            <button
              type="button"
              onClick={() => setMudo((m) => !m)}
              aria-label={mudo ? `Ligar o som: ${rotulo}` : `Desligar o som: ${rotulo}`}
              className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-ink/70 text-white backdrop-blur"
            >
              {mudo ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
          ) : (
            <span className="pointer-events-none absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-ink/70 text-white backdrop-blur">
              {mudo ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </span>
          )}
        </>
      ) : fonte?.tipo === "iframe" ? (
        <iframe
          src={fonte.src}
          title={rotulo}
          className="size-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        reserva
      )}

      {admin && (
        <div className="absolute inset-x-3 top-3 z-20">
          {colando ? (
            <div className="rounded-2xl bg-white p-3 shadow-[var(--shadow-pop)]">
              <label className="block text-[12px] font-medium text-ink-2" htmlFor={`link-${caminho}`}>
                Link do vídeo
              </label>
              <input
                id={`link-${caminho}`}
                type="url"
                autoFocus
                value={rascunho}
                onChange={(e) => setRascunho(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") salvarLink();
                  if (e.key === "Escape") {
                    e.stopPropagation();
                    setColando(false);
                  }
                }}
                placeholder="https://…"
                className="mt-1 h-10 w-full rounded-lg border border-line-strong px-3 text-[14px] outline-none focus:border-primary-600"
              />
              {erro ? (
                <p role="alert" className="mt-1.5 text-[12px] text-bad">
                  {erro}
                </p>
              ) : (
                <p className="mt-1.5 text-[12px] text-ink-2">.mp4 público, YouTube ou Vimeo. Vazio volta ao exemplo.</p>
              )}
              <div className="mt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setColando(false)} className="h-8 rounded-full px-3 text-[13px] text-ink-2 hover:bg-primary-50">
                  Cancelar
                </button>
                <button type="button" onClick={salvarLink} className="h-8 rounded-full bg-ink px-3 text-[13px] font-medium text-white">
                  Salvar link
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setRascunho(url);
                setColando(true);
              }}
              className="inline-flex h-9 items-center gap-2 rounded-full border-2 border-dashed border-white bg-ink/75 px-3.5 text-[13px] font-medium text-white backdrop-blur"
            >
              <Link2 className="size-4" /> Trocar vídeo
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** Reserva enquanto não houver o vídeo definitivo (LAY7): imagem + selo. */
export function ReservaImagem({
  src,
  alt,
  selo,
  efeito = "zoom-lento",
}: {
  src: string;
  alt: string;
  selo: ReactNode;
  efeito?: "zoom-lento" | "passeio";
}) {
  return (
    <div className="relative size-full overflow-hidden bg-primary-50">
      <img src={src} alt={alt} className={`size-full object-cover ${efeito}`} loading="lazy" decoding="async" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/55 to-transparent" />
      <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[12px] font-semibold text-primary-900 shadow-sm">
        <span className="size-1.5 rounded-full bg-primary-600" />
        {selo}
      </span>
    </div>
  );
}
