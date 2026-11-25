import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

import pegassusImg from '../assets/pegasus/pegassus.jpg';
import agroImg from '../assets/pegasus/agro.jpg';
import agiImg from '../assets/pegasus/agi.jpg';
import aulaImg from '../assets/pegasus/aula.jpg';

const IMG = { pegassus: pegassusImg, agro: agroImg, agi: agiImg, aula: aulaImg };

const BANK = {
  campo: {
    role: 'Ing. encargado de módulo',
    greet: 'Dime rápido, ¿qué pasa en el módulo?',
    qa: [
      { q: 'Las hojas del maíz se están poniendo amarillas', keys: ['amarilla','amarillo','hoja','maíz','maiz','clorosis'], a: 'A ver, tres sospechas: le falta nitrógeno, le sobra agua, o tiene plaga. Revisa primero el suelo — ¿está encharcado? Si no, córtame una hoja y tráela al módulo para verla al microscopio.' },
      { q: '¿Cuánto riego esta planta hoy?', keys: ['riego','regar','agua','cuánto','cuanto'], a: 'Mete el dedo dos nudillos en la tierra. Si sale seco, riega hasta que escurra por abajo. Si sale húmedo, no toques nada hoy. Regar de más mata más plantas que regar de menos.' },
      { q: 'La vaca no se quiso parar hoy', keys: ['vaca','animal','parar','enferma','ganado'], a: 'Eso no se consulta conmigo, eso se avisa ya al encargado de ganadería. Vete corriendo y luego me cuentas qué dijo.' },
      { q: 'Vi gusanos en las hojas del tomate', keys: ['gusano','plaga','insecto','bicho','tomate'], a: '¿Cuántos, de qué color? Tómale foto y me la enseñas. Mientras, no toques las plantas de al lado con las mismas manos.' },
      { q: '¿Ya puedo cosechar el tomate?', keys: ['cosechar','cosecha','tomate','maduro','listo'], a: 'Tiene que estar firme, rojo parejo, y despegarse del tallo sin jalar fuerte. Si todavía resiste, déjalo dos días más.' },
      { q: '¿Cómo preparo la tierra para sembrar?', keys: ['preparar','tierra','sembrar','siembra','surco','arar','preparación'], a: 'Primero quita piedras y raíces viejas. Afloja con pico o arado hasta unos 30 cm. Si está muy dura, mete abono maduro y mezcla. La tierra tiene que desmoronarse en la mano — ni polvo ni lodo.' },
      { q: '¿Cuándo se siembra el frijol?', keys: ['frijol','sembrar','cuándo','cuando','temporada','lluvia'], a: 'Al inicio de la temporada de lluvias, cuando el suelo ya está húmedo pero no encharcado. En seco no germina; en lodo se pudre la semilla. Si tienes duda, mete el dedo — tiene que salir húmedo, no mojado.' },
      { q: '¿Cómo sé si el suelo es bueno?', keys: ['suelo','bueno','calidad','fértil','fertil'], a: 'Tres señales rápidas: se desmorona en la mano (no se apelmaza), huele a tierra mojada (no a podrido), y tiene lombrices. Si cumple las tres, está vivo. Si no, hay que mejorarlo con abono.' },
      { q: 'Las plantas de chile se están marchitando', keys: ['chile','marchitar','marchita','caída','caida','triste'], a: 'Revisa en este orden: ¿regaste hoy? ¿les pega sol directo todo el día? ¿ves bichos en el tallo? Dime qué encuentras y seguimos. Si están marchitas desde ayer, probablemente es la raíz, y eso ya es serio.' },
      { q: '¿Cuántas veces al día se ordeña la vaca?', keys: ['ordeñar','ordeña','leche','veces','ordeño'], a: 'Dos veces: temprano en la mañana (antes del desayuno) y en la tarde. Siempre a la misma hora — la vaca produce mejor con horario fijo. Si se te pasa, la ubre se inflama y el animal sufre.' },
      { q: '¿Qué le doy de comer a los pollos?', keys: ['pollo','pollos','gallina','comer','alimento','comida'], a: 'Concentrado de postura en la mañana, maíz quebrado en la tarde, y agua limpia todo el día. Les gustan restos de verdura del comedor, pero nunca cáscara de cítrico ni comida salada — les cae mal.' },
      { q: '¿Cómo sé si el cerdo está sano?', keys: ['cerdo','marrano','sano','enfermo','chancho'], a: 'Cerdo sano: come con ganas, se mueve, ojos brillantes, cola curva. Cerdo enfermo: no come, se echa en un rincón, tose, tiembla. Si ves cualquiera de esas señales, avisa al encargado hoy, no mañana.' },
      { q: 'Mi planta tiene manchas negras en las hojas', keys: ['mancha','manchas','negra','negras','hongo'], a: 'Probablemente es hongo. ¿Las manchas son redondas o irregulares? ¿Hay telilla blanca debajo? Mientras me contestas, no riegues desde arriba — mojar las hojas empeora el hongo. Riega directo a la raíz.' },
      { q: '¿Cómo se hace compost?', keys: ['compost','abono','orgánico','organico','cáscara','cascara','desecho'], a: 'Por capas: una de cáscaras y restos verdes, una de hojas secas o cartón, una de tierra. Repites. Mojas poco y volteas cada semana. En 2-3 meses lo tienes — debe verse negro y oler a bosque, no a basura.' },
      { q: 'Se escapó un animal del corral', keys: ['escapó','escapo','escapar','corral','suelto','fugar'], a: 'Primero: ¿qué animal y hace cuánto? No lo persigas corriendo, se asusta más. Avisa al encargado YA, cierra puertas que puedas, y si lo ves, acércate despacio con comida en la mano. Nunca por atrás.' },
      { q: '¿Cuándo se abona el maíz?', keys: ['fertilizante','abono','maíz','maiz','cuándo','cuando','fertilizar'], a: 'Dos aplicaciones básicas: a los 20 días de sembrado (cuando ya tiene 4-5 hojas) y a los 40 días (antes de que floree). Si te pasas, la planta crece mucho pero no da mazorca buena.' },
      { q: '¿Qué es el pulgón?', keys: ['pulgón','pulgon','áfido','afido','verde','pequeño','pequeno'], a: 'Bichitos verdes o negros muy chiquitos, pegados en racimo bajo las hojas tiernas. Las hojas se enrollan y se ponen pegajosas. Si los encuentras temprano, con agua jabonosa rociada los quitas. Si ya está invadido, avísame.' },
      { q: '¿Qué hago con el estiércol?', keys: ['estiércol','estiercol','popó','popo','limpiar','boñiga'], a: 'No se tira, se guarda. Una vez a la semana lo llevamos al montón de compost, donde reposa 2-3 meses antes de ir al surco. Fresco quema las raíces; reposado es el mejor abono que tenemos.' },
      { q: 'La tierra está muy dura', keys: ['dura','compacta','apelmazada','endurecida'], a: 'Afloja con pico primero, luego mezcla hojarasca, estiércol maduro y un poco de arena si tienes. En dos semanas aflojas otra vez. Lo que mata la tierra dura es la constancia, no la fuerza de un día.' },
      { q: '¿Cada cuánto se desmaleza?', keys: ['maleza','desmaleza','monte','yerbas','hierba','limpiar surco'], a: 'En lluvias, cada 15 días; en seca, cada mes. Si esperas más, la maleza le roba agua y abono a tu cultivo. Mejor 20 minutos cada quincena que una batalla de 3 horas al mes.' },
    ],
  },
  clases: {
    role: 'Ing. profesor',
    greet: '¿En qué tema te trabaste? Dime y vamos paso por paso.',
    qa: [
      { q: '¿Cómo balanceo H₂ + O₂ → H₂O?', keys: ['balancear','balanceo','ecuación','ecuacion','química','quimica','h2o','h2','o2'], a: 'A ver, cuenta primero los átomos de cada lado. ¿Cuántos hidrógenos tienes a la izquierda y cuántos a la derecha? Dime y seguimos.' },
      { q: '¿Qué es la fotosíntesis?', keys: ['fotosíntesis','fotosintesis','planta','clorofila','sol'], a: 'Es cómo la planta cocina su propia comida. Agarra agua de la raíz, CO₂ del aire, y con la luz del sol los convierte en azúcar y suelta oxígeno. Eso verde en las hojas (la clorofila) es la cocina.' },
      { q: 'No le entiendo a las derivadas', keys: ['derivada','cálculo','calculo','pendiente','limite','límite'], a: 'Imagínate que vas manejando. La velocidad es qué tan rápido cambia tu posición. La derivada es exactamente eso: qué tan rápido cambia algo. ¿En qué problema estás trabado?' },
      { q: '¿Diferencia entre mitosis y meiosis?', keys: ['mitosis','meiosis','célula','celula','división'], a: 'Mitosis = una célula hace dos iguales a ella (crecimiento, reparación). Meiosis = una célula hace cuatro con la mitad de la info (sólo para reproducción). Piénsalo así: mitosis es fotocopia, meiosis es receta para hacer algo nuevo.' },
      { q: 'Me dijeron que calcule el pH y no sé por dónde empezar', keys: ['ph','ácido','acido','base','concentración','concentracion','disolución'], a: 'Tranquilo. Dime qué disolución te dieron y qué dato tienes de concentración. Con eso lo sacamos juntos. (Si me pides la respuesta ya, te va a ir mal en el examen — mejor te enseño el camino.)' },
      { q: '¿Qué es un átomo?', keys: ['átomo','atomo','partícula','particula'], a: 'Es la pieza más chiquita que mantiene las propiedades de un elemento. Tiene un núcleo con protones y neutrones, y electrones girando alrededor. Piénsalo como un sistema solar en miniatura — pero mucho más vacío de lo que te imaginas.' },
      { q: '¿Para qué sirve la tabla periódica?', keys: ['tabla','periódica','periodica','elementos'], a: 'Es el mapa de todos los elementos químicos, ordenados por cómo se comportan. Si entiendes el orden (grupos y periodos), puedes predecir cómo van a reaccionar. ¿Qué elemento estás viendo? Vamos a leerlo juntos.' },
      { q: '¿Qué son los enlaces químicos?', keys: ['enlace','enlaces','iónico','ionico','covalente'], a: 'Es cómo se agarran los átomos entre sí para formar moléculas. Hay varios tipos — iónico (se roban electrones), covalente (los comparten) y metálico (los sueltan como mar de electrones). ¿Cuál estás viendo?' },
      { q: '¿Qué es la respiración celular?', keys: ['respiración celular','respiracion celular','atp','mitocondria'], a: 'Es lo contrario de la fotosíntesis. La célula agarra azúcar y oxígeno, los rompe, y saca energía (ATP) para funcionar. Sobran CO₂ y agua, que respiras y sudas. Pasa en la mitocondria.' },
      { q: '¿Qué es el ADN?', keys: ['adn','dna','gen','genética','genetica','cromosoma'], a: 'Es el manual de instrucciones de cada ser vivo, escrito con 4 letras químicas: A, T, C, G. Está enrollado en cromosomas dentro del núcleo. Cada tramo que contiene una instrucción se llama gen.' },
      { q: '¿Cómo se clasifican los seres vivos?', keys: ['clasificar','clasificación','clasificacion','reino','taxonomía','taxonomia'], a: 'En 5 reinos: monera (bacterias), protista (algas, protozoos), hongos, plantas y animales. Luego baja: filo, clase, orden, familia, género, especie. Nosotros somos Homo sapiens — género y especie.' },
      { q: '¿Qué es un ecosistema?', keys: ['ecosistema','biota','cadena alimenticia','ambiente'], a: 'Un conjunto de seres vivos (plantas, animales, bacterias) más el ambiente donde viven (suelo, agua, clima) interactuando entre sí. La huerta de la escuela es un ecosistema chiquito. ¿Qué parte quieres entender primero?' },
      { q: '¿Cómo resuelvo una ecuación de segundo grado?', keys: ['cuadrática','cuadratica','segundo grado','ax2','fórmula general','formula general'], a: 'Fórmula general: x = (-b ± √(b²-4ac)) / 2a. Pero antes de aplicarla, ¿probaste factorizar? A veces sale más rápido. Mándame tu ecuación y vemos cuál camino conviene.' },
      { q: '¿Qué es un logaritmo?', keys: ['logaritmo','log','ln','exponencial'], a: 'Es la pregunta inversa a la potencia. Si 10² = 100, entonces log(100) = 2. O sea, el logaritmo te dice "a qué potencia tengo que elevar la base para llegar a este número". ¿En qué problema lo estás usando?' },
      { q: '¿Para qué sirve la trigonometría?', keys: ['trigonometría','trigonometria','seno','coseno','tangente'], a: 'Para calcular distancias y ángulos sin medirlos directamente. En el campo sirve para sacar la altura de un árbol sin treparlo, o el ancho de un río sin cruzarlo. Es semejanza de triángulos escondida en funciones.' },
      { q: '¿Cómo saco el área de un triángulo?', keys: ['área','area','triángulo','triangulo','base','altura'], a: 'Base por altura dividido entre dos: A = (b × h) / 2. La trampa está en "altura" — no es cualquier lado, es la perpendicular desde la base al vértice opuesto. Dime tu triángulo y vemos cuál es cuál.' },
      { q: '¿Qué es una función?', keys: ['función','funcion','f(x)','variable'], a: 'Es una regla que a cada entrada le asigna una sola salida. Como una máquina: metes x, sale f(x). Ejemplo: f(x) = 2x + 1 — metes 3, sale 7. Siempre el mismo 7 para el mismo 3, ahí está lo clave.' },
      { q: 'Me cuesta despejar x', keys: ['despejar','despeje','resolver x','pasar al otro lado'], a: 'Regla única: lo que está de un lado se pasa al otro haciendo lo contrario. Suma pasa restando, multiplicación pasa dividiendo, potencia pasa como raíz. Siempre despejando del lado donde está la x. Mándame tu ecuación y lo hacemos juntos.' },
      { q: '¿Qué es un mol en química?', keys: ['mol','moles','avogadro'], a: 'Es la unidad para contar partículas muy pequeñas. Un mol = 6.022 × 10²³ partículas. Igual que una docena son 12 cosas, un mol son 6.022 × 10²³ cosas. Sirve para que los cálculos de reacciones te den números manejables.' },
      { q: '¿Cuál es la diferencia entre masa y peso?', keys: ['masa','peso','gravedad','kg','newton'], a: 'Masa = cuánta materia tienes (en kg). Peso = la fuerza con que esa materia es jalada por la gravedad (en Newtons). En la Luna tu masa es la misma que aquí, pero pesas 6 veces menos porque la gravedad es menor.' },
    ],
  },
  internado: {
    role: 'Ing. guía de comportamiento',
    greet: 'Siéntate. Cuéntame qué pasó, o qué quieres saber del reglamento.',
    qa: [
      { q: '¿Cómo me tengo que presentar aquí?', keys: ['presentar','presentación','presentacion','aspecto','imagen','apariencia'], a: 'Uniforme completo y en buen estado, cabello según el corte establecido, camisa por dentro del pantalón, cincho puesto, calcetines y zapatos atados. Nada de roturas ni ropa desaliñada. Es falta menor (10 pts a la segunda vez).' },
      { q: '¿Qué pasa si no me baño?', keys: ['bañar','baño','ducha','higiene','bañarme','limpieza personal','rasurar'], a: 'Descuido de higiene personal es falta menor del reglamento. Primera vez, sanción formativa; si reincides, 10 pts. Aquí nos bañamos a diario, sin excusa por el frío — hay agua caliente, aprovéchala temprano.' },
      { q: '¿Puedo entrar al comedor con botas de campo?', keys: ['botas','comedor','campo','hule','calzado'], a: 'No. Las botas de hule o calzado de campo solo se usan en el módulo, no en comedor, biblioteca, aula ni residencia. Hacerlo es falta menor. Cámbiate antes de entrar a esos lugares.' },
      { q: '¿Qué pasa si olvido el carné?', keys: ['carné','carne','gafete','identificación','identificacion','olvido carné'], a: 'Es falta menor (10 pts a la segunda). El carné se porta dentro y fuera de la ENCA. Si lo perdiste, reporta a Control Académico el mismo día para que te emitan uno nuevo.' },
      { q: '¿A qué hora me tengo que levantar?', keys: ['levantar','levantarse','despertar','diana','timbre','hora mañana','hora manana'], a: 'Timbre a las 5 en punto. Una hora para lavarte, tender la cama y bajar a desayunar antes de las 6. El que se queda acostado después del timbre, llega atrasado a campo, y llegar tarde a una actividad es falta leve: 20 pts.' },
      { q: '¿A qué hora apagan las luces?', keys: ['luces','apagar','silencio','noche','dormir','10 pm'], a: 'Silencio a las 10 pm, luces fuera a las 10:15. Salir del cuarto después del conteo nocturno es falta moderada (30 pts). Si te quedas despierto molestando al cuarto, el demérito cae al grupo entero.' },
      { q: '¿Qué pasa si llego tarde a una actividad?', keys: ['llego tarde','llegar tarde','tarde actividad','atrasado','retraso'], a: 'Falta leve: 20 pts. Aplica a clase, campo, módulo, deporte, acto cívico — cualquier actividad oficial, dentro o fuera de la ENCA. El reglamento no distingue si fue un minuto o veinte.' },
      { q: 'Me quedé dormido y llegué tarde a campo', keys: ['dormido','quedé','quede','tarde campo'], a: '20 pts (falta leve). Dime la verdad: ¿a qué hora te acostaste? De 10 pm a 5 am son 7 horas — si no te alcanzan, algo estamos haciendo mal. Uno se perdona, dos es flojera, tres ya es expediente.' },
      { q: 'No volví a tiempo después de salir el fin de semana', keys: ['volver','regresar tarde','fin semana tarde','retraso permiso'], a: '20 pts (falta leve) por no cumplir horario de regreso. Si fue por fuerza mayor — enfermedad, accidente, transporte — repórtalo HOY a Supervisión Estudiantil con pruebas; pueden modificar la sanción. Si no avisas, el demérito se queda.' },
      { q: '¿Cómo tiene que quedar mi cuarto?', keys: ['cuarto','revisión cuarto','revision cuarto','cama','orden cuarto','desordenado','dormitorio'], a: 'Cama tendida, uniforme colgado, zapatos alineados, guardarropa cerrado con candado, escritorio despejado, basurero vacío. Mantenerlo desordenado es falta menor. Diario en 5 minutos, y nunca te agarra la revisión en curva.' },
      { q: '¿Qué pasa si no estoy en el dormitorio para el conteo?', keys: ['conteo','revisión nocturna','revision nocturna','ausente dormitorio'], a: 'Falta menor (10 pts a la segunda vez). El conteo existe para saber que estás a salvo. Si por algo justificado no vas a estar, avisa al supervisor antes, no después.' },
      { q: '¿Qué pasa si olvido el candado abierto?', keys: ['candado','llaves puestas','abierto','guardarropa','descuidar'], a: 'Descuidar bienes personales es falta menor. No es solo por el demérito — si te roban o pierdes algo, es tu responsabilidad. Cierra siempre, aunque salgas 2 minutos.' },
      { q: '¿Puedo cambiarme de cama o cuarto por mi cuenta?', keys: ['cambiar cama','cambiar cuarto','distribución','distribucion','cambio dormitorio'], a: 'No. La distribución la hacen las autoridades; no respetarla es falta leve (20 pts). Si quieres cambio, tramítalo con Vida Estudiantil explicando el motivo — lo pueden autorizar o no, pero no te muevas por tu cuenta.' },
      { q: '¿Puedo meter herramientas o agroquímicos al cuarto?', keys: ['herramientas cuarto','agroquímicos','agroquimicos','mascota','fertilizante cuarto','químico cuarto'], a: 'No. Falta moderada (30 pts). Las herramientas se quedan en el módulo, los químicos en bodega, y mascotas no se permiten en residencia. Es por tu seguridad y la de los demás.' },
      { q: '¿Puedo meter a mi familia o amigos a la residencia?', keys: ['familia residencia','amigos residencia','ajenos','meter personas','visita cuarto'], a: 'No, aunque sean tus papás. Consentir el ingreso de personas ajenas a la residencia es falta moderada (30 pts). Las visitas se reciben en lugares y horarios autorizados, registradas en prefectura.' },
      { q: '¿Puedo salir del cuarto después del conteo nocturno?', keys: ['salir cuarto noche','después conteo','despues conteo','escapar cuarto'], a: 'No. Salir de la residencia sin autorización después del conteo es falta moderada: 30 pts. Si tienes una emergencia real, avisa al supervisor de turno — no te salgas por tu cuenta.' },
      { q: '¿Puedo entrar a la residencia del sexo opuesto?', keys: ['sexo opuesto','residencia otro','dormitorio otro sexo','entrar residencia'], a: 'No. Ingresar sin autorización a dormitorios, baños o duchas del sexo opuesto es falta mayor: 40 pts. No hay excepciones — ni para traer algo, ni para despedirse, ni para "solo un momento".' },
      { q: '¿Qué pasa si rayamos o manchamos las paredes?', keys: ['rayar','manchar','escritorio pintar','pared','grafiti','rotular'], a: 'Falta moderada: 30 pts. Si no aparece el responsable, el demérito cae al grupo completo. Además, probablemente te toca repararlo o restituirlo. No vale la pena.' },
      { q: '¿Puedo usar celular en clase, campo o módulos?', keys: ['celular','teléfono','telefono','whatsapp','móvil','movil','tableta','laptop'], a: 'Solo si el profesor lo autoriza para una tarea. Usar celular, tablet o reproductor para fines no académicos durante clase, campo, módulo, laboratorio o ceremonia es falta moderada: 30 pts.' },
      { q: '¿Qué pasa si me encuentran con celular en el examen?', keys: ['celular examen','dispositivo examen','evaluación celular'], a: 'Falta grave: 50 pts. Aunque no estés copiando, tenerlo contigo en la evaluación cuenta igual. Entrégalo antes de empezar al supervisor.' },
      { q: 'Me vieron hablando con un compañero en el examen', keys: ['hablar examen','comunicación examen','susurrar'], a: 'Comunicación verbal durante evaluaciones es falta leve: 20 pts. Aunque haya sido para pedir borrador o saber la hora. Durante el examen, silencio total.' },
      { q: '¿Qué pasa si alguien hace mi examen por mí?', keys: ['sustituir examen','sustitución examen','suplantar'], a: 'Muy grave — receso disciplinario: pierdes un año académico. Vale para los dos, el que sustituye y el sustituido. Y a tu regreso, seguimiento psicológico obligatorio.' },
      { q: '¿Y si yo hago el examen de otro compañero?', keys: ['hago examen otro','ayudar examen','suplantar otro'], a: 'Lo mismo que si te sustituyen: muy grave, receso disciplinario, pierdes el año. Te están pidiendo que arriesgues tu beca por otro. No vale.' },
      { q: '¿Y si copio con una hoja o apuntes escondidos?', keys: ['copiar','copia examen','chuleta','hoja apuntes','material no autorizado'], a: 'Usar dispositivos no autorizados o material impreso en una evaluación es falta grave: 50 pts. Y si te pasan copias de la evaluación antes o modificas las pruebas, sube a muy grave (receso). Mejor el esfuerzo de estudiar.' },
      { q: '¿Cómo pido permiso para salir?', keys: ['permiso salir','solicitar permiso','boleta permiso','pedir permiso','autorización salir'], a: 'Con al menos 2 días hábiles de anticipación. Llenas la boleta, la pasa Coordinación Académica, y la autoriza Vida Estudiantil. Pedir el mismo día casi nunca sale. Para fin de semana, asueto o entre semestres, directo con el Coordinador de Vida Estudiantil.' },
      { q: 'Me ausenté de clase sin permiso', keys: ['ausente clase','ausencia','faltar clase','no fui','módulo ausente'], a: 'Ausentarse sin permiso de clase, laboratorio, campo, módulo o cualquier actividad programada es falta moderada: 30 pts. Si fue por salud, ve YA a clínica médica para que ellos justifiquen a Vida Estudiantil.' },
      { q: 'Estoy enfermo, ¿qué hago?', keys: ['enfermo','fiebre','dolor','mal','enfermería','enfermeria','clínica','clinica'], a: 'Avisa a la clínica médica lo antes posible — ellos te evalúan y reportan a Vida Estudiantil. No es demérito estar enfermo, pero sí lo es faltar sin reportar. Sin pasar por clínica, no hay justificación.' },
      { q: '¿Puedo salir el fin de semana?', keys: ['salir fin semana','casa','permiso salida','fin de semana'], a: 'Depende de tu comportamiento y autorización escrita de tus papás. Si tienes deméritos pendientes, no sale permiso — por cada 10 pts, un fin de semana sin salir, haciendo trabajo de producción sábado y domingo de 7 a 12.' },
      { q: '¿Puedo recibir visitas?', keys: ['visita','visitas','familia','papás','papas','novio visita','novia visita'], a: 'Sí, pero solo en días y horarios que fija la escuela, registrándose en prefectura al entrar. Las visitas no pueden pasar a la residencia (eso es falta moderada), ni quedarse fuera de horario.' },
      { q: 'No pude volver a tiempo del permiso', keys: ['no volver','no regresar','atrasado permiso','fuerza mayor','transporte'], a: 'Repórtalo YA a Supervisión Estudiantil con las justificaciones (transporte, enfermedad, etc.). Ellos lo pasan a Vida Estudiantil. Si no reportas, es falta leve (20 pts); si reportas con pruebas, pueden modificarla.' },
      { q: '¿Qué pasa si digo groserías?', keys: ['grosería','groseria','soez','palabrota','insulto compañero','malcriado'], a: 'Usar palabras soeces o señales inadecuadas entre compañeros es falta leve: 20 pts. No se trata solo del demérito — aquí se enseña a convivir con respeto, dentro y fuera de las instalaciones.' },
      { q: 'No me llevo con mi compañero de cuarto', keys: ['compañero cuarto','companero cuarto','pelea cuarto','roomie','diferencia cuarto'], a: 'Primero háblalo con él sin gritar. Si ya lo hiciste y no cambia, esto lo tiene que ver el prefecto, no yo. Ser intolerante y propiciar mala convivencia es falta leve (20 pts); no la dejes crecer.' },
      { q: 'Alguien me está haciendo bullying', keys: ['bullying','burla','sobrenombre','molestar','acosar','apodos'], a: 'Burlas, sobrenombres o mensajes ofensivos por cualquier medio son falta grave (50 pts) para quien los hace. Repórtalo HOY a Supervisión Estudiantil o conmigo acompañándote — con nombres, fechas, capturas si las hay. No lo aguantes solo.' },
      { q: '¿Qué pasa si me peleo a golpes?', keys: ['pelear golpes','pelea golpes','puños','riña','agresión física','agresion fisica'], a: 'Peleas con intercambio de golpes es falta muy grave: receso disciplinario, pierdes un año. Vale para los dos, no importa quién empezó. Si te provocan, hazte a un lado y repórtalo — es la única salida sin demérito ni suspensión.' },
      { q: '¿Qué es la antigüedad y por qué está prohibida?', keys: ['antigüedad','antiguedad','novatada','nuevos','primer año','vejamen'], a: 'Es cualquier maltrato o vejamen de estudiantes mayores a los nuevos. Es falta muy grave: receso disciplinario para quien la aplica. Si te la hacen, repórtalo. Si te invitan a hacerla, aléjate.' },
      { q: 'Vi a un compañero haciendo algo prohibido', keys: ['vi compañero','ver compañero','ver companero','reportar','encubrir','denuncia','delatar'], a: 'Si es falta mayor, grave, muy grave o gravísima (drogas, alcohol, pelea, armas, robo, etc.), estás OBLIGADO a reportar a Supervisión Estudiantil. Si no lo haces, te conviertes en encubridor y te cae la sanción inmediata inferior a la del otro. Callar aquí también cuesta.' },
      { q: '¿Qué pasa si falto el respeto a un profesor o supervisor?', keys: ['faltar respeto','profesor','supervisor','autoridad','rebeldía','rebeldia','desobediencia'], a: 'Faltar el respeto gravemente (verbal, por señas o escrito) o mostrar rebeldía a cualquier miembro de la comunidad educativa es falta muy grave: receso disciplinario. Si no estás de acuerdo con algo, hay canales para apelar — la rebeldía no es uno.' },
      { q: '¿Qué pasa si fumo?', keys: ['fumar','cigarro','cigarrillo','vape','vapear','tabaco','pipa'], a: 'Tener o fumar tabaco, cigarrillo electrónico o pipa en cualquier ambiente de la ENCA es falta mayor: 40 pts. También aplica en actividades externas de la escuela.' },
      { q: '¿Qué pasa si tomo alcohol aquí?', keys: ['alcohol','tomar alcohol','beber','licor','cerveza','embriagante','borracho'], a: 'Introducir, consumir, poseer o estar bajo efecto de cualquier bebida embriagante en la ENCA o en sus actividades es falta muy grave: receso disciplinario, pierdes un año. A tu regreso, seguimiento psicológico obligatorio.' },
      { q: '¿Qué pasa si me encuentran drogas?', keys: ['droga','marihuana','cocaína','cocaina','psicoactivo','narcótico','narcotico','estupefaciente'], a: 'Es falta gravísima: cancelación definitiva de beca. Introducir, consumir, poseer, vender, traficar o estar bajo efecto de cualquier sustancia psicoactiva te saca de la ENCA sin regreso. Esta es la línea más dura del reglamento.' },
      { q: '¿Puedo jugar cartas o apostar con amigos?', keys: ['cartas','naipes','dados','apostar','azar','rifa','viradas'], a: 'Juegos de azar (naipes, dados, viradas) con o sin apuesta, y rifas no autorizadas, son falta moderada: 30 pts. Si quieres jugar algo recreativo, pide permiso y que no involucre dinero ni bienes.' },
      { q: '¿Puedo tener pareja aquí?', keys: ['pareja','novio','novia','amor','relación','relacion','beso','abrazo'], a: 'Puedes tener afecto, pero el reglamento es claro: contacto físico más allá de un saludo breve es falta grave (50 pts). Besos, abrazos prolongados, caricias — todo entra ahí. Si va más allá (sexo-genital), es muy grave: receso.' },
      { q: '¿Qué pasa si nos encuentran en lugar oscuro después de las 6 pm?', keys: ['oscuro','furtivo','lugar oscuro','después 6','despues 6','escondido','perímetro'], a: 'Encontrarse furtivamente (solo, en pareja o grupo) después de las 18:00 en lugares oscuros o fuera del perímetro autorizado es falta mayor: 40 pts. Aunque no estén haciendo nada, el estar ahí ya es la infracción.' },
      { q: 'Me siento solo o extraño a mi familia', keys: ['solo','triste','extraño familia','extrano familia','deprimido','llorar','casa'], a: 'Es normal, sobre todo las primeras semanas. Casi todos pasamos por ahí. Si lo arrastras varios días, no te lo guardes — habla con el psicólogo o con un prefecto de confianza. Para eso están, no te van a juzgar. ¿Quieres que te diga con quién puedes buscar?' },
      { q: 'Me citó el psicólogo, ¿tengo que ir?', keys: ['psicólogo','psicologo','cita psicólogo','pedagogía','pedagogia','médico citado','medico citado'], a: 'Sí, es obligatorio. El reglamento dice que debes acudir a servicios médicos, psicológicos o pedagógicos cuando te citan. No ir sin justificación es falta. Y aparte, para eso están — van a ayudarte.' },
      { q: '¿Qué son los deméritos?', keys: ['demérito','demerito','puntos demérito','escala sanción'], a: 'Son puntos que te asigna una sanción cuando cometes una falta. Empiezas cada semestre con 0 y se van sumando. Escala: menor 10, leve 20, moderada 30, mayor 40, grave 50. A los 40 pts cae llamada de atención; a los 70, acta con padres; a los 100, receso o cancelación de beca.' },
      { q: '¿Qué pasa si acumulo 40 puntos?', keys: ['40 puntos','cuarenta puntos','llamada atención','llamada atencion'], a: 'Llamada de atención por escrito en tu expediente, y se notifica a tus papás por teléfono y por escrito. Más: por cada 10 pts, un fin de semana sin salir, haciendo trabajo de producción sábado y domingo de 7 a 12, y sesión psicológica sábado por la tarde.' },
      { q: '¿Qué pasa si acumulo 70 puntos?', keys: ['70 puntos','setenta puntos','acta compromiso','padres citar'], a: 'Se convoca a tus papás a la ENCA para firmar un acta de compromiso disciplinario ante el Consejo Disciplinario. Pasa a tu expediente. Y sigues con fines de semana sin salir por cada 10 pts.' },
      { q: '¿Qué pasa si acumulo 100 puntos?', keys: ['100 puntos','cien puntos','límite 100','limite 100','expulsar'], a: 'Si acumulaste por faltas menores, leves, moderadas o hasta 2 mayores: receso disciplinario (pierdes un año). Si incluye más de 2 mayores o 2 o más graves: cancelación definitiva de beca. En ambos casos, seguimiento psicológico obligatorio.' },
      { q: '¿Puedo apelar una sanción?', keys: ['apelar','apelación','apelacion','injusto','revisar sanción'], a: 'Sí. Tienes 2 días hábiles después de la notificación para apelar por escrito al Consejo Disciplinario, entregando en Control Académico. Incluye tus argumentos y pruebas. El Consejo tiene 5 días hábiles para resolver, y su fallo es inapelable.' },
      { q: '¿Qué necesito para que me den certificado de buena conducta?', keys: ['certificado','buena conducta','constancia','récord','record'], a: 'Requisitos: no más de 1 falta grave en toda tu carrera, 0 faltas muy graves, nunca haber acumulado 60+ pts en un mismo semestre, y no más de 200 pts en toda la carrera. Fuera de esos, la ENCA no puede emitirlo — ni cartas de recomendación membretadas.' },
    ],
  },
};

const FALLBACK = [
  'Esa todavía no la tengo apuntada. Déjame guardarla para el profe y la vemos mañana — ¿me la cuentas con más detalle?',
  'No te sé contestar esa con seguridad. Prefiero no inventar. Anótala y la preguntamos juntos al profesor del módulo.',
  'Mira, de esa no tengo respuesta todavía. Vamos a dejarla apuntada y la contestamos bien la próxima.',
];

function matchQuestion(text, mode) {
  const bank = BANK[mode];
  const t = (text || '').toLowerCase();
  let best = null, bestScore = 0;
  bank.qa.forEach((item) => {
    let score = 0;
    item.keys.forEach((k) => { if (t.includes(k.toLowerCase())) score++; });
    if (score > bestScore) { bestScore = score; best = item; }
  });
  return bestScore > 0 ? best : null;
}

async function logConversation({ mode, avatar, question, matched, answer, isFallback }) {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('pegasus_conversations').insert([{
      mode,
      avatar,
      question,
      matched_q: matched?.q || null,
      answer,
      fallback: isFallback,
    }]);
  } catch (e) {
    console.warn('Pegasus log skipped:', e.message);
  }
}

const MODES = [
  { id: 'campo', title: 'Campo', role: 'Ing. encargado de módulo', desc: 'Para prácticas, cultivos, animales. Respuesta corta y al grano.', accent: '#3F5E2A' },
  { id: 'clases', title: 'Clases', role: 'Ing. profesor', desc: 'Química, mates, biología. Explica, no te da la respuesta hecha.', accent: '#B8872B' },
  { id: 'internado', title: 'Internado', role: 'Ing. guía de comportamiento', desc: 'Horarios, cuarto, convivencia. Cercano pero firme.', accent: '#9A4C2E' },
];

export default function PegasusAssistantView({ onBack }) {
  const [mode, setMode] = useState(null);
  const [avatar, setAvatar] = useState(() => {
    try { return localStorage.getItem('pegasus_avatar') || 'agro'; } catch { return 'agro'; }
  });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [entering, setEntering] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState('pegasus');
  const messagesRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem('pegasus_avatar', avatar); } catch {}
  }, [avatar]);

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const openMode = (m) => {
    setMode(m);
    setMessages([]);
    setEntering(true);
    setTimeout(() => setEntering(false), 950);
    setTimeout(() => {
      setActiveSpeaker('pegasus');
      setMessages([{ who: 'pegasus', text: BANK[m].greet }]);
    }, 700);
  };

  const respond = (studentText) => {
    setActiveSpeaker('pegasus');
    setTimeout(() => {
      const match = matchQuestion(studentText, mode);
      const isFallback = !match;
      const reply = match ? match.a : FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
      setMessages((prev) => [...prev, { who: 'pegasus', text: reply }]);
      logConversation({ mode, avatar, question: studentText, matched: match, answer: reply, isFallback });
    }, 700);
  };

  const askQuick = (q) => {
    setMessages((prev) => [...prev, { who: 'student', text: q }]);
    setActiveSpeaker('student');
    respond(q);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = input.trim();
    if (!v) return;
    setMessages((prev) => [...prev, { who: 'student', text: v }]);
    setActiveSpeaker('student');
    setInput('');
    respond(v);
  };

  return (
    <div className="pegasus-view">
      <style>{PEGASUS_STYLES}</style>

      <div className="pegasus-header">
        <button className="pegasus-back" onClick={() => (mode ? setMode(null) : onBack?.())} type="button">
          <ArrowLeft size={14} /> {mode ? 'Cambiar modo' : 'Volver al inicio'}
        </button>
        <h2>Ing. Pegasus</h2>
        <span className="pegasus-subtitle">Asistente educativo ENCA · 90 respuestas guiadas</span>
      </div>

      {!mode && (
        <section>
          <div className="pegasus-hero">
            <div className="pegasus-hero-text">
              <h1>Hola, soy el <span className="accent">Ing. Pegasus</span></h1>
              <p>Trabajo en tres lugares de la escuela. Dime en cuál me necesitas y platicamos.</p>
              <div className="pegasus-hero-chips">
                <span>🌾 Encargado del módulo</span>
                <span>📚 Profesor de aula</span>
                <span>🏠 Guía del internado</span>
              </div>
            </div>
            <div className="pegasus-hero-portrait"><img src={IMG.pegassus} alt="Ing. Pegasus" /></div>
          </div>

          <div className="pegasus-avatar-section">
            <div><b>Tu avatar en la escena</b><div>Es quién aparece a la derecha cuando platicas con Pegasus.</div></div>
            <div className="pegasus-avatar-opts">
              {['agro','agi'].map((a) => (
                <button
                  key={a}
                  type="button"
                  className={`pegasus-avatar-btn ${avatar === a ? 'active' : ''}`}
                  onClick={() => setAvatar(a)}
                  aria-pressed={avatar === a}
                >
                  <img src={IMG[a]} alt={a} />
                  <span>{a === 'agi' ? 'AGI' : 'Agro'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pegasus-modes">
            {MODES.map((m) => (
              <button key={m.id} type="button" className="pegasus-mode-card" data-mode={m.id} onClick={() => openMode(m.id)}>
                <div className="pegasus-scene" data-mode={m.id} />
                <span className="pegasus-role">{m.role}</span>
                <span className="pegasus-mode-title">{m.title}</span>
                <span className="pegasus-mode-desc">{m.desc}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {mode && (
        <section>
          <div className="pegasus-scene-top" data-mode={mode}>
            <div className="pegasus-portraits">
              <div className={`pegasus-portrait ${activeSpeaker === 'pegasus' ? 'active talking' : ''} ${entering ? 'entering' : ''}`}>
                <img src={IMG.pegassus} alt="Ing. Pegasus" />
                <div className="pegasus-nameplate"><span>Ing. Pegasus</span><span className="role-tag">{BANK[mode].role}</span></div>
              </div>
              <div className={`pegasus-portrait student ${activeSpeaker === 'student' ? 'active talking' : ''} ${entering ? 'entering' : ''}`}>
                <img src={IMG[avatar]} alt="Estudiante" />
                <div className="pegasus-nameplate"><span>{avatar === 'agi' ? 'AGI' : 'Agro'}</span><span className="role-tag">Tú</span></div>
              </div>
            </div>
          </div>

          <div className="pegasus-chat">
            <div className="pegasus-messages" ref={messagesRef}>
              {messages.map((m, i) => (
                <div key={i} className={`pegasus-msg ${m.who}`}>
                  <span className="who">{m.who === 'pegasus' ? 'Ing. Pegasus' : (avatar === 'agi' ? 'AGI' : 'Agro')}</span>
                  <span>{m.text}</span>
                </div>
              ))}
            </div>
            <div className="pegasus-quick">
              <span className="pegasus-quick-label">Preguntas frecuentes · toca una</span>
              {BANK[mode].qa.slice(0, 8).map((item, i) => (
                <button key={i} type="button" className="pegasus-chip" onClick={() => askQuick(item.q)}>{item.q}</button>
              ))}
            </div>
            <form className="pegasus-composer" onSubmit={handleSubmit}>
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe tu pregunta…" />
              <button type="submit"><Send size={14} /> Enviar</button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}

const PEGASUS_STYLES = `
.pegasus-view { font-family: 'Inter', system-ui, sans-serif; color: #2A2419; max-width: 1120px; margin: 0 auto; padding: 16px; }
.pegasus-view * { box-sizing: border-box; }
.pegasus-header { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; border-bottom: 1px solid #D7CBA7; padding-bottom: 12px; margin-bottom: 20px; }
.pegasus-header h2 { font-family: 'Fraunces', Georgia, serif; font-weight: 500; font-size: 22px; margin: 0; }
.pegasus-subtitle { font-size: 11px; text-transform: uppercase; letter-spacing: .12em; color: #6E614A; }
.pegasus-back { display: inline-flex; align-items: center; gap: 6px; background: #EADFBE; border: 1px solid #D7CBA7; color: #2A2419; padding: 7px 12px; border-radius: 999px; cursor: pointer; font: inherit; font-size: 12px; }
.pegasus-hero { display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: center; background: #FBF6E8; border: 1px solid #D7CBA7; border-radius: 14px; padding: 24px 28px; margin-bottom: 24px; }
.pegasus-hero-text h1 { font-family: 'Fraunces', serif; font-weight: 500; font-size: clamp(26px, 4vw, 38px); margin: 0 0 10px; line-height: 1.08; }
.pegasus-hero-text .accent { color: #3F5E2A; }
.pegasus-hero-text p { color: #6E614A; margin: 0 0 14px; max-width: 55ch; }
.pegasus-hero-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.pegasus-hero-chips span { background: #EADFBE; color: #2A2419; border: 1px solid #D7CBA7; padding: 6px 12px; border-radius: 999px; font-size: 12.5px; }
.pegasus-hero-portrait { width: 180px; height: 240px; border-radius: 16px; overflow: hidden; border: 3px solid #3F5E2A; box-shadow: 0 10px 28px rgba(63,94,42,.3); animation: pegasusFloat 5s ease-in-out infinite; }
.pegasus-hero-portrait img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
@keyframes pegasusFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@media (max-width: 640px) { .pegasus-hero { grid-template-columns: 1fr; text-align: center; } .pegasus-hero-portrait { width: 140px; height: 190px; margin: 0 auto; } .pegasus-hero-chips { justify-content: center; } }

.pegasus-avatar-section { background: #FBF6E8; border: 1px solid #D7CBA7; border-radius: 14px; padding: 18px; margin-bottom: 20px; display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.pegasus-avatar-section b { display: block; font-family: 'Fraunces', serif; font-size: 18px; font-weight: 500; margin-bottom: 2px; }
.pegasus-avatar-section > div:first-child > div { font-size: 13px; color: #6E614A; }
.pegasus-avatar-opts { display: flex; gap: 10px; margin-left: auto; }
.pegasus-avatar-btn { background: #F3EDDA; border: 2px solid #D7CBA7; border-radius: 12px; padding: 6px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; font: inherit; color: #2A2419; width: 90px; }
.pegasus-avatar-btn img { width: 72px; height: 72px; object-fit: cover; object-position: top center; border-radius: 8px; }
.pegasus-avatar-btn span { font-size: 11px; color: #6E614A; }
.pegasus-avatar-btn.active { border-color: #3F5E2A; }
.pegasus-avatar-btn.active span { color: #3F5E2A; font-weight: 600; }

.pegasus-modes { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
.pegasus-mode-card { background: #FBF6E8; border: 1px solid #D7CBA7; border-radius: 14px; padding: 16px; cursor: pointer; text-align: left; color: inherit; font: inherit; display: flex; flex-direction: column; gap: 10px; min-height: 230px; transition: transform .18s ease, box-shadow .18s ease; }
.pegasus-mode-card:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(43,36,25,.14); }
.pegasus-scene { height: 110px; border-radius: 10px; }
.pegasus-scene[data-mode="campo"] { background: linear-gradient(180deg, #BED59B 0%, #6B8E42 65%, #3F5E2A 100%); }
.pegasus-scene[data-mode="clases"] { background: linear-gradient(180deg, #E8D28A 0%, #B8872B 100%); }
.pegasus-scene[data-mode="internado"] { background: linear-gradient(180deg, #6A8BA9 0%, #2E4A68 100%); }
.pegasus-role { font-size: 11px; color: #6E614A; text-transform: uppercase; letter-spacing: .1em; }
.pegasus-mode-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 500; }
.pegasus-mode-desc { font-size: 14px; color: #6E614A; }

.pegasus-scene-top { background: #FBF6E8; border: 1px solid #D7CBA7; border-radius: 14px; padding: 14px; margin-bottom: 18px; }
.pegasus-scene-top[data-mode="campo"] { background: linear-gradient(180deg, #FBF6E8, #E7EFD4); }
.pegasus-scene-top[data-mode="clases"] { background: linear-gradient(180deg, #FBF6E8, #E8D9B3); }
.pegasus-scene-top[data-mode="internado"] { background: linear-gradient(180deg, #FBF6E8, #CBD6E3); }
.pegasus-portraits { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; perspective: 1200px; padding: 10px 4px 20px; }
.pegasus-portrait { position: relative; border-radius: 14px; background: radial-gradient(ellipse at 50% 80%, #EADFBE 0%, #FBF6E8 70%); border: 3px solid #D7CBA7; aspect-ratio: 3 / 4.4; max-height: 420px; transition: filter .25s, opacity .25s, border-color .25s, box-shadow .25s, transform .4s cubic-bezier(.4,0,.2,1); filter: grayscale(.2) brightness(.78); opacity: .85; display: flex; align-items: flex-end; justify-content: center; transform-style: preserve-3d; }
.pegasus-portrait:not(.student) { transform: rotateY(14deg); transform-origin: right center; }
.pegasus-portrait.student { transform: rotateY(-14deg); transform-origin: left center; }
.pegasus-portrait:not(.student).active { transform: rotateY(10deg); }
.pegasus-portrait.student.active { transform: rotateY(-10deg); }
.pegasus-portrait img { width: 95%; height: 98%; object-fit: contain; object-position: center bottom; filter: drop-shadow(0 18px 18px rgba(0,0,0,.28)); transform-origin: bottom center; animation: pegasusIdleBob 4.8s ease-in-out infinite; position: relative; z-index: 1; }
@keyframes pegasusIdleBob { 0%, 100% { transform: translateY(0) rotate(-0.6deg); } 50% { transform: translateY(-8px) rotate(0.6deg); } }
.pegasus-portrait::after { content: ""; position: absolute; left: 20%; right: 20%; bottom: 8px; height: 14px; background: radial-gradient(ellipse at center, rgba(0,0,0,.35), transparent 70%); animation: pegasusShadowPulse 4.8s ease-in-out infinite; pointer-events: none; }
@keyframes pegasusShadowPulse { 0%, 100% { transform: scale(1); opacity: .75; } 50% { transform: scale(.82); opacity: .45; } }
.pegasus-portrait.active { filter: none; opacity: 1; border-color: #3F5E2A; box-shadow: 0 0 0 4px #DCE5C4, 0 14px 32px rgba(63,94,42,.35); }
.pegasus-scene-top[data-mode="clases"] .pegasus-portrait.active { border-color: #B8872B; box-shadow: 0 0 0 4px rgba(184,135,43,.25), 0 14px 32px rgba(184,135,43,.35); }
.pegasus-scene-top[data-mode="internado"] .pegasus-portrait.active { border-color: #9A4C2E; box-shadow: 0 0 0 4px rgba(154,76,46,.22), 0 14px 32px rgba(154,76,46,.35); }
.pegasus-portrait.talking img { animation: pegasusTalkBob 1.1s ease-in-out infinite; }
@keyframes pegasusTalkBob { 0%, 100% { transform: translateY(-4px) rotate(-1.2deg) scale(1); } 25% { transform: translateY(-10px) rotate(1deg) scale(1.01); } 50% { transform: translateY(-6px) rotate(-0.8deg) scale(1); } 75% { transform: translateY(-11px) rotate(1.2deg) scale(1.01); } }
.pegasus-portrait.entering:not(.student) img { animation: pegasusEnterLeft .9s cubic-bezier(.34,1.3,.64,1) both; }
.pegasus-portrait.entering.student img { animation: pegasusEnterRight .9s cubic-bezier(.34,1.3,.64,1) both; }
@keyframes pegasusEnterLeft { 0% { transform: translateX(-70%) translateY(10px) rotate(-6deg); opacity: 0; } 100% { transform: translateX(0) translateY(0) rotate(-0.6deg); opacity: 1; } }
@keyframes pegasusEnterRight { 0% { transform: translateX(70%) translateY(10px) rotate(6deg); opacity: 0; } 100% { transform: translateX(0) translateY(0) rotate(-0.6deg); opacity: 1; } }
.pegasus-nameplate { position: absolute; left: 0; right: 0; bottom: 0; padding: 10px 12px; background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,.72) 100%); color: #fff; font-size: 13px; font-weight: 500; display: flex; justify-content: space-between; z-index: 2; }
.pegasus-nameplate .role-tag { font-size: 9px; text-transform: uppercase; letter-spacing: .1em; opacity: .85; }

.pegasus-chat { background: #FBF6E8; border: 1px solid #D7CBA7; border-radius: 14px; display: flex; flex-direction: column; }
.pegasus-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; min-height: 220px; max-height: 340px; }
.pegasus-msg { max-width: 85%; padding: 10px 14px; border-radius: 14px; font-size: 14px; line-height: 1.5; animation: pegasusMsgIn .22s ease; }
@keyframes pegasusMsgIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.pegasus-msg.student { align-self: flex-end; background: #DCE5C4; color: #2A2419; border-bottom-right-radius: 4px; }
.pegasus-msg.pegasus { align-self: flex-start; background: #EADFBE; color: #2A2419; border-bottom-left-radius: 4px; }
.pegasus-msg .who { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: .1em; font-weight: 600; margin-bottom: 4px; }
.pegasus-msg.pegasus .who { color: #3F5E2A; }
.pegasus-msg.student .who { color: #6E614A; text-align: right; }
.pegasus-quick { padding: 10px 14px; border-top: 1px dashed #D7CBA7; display: flex; flex-wrap: wrap; gap: 6px; }
.pegasus-quick-label { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: #6E614A; width: 100%; margin-bottom: 2px; }
.pegasus-chip { background: transparent; border: 1px solid #D7CBA7; color: #6E614A; font: inherit; font-size: 12px; padding: 6px 10px; border-radius: 999px; cursor: pointer; }
.pegasus-chip:hover { border-color: #3F5E2A; color: #3F5E2A; }
.pegasus-composer { display: flex; gap: 8px; padding: 12px; border-top: 1px solid #D7CBA7; }
.pegasus-composer input { flex: 1; padding: 10px 14px; border-radius: 10px; border: 1px solid #D7CBA7; background: #F3EDDA; color: #2A2419; font: inherit; font-size: 14px; }
.pegasus-composer input:focus { outline: none; border-color: #3F5E2A; }
.pegasus-composer button { display: inline-flex; align-items: center; gap: 6px; background: #3F5E2A; color: #fff; border: none; padding: 10px 18px; border-radius: 10px; cursor: pointer; font: inherit; font-size: 14px; font-weight: 500; }

@media (prefers-reduced-motion: reduce) {
  .pegasus-portrait img, .pegasus-portrait.talking img, .pegasus-portrait.entering img, .pegasus-portrait::after, .pegasus-hero-portrait { animation: none; }
  .pegasus-portrait, .pegasus-portrait.student { transform: none; }
}
`;
