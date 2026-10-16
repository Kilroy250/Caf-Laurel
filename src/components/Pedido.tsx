"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/components/motion/Primitives";
import { BeanDrift, type GranoConfig } from "@/components/motion/BeanDrift";
import { ArrowIcon, WhatsAppIcon } from "@/components/Icons";
import { waLink } from "@/lib/contacto";
import { PIN_QUERY } from "@/components/useMediaQuery";

// Precio al público, por bolsa (500 g primero: es el de mejor valor)
const SIZES = [
  { gramos: 500, price: 49000 },
  { gramos: 250, price: 29000 },
];

// Precio al por mayor por bolsa, según cantidad mínima de unidades
const MAYOR: Record<number, [number, number][]> = {
  500: [[10, 44000], [15, 42600], [20, 41200], [25, 39700]],
  250: [[10, 26000], [15, 25200], [20, 24400], [25, 23500]],
};

const GRINDS = ["Grano", "Molido"];

type Modo = "casa" | "mayor";
type Estado = "cerrado" | "abierto" | "cerrando";

const miles = (n: number) => n.toLocaleString("es-CO");

// curva de la cortina del pedido: entra y sale con suavidad simétrica
const CORTINA = [0.65, 0, 0.25, 1] as const;

// Cualquier botón "Comprar ahora" de la página abre el pedido con este evento.
const ABRIR_PEDIDO = "laurel:abrir-pedido";
export function abrirPedido({ mayorista = false } = {}) {
  window.dispatchEvent(new CustomEvent(ABRIR_PEDIDO, { detail: { mayorista } }));
}

// Granos del pedido. Los lejanos (pequeños, desenfocados, tenues) van primero en la
// lista para quedar siempre detrás de los nítidos, y ninguno toca a otro: bajan todos
// juntos, el mismo tramo, en cada paso, así que las distancias entre ellos no cambian.
// Empiezan a la altura de las presentaciones.
const GRANOS: GranoConfig[] = [
  // lejanos: el fondo, también detrás de los pasos
  { left: "52%", top: "8%", size: 36, depth: 0.4, rot: [30, 30], blur: 3, desktop: true, opacity: 0.55 },
  { left: "90%", top: "12%", size: 40, depth: 0.4, rot: [-40, -40], blur: 3, desktop: true, opacity: 0.55 },
  { left: "70%", top: "10%", size: 34, depth: 0.35, rot: [10, 10], blur: 3.5, desktop: true, opacity: 0.4 },
  { left: "84%", top: "30%", size: 40, depth: 0.4, rot: [-70, -70], blur: 3.5, desktop: true, opacity: 0.4 },
  // medios
  { left: "47.5%", top: "24%", size: 58, depth: 0.6, rot: [60, 60], blur: 1.2, desktop: true },
  { left: "97%", top: "52%", size: 52, depth: 0.6, rot: [-25, -25], blur: 1.2, desktop: true },
  // cercanos
  { left: "51.5%", top: "40%", size: 78, depth: 1, rot: [-15, -15], blur: 0, desktop: true },
  { left: "97.5%", top: "22%", size: 84, depth: 1, rot: [20, 20], blur: 0 },
  // celular: uno más, asomado por el borde izquierdo
  { left: "1%", top: "46%", size: 64, depth: 1, rot: [-30, -30], blur: 0, movil: true },
];

/**
 * El pedido se abre encima de la página, sin moverla: al cerrar, todo sigue donde estaba.
 * Solo existe mientras está abierto: una pantalla completa fija, aunque esté escondida,
 * confunde a Safari de iPhone, que tiñe su barra con los elementos fijos grandes.
 * La cortina se mueve solo con `transform`: el panel sube y su contenido baja lo mismo,
 * así el contenido queda quieto mientras el borde lo descubre.
 */
export function Pedido() {
  const [estado, setEstado] = useState<Estado>("cerrado");
  const [modo, setModo] = useState<Modo>("casa");
  const [sesion, setSesion] = useState(0); // cambia al cerrar: el formulario vuelve a empezar
  const [cambio, setCambio] = useState(false); // true si el modo cambió con el pedido ya abierto
  const disparador = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  const visible = estado !== "cerrado";
  const cerrar = useCallback(() => setEstado((e) => (e === "abierto" ? "cerrando" : e)), []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      disparador.current = document.activeElement as HTMLElement | null;
      setModo((e as CustomEvent<{ mayorista: boolean }>).detail?.mayorista ? "mayor" : "casa");
      setCambio(false);
      setEstado("abierto");
    };
    window.addEventListener(ABRIR_PEDIDO, onOpen);
    return () => window.removeEventListener(ABRIR_PEDIDO, onOpen);
  }, []);

  // con el pedido abierto la página de atrás no se mueve
  useEffect(() => {
    if (!visible) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, cerrar]);

  const panelY = estado === "abierto" ? "0%" : estado === "cerrando" ? "-100%" : "100%";
  const contenidoY = estado === "abierto" ? "0%" : estado === "cerrando" ? "100%" : "-100%";
  const transicion =
    estado === "cerrado" || reduce
      ? { duration: 0 }
      : { duration: estado === "abierto" ? 1.2 : 1, ease: CORTINA };

  if (!visible) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Arma tu pedido"
      className="fixed inset-0 z-[95] overflow-hidden bg-cream text-ink"
      style={{ willChange: "transform" }}
      initial={{ y: "100%" }}
      animate={{ y: panelY }}
      transition={transicion}
      onAnimationComplete={() => {
        if (estado !== "cerrando") return;
        setEstado("cerrado");
        setSesion((s) => s + 1);
        disparador.current?.focus?.({ preventScroll: true });
      }}
    >
      <motion.div
        className="absolute inset-0 overflow-y-auto overflow-x-hidden overscroll-contain"
        style={{ willChange: "transform" }}
        initial={{ y: "-100%" }}
        animate={{ y: contenidoY }}
        transition={transicion}
      >
        <Contenido
          key={`${sesion}-${modo}`}
          cambioDeModo={cambio}
          modo={modo}
          setModo={(m) => {
            setCambio(true);
            setModo(m);
          }}
          onClose={cerrar}
        />
      </motion.div>
    </motion.div>
  );
}

function Contenido({
  cambioDeModo,
  modo,
  setModo,
  onClose,
}: {
  cambioDeModo: boolean;
  modo: Modo;
  setModo: (m: Modo) => void;
  onClose: () => void;
}) {
  // Presentaciones elegidas: en compra individual se pueden elegir las dos (p. ej. 2 de 500 g
  // y 1 de 250 g); cada una lleva su molienda y su cantidad. Al por mayor se elige una.
  const [sel, setSel] = useState<number[]>([]);
  const [grinds, setGrinds] = useState<Record<number, string | null>>({});
  const [qtys, setQtys] = useState<Record<number, number>>({ 500: 1, 250: 1 });
  const [qtyHecha, setQtyHecha] = useState(false);
  // al por mayor: escalón de unidades de cada presentación (10, 15, 20 o 25)
  const [tramos, setTramos] = useState<Record<number, number | null>>({});
  const [enviado, setEnviado] = useState(false); // tocó el botón de WhatsApp
  const closeRef = useRef<HTMLButtonElement>(null);
  // celular: cada paso tiene su ancla, para guiar con el botón de abajo y avanzar solo
  const paso1 = useRef<HTMLDivElement>(null);
  const paso2 = useRef<HTMLDivElement>(null);
  const paso3 = useRef<HTMLDivElement>(null);
  const [resaltado, setResaltado] = useState<number | null>(null);
  const anterior = useRef({ n: 0, molienda: false });

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  const mayor = modo === "mayor";
  const elegidas = SIZES.map((s) => s.gramos).filter((g) => sel.includes(g));
  const nSel = elegidas.length;
  const molienda = nSel > 0 && elegidas.every((g) => grinds[g]);
  const unidadesDe = (g: number) => (mayor ? tramos[g] ?? 0 : qtys[g]);
  const precioUnidad = (g: number) =>
    mayor ? MAYOR[g].find(([u]) => u === (tramos[g] ?? 10))![1] : SIZES.find((s) => s.gramos === g)!.price;

  const tramosListos = nSel > 0 && elegidas.every((g) => tramos[g]);
  const pasoCantidad = nSel > 0 && (mayor ? tramosListos : qtyHecha);
  const ready = nSel > 0 && molienda && (mayor ? tramosListos : true);
  // cada paso completado hace bajar los granos; al deshacerlo, vuelven a subir
  const stage = Number(nSel > 0) + Number(molienda) + Number(pasoCantidad) + Number(enviado && ready);
  const total = ready ? elegidas.reduce((t, g) => t + precioUnidad(g) * unidadesDe(g), 0) : 0;

  const elegirPresentacion = (g: number) =>
    setSel((cur) => (cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]));
  const elegirTramo = (g: number, u: number) =>
    setTramos((cur) => ({ ...cur, [g]: cur[g] === u ? null : u }));
  // tocar lo ya elegido lo deselecciona
  const elegirMolienda = (g: number, v: string) =>
    setGrinds((cur) => ({ ...cur, [g]: cur[g] === v ? null : v }));
  const cambiarQty = (g: number, d: number) => {
    if (d < 0 && qtys[g] === 1) return setQtyHecha(false);
    setQtys((cur) => ({ ...cur, [g]: Math.max(1, cur[g] + d) }));
    setQtyHecha(true);
  };

  // el paso que falta, para la barra de progreso y el botón del celular
  const pendiente = nSel === 0 ? 1 : !molienda ? 2 : mayor && !tramosListos ? 3 : null;
  const hechos = [nSel > 0, molienda, pasoCantidad];

  const irAlPendiente = () => {
    if (!pendiente) return;
    const destino = [paso1, paso2, paso3][pendiente - 1].current;
    destino?.scrollIntoView({ behavior: "smooth", block: "center" });
    setResaltado(pendiente);
    window.setTimeout(() => setResaltado(null), 1100);
  };

  // celular: al completar un paso, si el siguiente quedó tapado, la pantalla baja lo justo
  useEffect(() => {
    const antes = anterior.current;
    anterior.current = { n: nSel, molienda };
    if (window.matchMedia(PIN_QUERY).matches) return;
    const destino =
      antes.n === 0 && nSel > 0 ? paso2.current : !antes.molienda && molienda ? paso3.current : null;
    if (!destino) return;
    const t = window.setTimeout(() => destino.scrollIntoView({ behavior: "smooth", block: "nearest" }), 160);
    return () => window.clearTimeout(t);
  }, [nSel, molienda]);

  const lineas = elegidas.map((g) => {
    const q = unidadesDe(g);
    return `${q} bolsa${q > 1 ? "s" : ""} de ${g} g en ${(grinds[g] ?? "").toLowerCase()}`;
  });
  const lista = lineas.length > 1 ? `${lineas.slice(0, -1).join(", ")} y ${lineas[lineas.length - 1]}` : lineas[0];
  const mensaje = ready
    ? mayor
      ? `Hola, quiero hacer un pedido al por mayor de Café Laurel: ${lista}.`
      : `Hola, quiero pedir de Café Laurel: ${lista}.`
    : "";

  return (
    <div className="relative min-h-full pin:flex pin:h-full pin:items-center">
      <BeanDrift granos={GRANOS} stage={stage} stageStep={9} stageByDepth={false} className="z-0" />

      {/* barra propia: el menú de la página queda detrás. En celular queda fija arriba */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-ink/10 bg-cream px-6 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] sm:px-10 pin:absolute pin:inset-x-0 pin:border-0 pin:bg-transparent pin:py-5">
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Volver a la página"
          className="press group flex items-center gap-3 rounded-full border border-ink/15 py-2 pl-2 pr-5 outline-none transition hover:border-ink focus-visible:ring-2 focus-visible:ring-rust/50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-cream transition-transform group-hover:-translate-x-0.5">
            <ArrowIcon className="h-4 w-4 rotate-180" />
          </span>
          <span className="micro">Volver</span>
        </button>
        <Image src="/images/logo-cafe-laurel-negro.png" alt="Café Laurel" width={760} height={307} className="h-7 w-auto sm:h-8" />

        {/* celular: progreso del pedido, siempre a la vista */}
        <div
          role="progressbar"
          aria-label="Progreso del pedido"
          aria-valuemin={0}
          aria-valuemax={3}
          aria-valuenow={hechos.filter(Boolean).length}
          className="absolute inset-x-6 -bottom-px flex gap-1.5 sm:inset-x-10 pin:hidden"
        >
          {hechos.map((h, i) => (
            <span key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-ink/10">
              <span
                className={`block h-full origin-left rounded-full bg-rust transition-transform duration-500 ease-out ${
                  h ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </span>
          ))}
        </div>
      </div>

      <motion.div
        className="relative z-10 grid w-full gap-8 px-6 pt-6 sm:px-10 pin:grid-cols-2 pin:items-center pin:gap-0 pin:pt-0 pin:[--w:calc(min(100svh-12rem,40rem)*0.8)]"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { transition: { duration: 0 } },
          show: { transition: { staggerChildren: 0.1, delayChildren: cambioDeModo ? 0.05 : 0.55 } },
        }}
      >
        {/* producto: la foto grande, en escritorio (en celular va una ficha compacta) */}
        <Entra className="hidden pin:flex pin:justify-center">
          <div className="relative aspect-[4/3] max-h-[38svh] w-full overflow-hidden bg-cream-deep pin:aspect-[4/5] pin:max-h-none pin:w-[var(--w)]">
            <Image
              src="/images/producto-bolsa-cafe-fondo-claro.jpg"
              alt="Bolsa de Café Laurel Huila, Finca Pedregal"
              fill
              loading="eager"
              sizes="(max-width: 1024px) 92vw, 36vw"
              className="object-cover object-[50%_58%] pin:object-center"
            />
          </div>
        </Entra>

        {/* información: con aire, un paso por renglón */}
        <div className="pin:flex pin:justify-center">
          <div className="flex w-full flex-col pin:max-w-[var(--w)]">
            <Entra className="hidden pin:block">
              <p className="micro text-rust">{mayor ? "Pedido al por mayor" : "Arma tu pedido"}</p>
              <h2 className="display mt-3 text-[clamp(2.25rem,3.2vw,2.75rem)]">Café Laurel</h2>
              <p className="mt-2 text-sm text-ink/55">Huila · Finca Pedregal · Caramelo, vainilla, melón dulce</p>
            </Entra>

            {/* celular: ficha compacta del producto (así los tres pasos caben en la pantalla) y un
                título que dice qué sigue, con la pareja tipográfica de la marca */}
            <Entra className="pin:hidden">
              <div className="flex items-center gap-4">
                <div className="relative h-[5.5rem] w-[4.4rem] shrink-0 overflow-hidden bg-cream-deep">
                  <Image
                    src="/images/producto-bolsa-cafe-fondo-claro.jpg"
                    alt="Bolsa de Café Laurel Huila"
                    fill
                    loading="eager"
                    sizes="80px"
                    className="object-cover object-[50%_52%]"
                  />
                </div>
                <div>
                  <p className="display text-[1.6rem] leading-none">Café Laurel</p>
                  <p className="mt-2 text-[0.9375rem] leading-snug text-ink/60">Huila · Finca Pedregal</p>
                  <p className="text-[0.9375rem] leading-snug text-ink/60">Caramelo, vainilla, melón dulce</p>
                </div>
              </div>
              <h2 className="mt-8 leading-[0.95]">
                <span className="display block text-[2.05rem]">{mayor ? "Pedido al por mayor" : "Arma tu pedido"}</span>
                <span className="display-script mt-1 block text-[1.7rem] text-rust">en tres pasos.</span>
              </h2>
            </Entra>

            <div className="mt-4">
              <Entra>
                <div ref={paso1} className="scroll-mb-32 scroll-mt-24">
                  <Paso n={1} titulo="Presentación" hecho={nSel > 0} resaltado={resaltado === 1}>
                    <p className="-mt-2 mb-3 text-sm text-ink/55">Elige una o las dos.</p>
                    <div role="group" aria-label="Presentación" className="grid grid-cols-2 gap-3">
                      {SIZES.map((s) => {
                        const active = sel.includes(s.gramos);
                        return (
                          <button
                            key={s.gramos}
                            role="checkbox"
                            aria-checked={active}
                            onClick={() => elegirPresentacion(s.gramos)}
                            className={`press rounded-md border px-5 py-4 text-left transition ${
                              active ? "border-rust bg-rust text-cream" : "border-ink/15 bg-cream hover:border-rust/60"
                            }`}
                          >
                            <span className="display block text-[clamp(2.1rem,3vw,2.75rem)] leading-none">
                              {s.gramos}
                              <span className="ml-0.5 text-[0.55em] normal-case">g</span>
                            </span>
                            <span className={`mt-2.5 block text-base font-medium ${active ? "text-cream/90" : "text-ink/60"}`}>
                              ${miles(precioUnidad(s.gramos))}
                              {mayor && <span className="text-sm font-normal opacity-75"> c/u</span>}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </Paso>
                </div>
              </Entra>

              <Entra>
                <div ref={paso2} className="scroll-mb-32 scroll-mt-24">
                  <Paso n={2} titulo="Molienda" hecho={molienda} resaltado={resaltado === 2} inline={nSel <= 1}>
                    {nSel <= 1 ? (
                      <Segmentado
                        etiqueta="Molienda"
                        opciones={GRINDS}
                        valor={nSel === 1 ? grinds[elegidas[0]] ?? null : null}
                        onChange={(v) => nSel === 1 && elegirMolienda(elegidas[0], v)}
                        deshabilitado={nSel === 0}
                      />
                    ) : (
                      <div className="space-y-3">
                        {elegidas.map((g) => (
                          <FilaTamano key={g} etiqueta={`${g} g`}>
                            <Segmentado
                              etiqueta={`Molienda de ${g} g`}
                              opciones={GRINDS}
                              valor={grinds[g] ?? null}
                              onChange={(v) => elegirMolienda(g, v)}
                            />
                          </FilaTamano>
                        ))}
                      </div>
                    )}
                  </Paso>
                </div>
              </Entra>

              <Entra>
                <div ref={paso3} className="scroll-mb-32 scroll-mt-24">
                  {mayor ? (
                    <Paso n={3} titulo="Unidades" hecho={tramosListos} resaltado={resaltado === 3}>
                      <div className="space-y-5">
                        {(nSel > 0 ? elegidas : [500]).map((g) => (
                          <div key={g} className={nSel === 0 ? "pointer-events-none opacity-45" : ""}>
                            {nSel > 1 && <p className="mb-2 text-[0.9375rem] font-semibold text-ink/70 pin:text-sm">{g} g · unidades</p>}
                            <div role="radiogroup" aria-label={`Unidades de ${g} g`} className="grid grid-cols-4 gap-2">
                              {MAYOR[g].map(([u, p]) => {
                                const active = tramos[g] === u;
                                const ahorro = Math.round((1 - p / SIZES.find((x) => x.gramos === g)!.price) * 100);
                                return (
                                  <button
                                    key={u}
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => elegirTramo(g, u)}
                                    className={`press rounded-md border px-2 text-center transition ${nSel > 1 ? "py-2" : "py-3"} ${
                                      active ? "border-rust bg-rust text-cream" : "border-ink/15 bg-cream hover:border-rust/60"
                                    }`}
                                  >
                                    <span className="block text-lg font-bold leading-none">{u}</span>
                                    {/* con dos presentaciones se compacta: sin la palabra "unidades" (la fila ya la dice) */}
                                    {nSel <= 1 && (
                                      <span className={`mt-1 block text-xs ${active ? "text-cream/80" : "text-ink/50"}`}>unidades</span>
                                    )}
                                    <span className={`block text-xs font-semibold ${nSel > 1 ? "mt-1" : "mt-2"} ${active ? "text-cream" : "text-rust"}`}>−{ahorro}%</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="mt-5 text-sm text-ink/55">
                        ¿Parte en grano y parte molido? Cuéntanoslo por WhatsApp y lo ajustamos.
                      </p>
                    </Paso>
                  ) : (
                    <Paso n={3} titulo="Cantidad" hecho={pasoCantidad} inline={nSel <= 1}>
                      {nSel <= 1 ? (
                        <Contador
                          valor={nSel === 1 ? qtys[elegidas[0]] : 1}
                          onMenos={() => nSel === 1 && cambiarQty(elegidas[0], -1)}
                          onMas={() => nSel === 1 && cambiarQty(elegidas[0], 1)}
                          deshabilitado={nSel === 0}
                        />
                      ) : (
                        <div className="space-y-3">
                          {elegidas.map((g) => (
                            <FilaTamano key={g} etiqueta={`${g} g`}>
                              <Contador
                                valor={qtys[g]}
                                onMenos={() => cambiarQty(g, -1)}
                                onMas={() => cambiarQty(g, 1)}
                              />
                            </FilaTamano>
                          ))}
                        </div>
                      )}
                    </Paso>
                  )}
                </div>
              </Entra>
            </div>

            {/* cambio de modo, discreto. En escritorio va debajo del botón; en celular, encima de la barra */}
            <Entra className="mt-5 text-center text-[0.9375rem] text-ink/60 pin:order-last pin:text-sm pin:text-ink/55">
              {mayor ? (
                <>
                  ¿Más de 25 unidades? Escríbenos y lo cotizamos.{" "}
                  <button
                    onClick={() => setModo("casa")}
                    className="-my-2.5 inline-block py-2.5 font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink"
                  >
                    Volver a compra individual
                  </button>
                </>
              ) : (
                <>
                  ¿Tienes un negocio?{" "}
                  <button
                    onClick={() => setModo("mayor")}
                    className="-my-2.5 inline-block py-2.5 font-semibold text-ink underline decoration-rust/50 underline-offset-4 transition-colors hover:text-rust"
                  >
                    Compra al por mayor desde 10 unidades
                  </button>
                </>
              )}
            </Entra>

            {/* la acción principal: en celular, fija abajo, en la zona del pulgar */}
            <div className="sticky bottom-0 z-20 -mx-6 mt-5 border-t border-ink/10 bg-cream px-6 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:-mx-10 sm:px-10 pin:static pin:mx-0 pin:mt-7 pin:border-0 pin:bg-transparent pin:p-0">
              <Entra>
                {ready ? (
                  <a
                    href={waLink(mensaje)}
                    onClick={() => setEnviado(true)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press group flex w-full items-center justify-between rounded-full bg-ink py-3.5 pl-6 pr-3.5 text-cream transition hover:bg-rust"
                  >
                    <span className="flex items-center gap-3">
                      <WhatsAppIcon className="h-5 w-5" />
                      <span className="micro whitespace-nowrap">
                        Pedir<span className="hidden sm:inline">{mayor ? " al por mayor" : " por WhatsApp"}</span>
                      </span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="text-base font-semibold tabular-nums">${miles(total)}</span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink transition-transform group-hover:translate-x-0.5">
                        <ArrowIcon className="h-4 w-4" />
                      </span>
                    </span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={irAlPendiente}
                    aria-disabled
                    className="press flex w-full items-center gap-3 rounded-full bg-ink/[0.06] py-3.5 pl-6 pr-3.5 text-left text-ink/45 transition pin:pointer-events-none"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    <span className="micro whitespace-nowrap">Completa tu pedido</span>
                  </button>
                )}
              </Entra>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/** Entrada escalonada de cada bloque al abrir el pedido. */
function Entra({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 26, transition: { duration: 0 } },
        show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE_OUT_EXPO } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Un paso del pedido: número (que se marca al completarlo), nombre y su control. Sin líneas: el aire separa. */
function Paso({
  n,
  titulo,
  hecho,
  resaltado = false,
  inline = false,
  children,
}: {
  n: number;
  titulo: string;
  hecho: boolean;
  resaltado?: boolean;
  inline?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`py-6 transition-colors duration-500 pin:py-7 ${resaltado ? "bg-rust/[0.07]" : "bg-transparent"} ${
        inline ? "flex items-center justify-between gap-6" : ""
      }`}
    >
      <p className={`flex items-center gap-3 ${inline ? "" : "mb-4"}`}>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.7rem] font-bold transition-colors ${
            hecho ? "bg-rust text-cream" : "border border-ink/20 bg-cream text-ink/50"
          }`}
        >
          {hecho ? "✓" : n}
        </span>
        <span className="text-[0.9375rem] font-semibold pin:text-sm">{titulo}</span>
      </p>
      {children}
    </div>
  );
}

/** Una fila "500 g ........ control", para cuando hay dos presentaciones en el pedido. */
function FilaTamano({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-[0.9375rem] font-semibold text-ink/70 pin:text-sm">{etiqueta}</span>
      {children}
    </div>
  );
}

/** Selector de dos opciones (Grano | Molido). */
function Segmentado({
  etiqueta,
  opciones,
  valor,
  onChange,
  deshabilitado = false,
}: {
  etiqueta: string;
  opciones: string[];
  valor: string | null;
  onChange: (v: string) => void;
  deshabilitado?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={etiqueta}
      className={`grid grid-cols-2 gap-1 rounded-full border border-ink/15 bg-cream p-1 ${deshabilitado ? "pointer-events-none opacity-45" : ""}`}
    >
      {opciones.map((o) => (
        <button
          key={o}
          role="radio"
          aria-checked={valor === o}
          onClick={() => onChange(o)}
          className={`press min-h-11 rounded-full px-5 text-sm font-semibold transition pin:min-h-0 pin:py-2 ${
            valor === o ? "bg-rust text-cream" : "text-ink/60 hover:text-ink"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/** − 1 + */
function Contador({
  valor,
  onMenos,
  onMas,
  deshabilitado = false,
}: {
  valor: number;
  onMenos: () => void;
  onMas: () => void;
  deshabilitado?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1 rounded-full border border-ink/15 bg-cream p-1 ${deshabilitado ? "pointer-events-none opacity-45" : ""}`}
    >
      <Stepper onClick={onMenos} label="−" />
      <span className="w-8 text-center text-base font-semibold tabular-nums" aria-live="polite">
        {valor}
      </span>
      <Stepper onClick={onMas} label="+" />
    </div>
  );
}

function Stepper({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label === "+" ? "Sumar" : "Restar"}
      className="press flex h-11 w-11 items-center justify-center rounded-full text-lg transition hover:bg-ink hover:text-cream pin:h-8 pin:w-8"
    >
      {label}
    </button>
  );
}
