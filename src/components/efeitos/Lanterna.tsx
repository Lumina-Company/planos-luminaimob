/**
 * Os dois spans da lanterna, como filhos diretos de um elemento com `data-lanterna="claro" | "ciano"`
 * (posicionado e com cantos arredondados). A posição vem do useEfeitosDePonteiro em --mx/--my;
 * o brilho interno acende com o mouse no card, a borda acende com o mouse em qualquer card do grupo.
 * O conteúdo do card precisa ser `relative` para ficar por cima da luz.
 */
export function Lanterna() {
  return (
    <>
      <span aria-hidden="true" className="lanterna-luz" />
      <span aria-hidden="true" className="lanterna-borda" />
    </>
  );
}
