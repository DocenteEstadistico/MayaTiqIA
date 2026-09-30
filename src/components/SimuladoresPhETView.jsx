import React, { useState } from 'react';
import { 
  FlaskConical, Sliders, Play, RotateCcw, Sparkles, CheckCircle2, 
  HelpCircle, Eye, Calculator, ChevronRight, Award, Zap, Compass, PieChart, Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SimuladoresPhETView({ perfilActual = 'bachillerato', onVolver }) {
  const [simuladorActivo, setSimuladorActivo] = useState('balanza'); // 'balanza' | 'fracciones' | 'lineal' | 'trigonometria'

  // 1. Estado para Balanza de Ecuaciones
  const [pesoIzqX, setPesoIzqX] = useState(2); // 2x
  const [pesoIzqNum, setPesoIzqNum] = useState(5); // + 5
  const [pesoDerNum, setPesoDerNum] = useState(15); // = 15
  const [valorXGuess, setValorXGuess] = useState(1);

  // 2. Estado para Fracciones y Pasteles
  const [numerador, setNumerador] = useState(3);
  const [denominador, setDenominador] = useState(8);

  // 3. Estado para Plano Cartesiano (y = mx + b)
  const [pendienteM, setPendienteM] = useState(2);
  const [interseccionB, setInterseccionB] = useState(1);

  // 4. Estado para Trigonometría (Ángulo theta en grados)
  const [anguloGrad, setAnguloGrad] = useState(30);

  const dispararConfeti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#059669', '#fbbf24', '#0d9488']
    });
  };

  // Cálculo de la balanza
  const totalIzq = pesoIzqX * valorXGuess + pesoIzqNum;
  const totalDer = pesoDerNum;
  const estaEquilibrado = totalIzq === totalDer;

  return (
    <div className="space-y-8 animate-stagger-in pb-12">
      {/* Encabezado del Laboratorio PhET */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-amber-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-4 top-0 opacity-15 transform translate-x-8 -translate-y-4 pointer-events-none">
          <FlaskConical className="w-80 h-80 text-emerald-300 animate-float" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            Laboratorio Interactivo de Simulaciones (Estilo PhET)
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-amber-300">
            Explorador Visual & Manipulativos Matemáticos
          </h1>
          
          <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
            Experimenta con modelos interactivos en tiempo real. Mueve controles, equilibra ecuaciones, ajusta fracciones y visualiza funciones trigonométricas en vivo.
          </p>
        </div>
      </div>

      {/* Selector de Simuladores estilo PhET Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Balanza */}
        <button
          onClick={() => setSimuladorActivo('balanza')}
          className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between space-y-3 ${
            simuladorActivo === 'balanza'
              ? 'border-emerald-500 bg-emerald-500/10 shadow-lg scale-105'
              : 'border-emerald-900/20 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/40 hover:border-emerald-400'
          }`}
        >
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 w-fit">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">Balanza de Ecuaciones</h3>
            <p className="text-xs text-gray-500 dark:text-emerald-300/70 mt-1">
              Despeja la incógnita $X$ equilibrando pesos en tiempo real.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            Explorar Simulación <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </button>

        {/* Card 2: Fracciones */}
        <button
          onClick={() => setSimuladorActivo('fracciones')}
          className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between space-y-3 ${
            simuladorActivo === 'fracciones'
              ? 'border-emerald-500 bg-emerald-500/10 shadow-lg scale-105'
              : 'border-emerald-900/20 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/40 hover:border-emerald-400'
          }`}
        >
          <div className="p-3 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 w-fit">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">Fracciones & Pasteles</h3>
            <p className="text-xs text-gray-500 dark:text-emerald-300/70 mt-1">
              Visualiza sectores circulares y porciones proporcionales.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            Explorar Simulación <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </button>

        {/* Card 3: Funciones Lineales */}
        <button
          onClick={() => setSimuladorActivo('lineal')}
          className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between space-y-3 ${
            simuladorActivo === 'lineal'
              ? 'border-emerald-500 bg-emerald-500/10 shadow-lg scale-105'
              : 'border-emerald-900/20 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/40 hover:border-emerald-400'
          }`}
        >
          <div className="p-3 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400 w-fit">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">Plano y Pendiente $y=mx+b$</h3>
            <p className="text-xs text-gray-500 dark:text-emerald-300/70 mt-1">
              Varía la pendiente $m$ y el corte $b$ en el gráfico cartesiano.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            Explorar Simulación <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </button>

        {/* Card 4: Trigonometría */}
        <button
          onClick={() => setSimuladorActivo('trigonometria')}
          className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between space-y-3 ${
            simuladorActivo === 'trigonometria'
              ? 'border-emerald-500 bg-emerald-500/10 shadow-lg scale-105'
              : 'border-emerald-900/20 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/40 hover:border-emerald-400'
          }`}
        >
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 w-fit">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">Triángulo & Razones Trig</h3>
            <p className="text-xs text-gray-500 dark:text-emerald-300/70 mt-1">
              Ajusta el ángulo $\theta$ para calcular $\sin$, $\cos$ y $\tan$.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            Explorar Simulación <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>

      {/* ÁREA INTERACTIVA PRINCIPAL DEL SIMULADOR SELECCIONADO */}
      <div className="bg-white dark:bg-emerald-950/30 rounded-3xl border border-emerald-500/20 p-6 md:p-8 shadow-xl">
        {simuladorActivo === 'balanza' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                  ⚖️ Laboratorio 1: Balanza de Ecuaciones
                </h2>
                <p className="text-sm text-gray-600 dark:text-emerald-200/70">
                  Ecuación actual: <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{pesoIzqX}X + {pesoIzqNum} = {pesoDerNum}</span>
                </p>
              </div>
              {estaEquilibrado && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold rounded-xl animate-pulse">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ¡Balanza Equilibrada! X = {valorXGuess}
                </div>
              )}
            </div>

            {/* Representación Visual de la Balanza */}
            <div className="relative bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-8 min-h-[260px] flex flex-col items-center justify-center">
              {/* Barra de la Balanza que se inclina según totalIzq y totalDer */}
              <div 
                className="w-full max-w-xl h-4 bg-emerald-700 dark:bg-emerald-500 rounded-full transition-transform duration-500 relative flex justify-between items-center px-8"
                style={{
                  transform: `rotate(${Math.max(-12, Math.min(12, (totalDer - totalIzq) * 1.5))}deg)`
                }}
              >
                {/* Plato Izquierdo */}
                <div className="absolute -left-4 -top-24 flex flex-col items-center">
                  <div className="bg-white dark:bg-emerald-900 border-2 border-amber-500 rounded-xl p-3 shadow-md flex items-center gap-2 min-w-[120px] justify-center">
                    <div className="flex gap-1">
                      {Array.from({ length: pesoIzqX }).map((_, i) => (
                        <span key={i} className="px-2 py-1 bg-amber-500 text-white font-extrabold rounded-lg text-xs shadow">
                          X
                        </span>
                      ))}
                    </div>
                    <span className="font-bold text-gray-700 dark:text-amber-200">+ {pesoIzqNum}kg</span>
                  </div>
                  <div className="w-0.5 h-16 bg-emerald-600 dark:bg-emerald-400"></div>
                  <div className="w-28 h-3 bg-emerald-800 dark:bg-emerald-600 rounded-full"></div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 mt-1">Peso: {totalIzq}kg</span>
                </div>

                {/* Pivot Central */}
                <div className="w-8 h-8 bg-amber-500 rounded-full border-4 border-emerald-900 mx-auto -bottom-4 relative"></div>

                {/* Plato Derecho */}
                <div className="absolute -right-4 -top-24 flex flex-col items-center">
                  <div className="bg-white dark:bg-emerald-900 border-2 border-emerald-500 rounded-xl p-3 shadow-md min-w-[120px] text-center">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-300 text-lg">{pesoDerNum} kg</span>
                  </div>
                  <div className="w-0.5 h-16 bg-emerald-600 dark:bg-emerald-400"></div>
                  <div className="w-28 h-3 bg-emerald-800 dark:bg-emerald-600 rounded-full"></div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 mt-1">Peso: {totalDer}kg</span>
                </div>
              </div>

              {/* Base de Soporte */}
              <div className="w-16 h-20 bg-gradient-to-b from-emerald-800 to-emerald-950 rounded-t-xl mt-12"></div>
            </div>

            {/* Controles Manipulativos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-gray-50 dark:bg-emerald-900/30 p-6 rounded-2xl border border-emerald-500/20">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-emerald-200 uppercase tracking-wider block mb-2">
                  Valor de X: <span className="text-amber-500 font-extrabold text-base">{valorXGuess}</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={valorXGuess} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setValorXGuess(val);
                    if ((pesoIzqX * val + pesoIzqNum) === pesoDerNum) dispararConfeti();
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-emerald-200 uppercase tracking-wider block mb-2">
                  Coeficiente de X: <span className="text-emerald-500 font-extrabold text-base">{pesoIzqX}</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={pesoIzqX} 
                  onChange={(e) => setPesoIzqX(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-emerald-200 uppercase tracking-wider block mb-2">
                  Peso Constante Der: <span className="text-teal-500 font-extrabold text-base">{pesoDerNum}kg</span>
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="30" 
                  value={pesoDerNum} 
                  onChange={(e) => setPesoDerNum(parseInt(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {simuladorActivo === 'fracciones' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                  🥧 Laboratorio 2: Fracciones & Pasteles
                </h2>
                <p className="text-sm text-gray-600 dark:text-emerald-200/70">
                  Fracción actual: <span className="font-mono font-extrabold text-2xl text-amber-500">{numerador} / {denominador}</span> = {(numerador / denominador).toFixed(3)} ({(numerador / denominador * 100).toFixed(1)}%)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Gráfico Circular SVG de Fracción */}
              <div className="flex flex-col items-center justify-center bg-emerald-50/50 dark:bg-emerald-900/20 p-8 rounded-2xl border border-emerald-500/20">
                <svg viewBox="0 0 100 100" className="w-48 h-48 transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="#e2e8f0" stroke="#059669" strokeWidth="2" />
                  {/* Renderizado de porciones circulares */}
                  {Array.from({ length: denominador }).map((_, i) => {
                    const angle = (360 / denominador);
                    const startAngle = i * angle;
                    const endAngle = (i + 1) * angle;
                    const isSelected = i < numerador;

                    const x1 = 50 + 40 * Math.cos((Math.PI * startAngle) / 180);
                    const y1 = 50 + 40 * Math.sin((Math.PI * startAngle) / 180);
                    const x2 = 50 + 40 * Math.cos((Math.PI * endAngle) / 180);
                    const y2 = 50 + 40 * Math.sin((Math.PI * endAngle) / 180);

                    const largeArcFlag = angle > 180 ? 1 : 0;
                    const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                    return (
                      <path
                        key={i}
                        d={pathData}
                        fill={isSelected ? '#f59e0b' : '#10b981'}
                        opacity={isSelected ? 0.9 : 0.25}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="transition-all duration-300 hover:opacity-100 cursor-pointer"
                      />
                    );
                  })}
                </svg>
                <span className="text-xs font-bold text-gray-500 dark:text-emerald-300 mt-4">
                  {numerador} de {denominador} partes seleccionadas
                </span>
              </div>

              {/* Controles de Numerador y Denominador */}
              <div className="space-y-6 bg-gray-50 dark:bg-emerald-900/30 p-6 rounded-2xl border border-emerald-500/20">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-emerald-200 uppercase tracking-wider block mb-2">
                    Numerador (Partes tomadas): <span className="text-amber-500 font-extrabold text-lg">{numerador}</span>
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max={denominador} 
                    value={numerador} 
                    onChange={(e) => setNumerador(parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-emerald-200 uppercase tracking-wider block mb-2">
                    Denominador (Partes totales): <span className="text-emerald-500 font-extrabold text-lg">{denominador}</span>
                  </label>
                  <input 
                    type="range" 
                    min="2" 
                    max="16" 
                    value={denominador} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setDenominador(val);
                      if (numerador > val) setNumerador(val);
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {simuladorActivo === 'lineal' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                  📈 Laboratorio 3: Plano Cartesiano y Pendiente
                </h2>
                <p className="text-sm text-gray-600 dark:text-emerald-200/70">
                  Función Lineal: <span className="font-mono font-extrabold text-xl text-sky-500">y = {pendienteM}x {interseccionB >= 0 ? `+ ${interseccionB}` : `- ${Math.abs(interseccionB)}`}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Gráfico SVG de Plano Cartesiano */}
              <div className="bg-emerald-950 p-6 rounded-2xl flex flex-col items-center justify-center border border-emerald-500/30">
                <svg viewBox="-50 -50 100 100" className="w-64 h-64 overflow-visible">
                  {/* Grid Lines */}
                  {Array.from({ length: 11 }).map((_, i) => {
                    const coord = (i - 5) * 10;
                    return (
                      <g key={i}>
                        <line x1={coord} y1="-50" x2={coord} y2="50" stroke="#054f3b" strokeWidth="0.5" />
                        <line x1="-50" y1={coord} x2="50" y2={coord} stroke="#054f3b" strokeWidth="0.5" />
                      </g>
                    );
                  })}
                  {/* Ejes X e Y */}
                  <line x1="-50" y1="0" x2="50" y2="0" stroke="#34d399" strokeWidth="1.5" />
                  <line x1="0" y1="-50" x2="0" y2="50" stroke="#34d399" strokeWidth="1.5" />
                  
                  {/* Línea de la función y = mx + b */}
                  {(() => {
                    const x1 = -40;
                    const y1 = -(pendienteM * x1 + interseccionB * 5);
                    const x2 = 40;
                    const y2 = -(pendienteM * x2 + interseccionB * 5);
                    return (
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                    );
                  })()}
                </svg>
                <span className="text-xs font-bold text-emerald-300 mt-2">
                  Pendiente m = {pendienteM} | Intersección en Y = (0, {interseccionB})
                </span>
              </div>

              {/* Controles de m y b */}
              <div className="space-y-6 bg-gray-50 dark:bg-emerald-900/30 p-6 rounded-2xl border border-emerald-500/20">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-emerald-200 uppercase tracking-wider block mb-2">
                    Pendiente m (Inclinación): <span className="text-sky-500 font-extrabold text-lg">{pendienteM}</span>
                  </label>
                  <input 
                    type="range" 
                    min="-5" 
                    max="5" 
                    step="0.5"
                    value={pendienteM} 
                    onChange={(e) => setPendienteM(parseFloat(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-emerald-200 uppercase tracking-wider block mb-2">
                    Corte en Y (b): <span className="text-amber-500 font-extrabold text-lg">{interseccionB}</span>
                  </label>
                  <input 
                    type="range" 
                    min="-5" 
                    max="5" 
                    value={interseccionB} 
                    onChange={(e) => setInterseccionB(parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {simuladorActivo === 'trigonometria' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                  📐 Laboratorio 4: Razones Trigonométricas
                </h2>
                <p className="text-sm text-gray-600 dark:text-emerald-200/70">
                  Ángulo $\theta = {anguloGrad}^\circ$
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Gráfico del Triángulo Rectángulo */}
              <div className="bg-emerald-950 p-6 rounded-2xl flex flex-col items-center justify-center border border-emerald-500/30">
                <svg viewBox="0 0 200 150" className="w-64 h-48 overflow-visible">
                  {(() => {
                    const rad = (anguloGrad * Math.PI) / 180;
                    const base = 120;
                    const altura = base * Math.tan(rad);
                    const hyp = Math.sqrt(base * base + altura * altura);

                    return (
                      <g>
                        {/* Triángulo */}
                        <polygon 
                          points={`30,120 ${30 + base},120 30,${120 - Math.min(100, altura)}`} 
                          fill="rgba(16, 185, 129, 0.2)" 
                          stroke="#10b981" 
                          strokeWidth="2.5" 
                        />
                        {/* Indicador de Ángulo */}
                        <text x={30 + base - 25} y="115" fill="#fbbf24" fontSize="11" fontWeight="bold">
                          {anguloGrad}°
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Valores Calculados */}
              <div className="space-y-4 bg-gray-50 dark:bg-emerald-900/30 p-6 rounded-2xl border border-emerald-500/20">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-emerald-200 uppercase tracking-wider block mb-2">
                    Ajustar Ángulo $\theta$: <span className="text-purple-500 font-extrabold text-lg">{anguloGrad}°</span>
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="80" 
                    value={anguloGrad} 
                    onChange={(e) => setAnguloGrad(parseInt(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="p-3 bg-white dark:bg-emerald-900/60 rounded-xl border border-emerald-500/30 text-center">
                    <span className="text-xs font-bold text-gray-500 dark:text-emerald-300 block">sen({anguloGrad}°)</span>
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                      {Math.sin((anguloGrad * Math.PI) / 180).toFixed(3)}
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-emerald-900/60 rounded-xl border border-emerald-500/30 text-center">
                    <span className="text-xs font-bold text-gray-500 dark:text-emerald-300 block">cos({anguloGrad}°)</span>
                    <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                      {Math.cos((anguloGrad * Math.PI) / 180).toFixed(3)}
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-emerald-900/60 rounded-xl border border-emerald-500/30 text-center">
                    <span className="text-xs font-bold text-gray-500 dark:text-emerald-300 block">tan({anguloGrad}°)</span>
                    <span className="text-base font-extrabold text-purple-600 dark:text-purple-400">
                      {Math.tan((anguloGrad * Math.PI) / 180).toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
