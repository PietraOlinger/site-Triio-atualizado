/* ============================================================
   JAVASCRIPT — tudo simples e sem biblioteca externa
   ============================================================ */

/* 1. Cabeçalho ganha fundo sólido depois de rolar um pouco */
const cabecalho = document.getElementById('cabecalho');
window.addEventListener('scroll', () => {
  cabecalho.classList.toggle('rolado', window.scrollY > 40);
});

/* 2. Menu mobile: abre/fecha a navegação */
const hamburguer = document.getElementById('hamburguer');
const nav = document.getElementById('nav');

hamburguer.addEventListener('click', () => {
  const aberto = nav.classList.toggle('aberto');
  hamburguer.setAttribute('aria-expanded', aberto);
});

/* No celular não existe hover: o primeiro toque abre o painel do item,
   o segundo toque segue para a seção. */
document.querySelectorAll('.nav-item').forEach(item => {
  item.querySelector('.nav-link').addEventListener('click', evento => {
    if (window.innerWidth <= 980 && !item.classList.contains('aberto')) {
      evento.preventDefault();
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('aberto'));
      item.classList.add('aberto');
    } else {
      nav.classList.remove('aberto');
      hamburguer.setAttribute('aria-expanded', false);
    }
  });
});

/* 3. Abas dos depoimentos */
document.querySelectorAll('.aba').forEach(aba => {
  aba.addEventListener('click', () => {
    const alvo = aba.dataset.aba;

    document.querySelectorAll('.aba').forEach(b => b.classList.remove('ativa'));
    aba.classList.add('ativa');

    document.querySelectorAll('.painel-aba').forEach(p => {
      p.classList.toggle('ativo', p.dataset.painel === alvo);
    });
  });
});

/* 4. Vídeo do YouTube: só carrega o player quando o visitante clica.
      Isso mantém o carregamento do site leve. */
document.querySelectorAll('.capa[data-video]').forEach(capa => {
  capa.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = capa.dataset.video;
    iframe.title = 'Vídeo de apresentação do Triio';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture';
    iframe.allowFullscreen = true;
    capa.parentElement.appendChild(iframe);
    capa.remove();
  });
});

/* 5. Contadores dos números (+5 mil, +16, +76) */
function animarContador(elemento) {
  const final = Number(elemento.dataset.final);
  const prefixo = elemento.dataset.prefixo || '';
  const duracao = 1400;
  const inicio = performance.now();

  function passo(agora) {
    const progresso = Math.min((agora - inicio) / duracao, 1);
    // suaviza a chegada ao número final
    const suave = 1 - Math.pow(1 - progresso, 3);
    const valor = Math.round(final * suave);

    // acima de mil mostramos no formato "5 mil"
    elemento.textContent = final >= 1000
      ? prefixo + (valor / 1000).toFixed(valor >= 1000 ? 0 : 1) + ' mil'
      : prefixo + valor;

    if (progresso < 1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
}

/* 6. Um observador só: revela seções, anima contadores e gráficos
      quando eles entram na tela (e depois para de observar). */
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (!entrada.isIntersecting) return;
    const alvo = entrada.target;

    alvo.classList.add('visivel');

    // contadores dentro do elemento
    alvo.querySelectorAll('.contador').forEach(animarContador);

    // barras verticais do gráfico de locações
    alvo.querySelectorAll('.barra').forEach((barra, indice) => {
      setTimeout(() => { barra.style.height = barra.dataset.altura + '%'; }, indice * 110);
    });

    // barras horizontais dos estados
    alvo.querySelectorAll('.preenchimento').forEach((barra, indice) => {
      setTimeout(() => { barra.style.width = barra.dataset.largura + '%'; }, indice * 130);
    });

    observador.unobserve(alvo);
  });
}, { threshold: 0.25 });

document.querySelectorAll('.revelar').forEach(el => observador.observe(el));
