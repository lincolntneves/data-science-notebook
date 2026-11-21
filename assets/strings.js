'use strict';
const translations = {
  "Regressão linear": [
    "Linear regression",
    "Regresión lineal"
  ],
  "Quantos m² a equipe consegue instalar em um turno?": [
    "How many m² can the crew install in one shift?",
    "¿Cuántos m² puede instalar el equipo en un turno?"
  ],
  "A reta tem uma altura inicial e uma inclinação. O modelo escolhe os dois valores que minimizam a soma dos quadrados dos resíduos, as diferenças entre o que ocorreu e o que a reta previu.": [
    "The line has an intercept and a slope. The model chooses them to minimize the sum of squared residuals, the differences between observations and predictions.",
    "La recta tiene un intercepto y una pendiente. El modelo los elige para minimizar la suma de los residuos al cuadrado, las diferencias entre lo observado y lo predicho."
  ],
  "Para prever uma quantidade quando uma relação aproximadamente linear faz sentido. Aqui, cada hora extra muda a previsão de produção pela mesma quantidade.": [
    "Use it to predict a quantity when a roughly linear relationship makes sense. Here, each extra hour changes predicted output by the same amount.",
    "Úsala para predecir una cantidad cuando tenga sentido una relación aproximadamente lineal. Aquí, cada hora adicional cambia la producción predicha en la misma cantidad."
  ],
  "Um ponto extremo pode puxar a reta. Previsões muito além das horas observadas exigem cuidado.": [
    "An outlier can pull the fitted line. Be careful when predicting far outside the observed range.",
    "Un valor atípico puede arrastrar la recta ajustada. Ten cuidado al predecir lejos del rango observado."
  ],
  "Lembre de cabeça · O que representa a inclinação?": [
    "Recall · What does the slope represent?",
    "Repaso · ¿Qué representa la pendiente?"
  ],
  "Quanto a previsão de produção, em m², muda quando o tempo de trabalho aumenta em uma hora.": [
    "The change in predicted output, in m², for an extra hour of work.",
    "El cambio en la producción predicha, en m², por una hora adicional de trabajo."
  ],
  "Regressão logística": [
    "Logistic regression",
    "Regresión logística"
  ],
  "Qual é a probabilidade de uma tarefa atrasar?": [
    "How likely is a task to finish late?",
    "¿Qué probabilidad hay de que una tarea termine tarde?"
  ],
  "O modelo ajusta uma curva em S aos exemplos de tarefas que atrasaram (1) ou ficaram no prazo (0). Durante o treinamento, atribuir probabilidade muito baixa ao que de fato aconteceu recebe uma penalidade maior.": [
    "The model fits an S-curve to tasks that finished late (1) or on time (0). Training penalizes assigning very low probability to the outcome that actually occurred.",
    "El modelo ajusta una curva en S a tareas que terminaron tarde (1) o a tiempo (0). Durante el entrenamiento, asignar una probabilidad muy baja al resultado observado recibe una penalización mayor."
  ],
  "Para estimar a probabilidade de um evento com dois resultados possíveis. Um limiar transforma a probabilidade em uma decisão, como sinalizar uma tarefa para acompanhamento.": [
    "Use it to estimate the chance of an event with two outcomes. A threshold turns the probability into a decision, such as flagging a task for follow-up.",
    "Úsala para estimar la probabilidad de un evento con dos resultados posibles. Un umbral convierte la probabilidad en una decisión, como marcar una tarea para darle seguimiento."
  ],
  "Ao baixar o limiar, mais tarefas podem ser sinalizadas. Isso pode ajudar a detectar atrasos e também gerar mais alarmes falsos.": [
    "A lower threshold can flag more tasks, catching more delays and potentially causing more false alarms.",
    "Un umbral más bajo puede marcar más tareas, detectar más retrasos y generar más falsas alarmas."
  ],
  "Lembre de cabeça · Mudar o limiar muda a curva?": [
    "Recall · Does changing the threshold change the curve?",
    "Repaso · ¿Cambiar el umbral cambia la curva?"
  ],
  "A curva fica igual. Muda o ponto de corte usado para converter a probabilidade em uma decisão.": [
    "The curve stays the same. The cutoff used to turn probability into a decision changes.",
    "La curva se mantiene igual. Cambia el punto de corte que convierte la probabilidad en una decisión."
  ],
  "Árvore de decisão": [
    "Decision tree",
    "Árbol de decisión"
  ],
  "Com quantas pendências e pessoas aumenta o risco de atraso?": [
    "How do open items and crew size affect the estimated risk of delay?",
    "¿Cómo influyen los pendientes y el tamaño del equipo en el riesgo estimado de retraso?"
  ],
  "A árvore testa cortes nas entradas e escolhe, em cada etapa, a divisão que deixa os grupos mais homogêneos. Aqui ela usa a impureza de Gini para medir essa mistura de classes.": [
    "The tree tries candidate splits and chooses the one that makes the groups most alike within each group. Here it measures the class mix with Gini impurity.",
    "El árbol prueba divisiones y elige la que deja los grupos más homogéneos. Aquí mide la mezcla de clases con la impureza de Gini."
  ],
  "Para ver quais perguntas levam a uma previsão. Uma árvore pode combinar condições, como muitas pendências com uma equipe pequena.": [
    "Use it to see which questions lead to a prediction. A tree can combine conditions, such as many open items and a small crew.",
    "Úsalo para ver qué preguntas llevan a una predicción. Un árbol puede combinar condiciones, como muchos pendientes y un equipo pequeño."
  ],
  "Mais níveis permitem captar detalhes, inclusive peculiaridades dos dados de treino. Esse ajuste excessivo se chama overfitting.": [
    "More levels can capture small details, including quirks of the training data. Fitting those quirks is called overfitting.",
    "Más niveles captan más detalles, incluidas particularidades de los datos de entrenamiento. Ajustarse a esas particularidades se llama sobreajuste."
  ],
  "Lembre de cabeça · De onde vem a estimativa de uma folha?": [
    "Recall · Where does a leaf estimate come from?",
    "Repaso · ¿De dónde sale la estimación de una hoja?"
  ],
  "Da proporção de tarefas atrasadas entre os exemplos de treino que chegaram àquela folha.": [
    "From the fraction of late tasks among the training examples that reached the leaf.",
    "De la proporción de tareas atrasadas entre los ejemplos de entrenamiento que llegaron a esa hoja."
  ],
  "Horas trabalhadas": [
    "Hours worked",
    "Horas trabajadas"
  ],
  "Drywall instalado (m²)": [
    "Drywall installed (m²)",
    "Paneles instalados (m²)"
  ],
  "Menor erro": [
    "Lowest error",
    "Menor error"
  ],
  "Inclinação × altura da reta": [
    "Slope × line height",
    "Pendiente × altura de la recta"
  ],
  "Altura da superfície = erro quadrático médio": [
    "Surface height = mean squared error",
    "Altura de la superficie = error cuadrático medio"
  ],
  "Atraso da entrega (min)": [
    "Delivery delay (min)",
    "Retraso de la entrega (min)"
  ],
  "Minutos de atraso na entrega de material": [
    "Minutes the material delivery was late",
    "Minutos de retraso en la entrega de materiales"
  ],
  "Probabilidade de atraso": [
    "Probability of delay",
    "Probabilidad de retraso"
  ],
  "Pendências no início do turno": [
    "Open items at shift start",
    "Pendientes al iniciar el turno"
  ],
  "Pessoas na equipe": [
    "People on the crew",
    "Personas en el equipo"
  ],
  "Sim": [
    "Yes",
    "Sí"
  ],
  "Não": [
    "No",
    "No"
  ],
  "Pend.": [
    "Open",
    "Pend."
  ],
  "Pendências": [
    "Open items",
    "Pendientes"
  ],
  "Equipe": [
    "Crew",
    "Equipo"
  ],
  "Pessoas": [
    "People",
    "Personas"
  ],
  " atraso": [
    " late",
    " retraso"
  ],
  "Duração do turno": [
    "Shift length",
    "Duración del turno"
  ],
  "Girar superfície": [
    "Rotate surface",
    "Girar superficie"
  ],
  "Atraso na entrega de material": [
    "Material delivery delay",
    "Retraso en la entrega de materiales"
  ],
  "Limiar para sinalizar": [
    "Flagging threshold",
    "Umbral de alerta"
  ],
  "Profundidade máxima": [
    "Maximum depth",
    "Profundidad máxima"
  ],
  "Superfície 3D": [
    "3D surface",
    "Superficie 3D"
  ],
  "O erro para cada combinação de parâmetros": [
    "Error for each parameter combination",
    "Error por combinación de parámetros"
  ],
  "Produção observada e reta ajustada": [
    "Observed output and fitted line",
    "Producción observada y recta ajustada"
  ],
  "Incluir um ponto extremo": [
    "Include an outlier",
    "Incluir un valor atípico"
  ],
  "Acrescenta um turno de 8,7 h com 75 m² instalados e recalcula a reta.": [
    "Adds an 8.7-hour shift with 75 m² installed and refits the line.",
    "Añade un turno de 8,7 h con 75 m² instalados y vuelve a ajustar la recta."
  ],
  "Ajuste de menor erro": [
    "Lowest-error fit",
    "Ajuste de menor error"
  ],
  "Gire a superfície para ver o vale. Cada ponto combina uma inclinação com a altura da reta na duração média dos turnos. No fundo está o ajuste escolhido.": [
    "Rotate the surface to see the valley. Each point combines a slope and the line height at the average shift length. The bottom marks the fitted line.",
    "Gira la superficie para ver el valle. Cada punto combina una pendiente y la altura de la recta para la duración media de los turnos. En el fondo está el ajuste elegido."
  ],
  "Produção observada": [
    "Observed output",
    "Producción observada"
  ],
  "Ponto extremo": [
    "Outlier",
    "Valor atípico"
  ],
  "Reta ajustada": [
    "Fitted line",
    "Recta ajustada"
  ],
  "Sua previsão": [
    "Your prediction",
    "Tu predicción"
  ],
  "Os traços verticais mostram os resíduos. Ative o ponto extremo e compare quanto a inclinação e sua previsão mudam.": [
    "The vertical marks show residuals. Include the outlier and compare how the slope and your prediction change.",
    "Los trazos verticales muestran los residuos. Activa el valor atípico y compara cuánto cambian la pendiente y tu predicción."
  ],
  "Produção prevista": [
    "Predicted output",
    "Producción predicha"
  ],
  "Inclinação da reta: ": [
    "Slope: ",
    "Pendiente: "
  ],
  " m² por hora adicional.": [
    " m² per additional hour.",
    " m² por hora adicional."
  ],
  "Probabilidade estimada e ponto de corte": [
    "Estimated probability and cutoff",
    "Probabilidad estimada y punto de corte"
  ],
  "Mostrar a linha do limiar": [
    "Show the threshold line",
    "Mostrar la línea del umbral"
  ],
  "A decisão usa o limiar mesmo quando a linha está oculta.": [
    "The decision uses the threshold even when its line is hidden.",
    "La decisión usa el umbral aunque la línea esté oculta."
  ],
  " para 1": [
    " to 1",
    " a 1"
  ],
  "No prazo (0)": [
    "On time (0)",
    "A tiempo (0)"
  ],
  "Atrasou (1)": [
    "Late (1)",
    "Con retraso (1)"
  ],
  "Probabilidade ajustada": [
    "Fitted probability",
    "Probabilidad ajustada"
  ],
  "Sua tarefa": [
    "Your task",
    "Tu tarea"
  ],
  "Compare os pontos observados nos extremos com a curva. Mova o limiar para ver a decisão mudar enquanto a curva fica no mesmo lugar.": [
    "Compare the observed points at 0 and 1 with the curve. Move the threshold to see the decision change while the curve stays put.",
    "Compara los puntos observados en 0 y 1 con la curva. Mueve el umbral para ver cómo cambia la decisión mientras la curva se mantiene."
  ],
  "Probabilidade estimada": [
    "Estimated probability",
    "Probabilidad estimada"
  ],
  "Sinalizar atraso pelo limiar de ": [
    "Flag a delay at the threshold of ",
    "Marcar retraso con el umbral del "
  ],
  "Abaixo do limiar de ": [
    "Below the threshold of ",
    "Por debajo del umbral del "
  ],
  "Ver árvore": [
    "View tree",
    "Ver árbol"
  ],
  "Perguntas e caminho da previsão": [
    "Questions and prediction path",
    "Preguntas y recorrido de la predicción"
  ],
  "Regiões que compartilham a mesma previsão": [
    "Regions that share a prediction",
    "Regiones con la misma predicción"
  ],
  "O caminho verde mostra as perguntas da sua previsão. A porcentagem é a parcela de atrasos na folha. Em cada caixa, n indica quantos exemplos chegaram até ali.": [
    "The green path shows the questions behind your prediction. The percentage is the fraction of late tasks in the leaf. In each box, n is the number of examples that reached it.",
    "El recorrido verde muestra las preguntas de tu predicción. El porcentaje es la proporción de retrasos en la hoja. En cada caja, n indica cuántos ejemplos llegaron hasta allí."
  ],
  "No prazo": [
    "On time",
    "A tiempo"
  ],
  "Atrasou": [
    "Late",
    "Con retraso"
  ],
  "Cada retângulo representa uma folha. O fundo salmão indica maioria de atrasos entre os exemplos daquela região. Aumente a profundidade para ver os novos cortes.": [
    "Each rectangle represents a leaf. A salmon background marks a region with a majority of late tasks. Increase the depth to see new splits.",
    "Cada rectángulo representa una hoja. Un fondo salmón indica mayoría de retrasos en esa región. Aumenta la profundidad para ver divisiones nuevas."
  ],
  "Classe: atraso.": [
    "Class: late.",
    "Clase: retraso."
  ],
  "Classe: no prazo.": [
    "Class: on time.",
    "Clase: a tiempo."
  ],
  "Empate entre classes na folha.": [
    "Classes are tied in the leaf.",
    "Empate entre clases en la hoja."
  ],
  "Atraso estimado na folha": [
    "Estimated delay rate in the leaf",
    "Proporción estimada de retrasos en la hoja"
  ],
  " de ": [
    " of ",
    " de "
  ],
  " exemplos atrasaram. ": [
    " examples finished late. ",
    " ejemplos terminaron tarde. "
  ],
  "Laboratório": [
    "Lab",
    "Laboratorio"
  ],
  "As notas ficam neste navegador.": [
    "Notes stay in this browser.",
    "Las notas se guardan en este navegador."
  ],
  "Use a opção de baixar para guardar suas notas.": [
    "Use the download button to keep your notes.",
    "Usa el botón de descarga para guardar tus notas."
  ],
  "Notas salvas neste navegador.": [
    "Notes saved in this browser.",
    "Notas guardadas en este navegador."
  ]
};
const language = document.documentElement.lang;
const t = text => language === 'pt-BR' ? (text === 'Caderno de Estudos' ? 'Data Science Notebook' : text) : (translations[text]?.[language === 'es' ? 1 : 0] ?? text);
